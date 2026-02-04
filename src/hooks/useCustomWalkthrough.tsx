import {useState, useEffect, useCallback} from 'react';
import {useAppSelector} from './reduxHooks';
import {getFontSize} from '@/utils/responsiveFn';
import {InteractionManager} from 'react-native';

export interface LayoutInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WalkthroughStep {
  isVisible: boolean;
  onLayout: (event: any) => void;
  start: () => void;
  next: () => void;
  previous: () => void;
  stop: () => void;
  layoutInfo?: LayoutInfo;
}

interface WalkthroughConfig {
  screenName: string;
  totalSteps: number;
  getAsyncFunction: () => Promise<string | null>;
  setAsyncFunction: () => Promise<void>;
  autoStart?: boolean;
  delay?: number;
}

interface UseCustomWalkthroughReturn {
  currentStep: number;
  isActive: boolean;
  steps: WalkthroughStep[];
  startWalkthrough: () => void;
  completeWalkthrough: () => void;
  stopWalkthrough: () => void;
  currentStepLayout?: LayoutInfo;
}

export const useCustomWalkthrough = (
  config: WalkthroughConfig,
): UseCustomWalkthroughReturn => {
  const {user} = useAppSelector(state => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [stepLayouts, setStepLayouts] = useState<{[key: number]: LayoutInfo}>(
    {},
  );

  const {
    screenName,
    totalSteps,
    getAsyncFunction,
    setAsyncFunction,
    autoStart = true,
    delay = 100,
  } = config;

  // Initialize walkthrough on mount if needed
  useEffect(() => {
    if (!hasInitialized && autoStart) {
      const initializeWalkthrough = async () => {
        const isSkipped = await getAsyncFunction();

        // AsyncStorage returns null when key doesn't exist, and "false" when completed
        if (isSkipped === null) {
          setTimeout(() => {
            startWalkthrough();
          }, delay);
        }

        setHasInitialized(true);
      };

      initializeWalkthrough();
    }
  }, [
    hasInitialized,
    autoStart,
    delay,
    screenName,
    getAsyncFunction,
  ]);

  const startWalkthrough = useCallback(() => {
    setIsActive(true);
    setCurrentStep(1); // Start with step 1
  }, [screenName]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;

      // If we've reached the last step, complete the walkthrough
      if (next > totalSteps) {
        completeWalkthrough();
        return prev;
      }

      return next;
    });
  }, [screenName, totalSteps]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => {
      const previous = prev - 1;

      // Don't go below step 1
      if (previous < 1) {
        return prev;
      }

      return previous;
    });
  }, [screenName]);

  const completeWalkthrough = useCallback(async () => {
    setIsActive(false);
    setCurrentStep(0);
    await setAsyncFunction(); // Mark as completed
  }, [screenName, setAsyncFunction]);

  const stopWalkthrough = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, [screenName]);

  // Handle layout measurements

  const handleLayout = useCallback(
    (stepNumber: number, event: any) => {
      // Persist event since we’re using it async
      event.persist?.();
      const {width, height} = event.nativeEvent.layout;
  
      const measure = () => {
        if (!event?.target?.measureInWindow) return;
  
        event.target.measureInWindow((pageX: number, pageY: number) => {
          let layoutInfo: LayoutInfo;
  
          if (screenName === 'InProgressChallenge') {
            layoutInfo = {
              x: pageX - getFontSize(1.3),
              y: pageY - getFontSize(33.65),
              width,
              height: height + getFontSize(1),
            };
          } else if (
            screenName === 'ExploreInfoLayout' ||
            screenName === 'ExploreInfoSteps'
          ) {
            layoutInfo = {
              x: pageX,
              y: pageY - getFontSize(31.65),
              width,
              height,
            };
          } else {
            layoutInfo = {x: pageX, y: pageY, width, height};
          }
  
          setStepLayouts(prev => ({
            ...prev,
            [stepNumber]: layoutInfo,
          }));
        });
      };
  
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(measure);
        });
      });
    },
    [screenName],
  );
  

  // Generate steps dynamically
  const steps: WalkthroughStep[] = Array.from(
    {length: totalSteps},
    (_, index) => {
      const stepNumber = index + 1;
      const isLastStep = stepNumber === totalSteps;
      const isFirstStep = stepNumber === 1;

      return {
        isVisible: isActive && currentStep === stepNumber,
        onLayout: (event: any) => handleLayout(stepNumber, event),
        start: startWalkthrough,
        next: isLastStep ? completeWalkthrough : nextStep,
        previous: isFirstStep ? () => {} : previousStep, // No-op for first step
        stop: stopWalkthrough,
        layoutInfo: stepLayouts[stepNumber],
      };
    },
  );

  return {
    currentStep,
    isActive,
    steps,
    startWalkthrough,
    completeWalkthrough,
    stopWalkthrough,
    currentStepLayout: stepLayouts[currentStep],
  };
};
