import { useState, useCallback, useMemo } from 'react';
import ActionsTab from '../components/ActionsTab';
import FriendsTab from '../components/FriendsTab';
import InfoTab from '../components/InfoTab';

interface Challenge {
    data: {
      description: string;
      rules: { 
          duration: string,
          actions: string, 
          timeOfDay: string,
          total_skip: string,
          time: string,
          level: string 
      }[];
    };
    whatWhyHow: {
      what: string;
      why: string;
      how: string;
    };
  }
export const useChallenge = (challenge: Challenge) => {
    const [activeTab, setActiveTab] = useState<'info' | 'actions' | 'friends'>('info');
  
    const TabContent = useCallback(() => {
      switch (activeTab) {
        case 'info':
          return (
            <InfoTab
              data={challenge?.data}
              whatWhyHow={challenge?.whatWhyHow}
            />
          );
        case 'actions':
          return <ActionsTab />;
        case 'friends':
          return <FriendsTab />;
        default:
          return null;
      }
    }, [activeTab, challenge]);
  
    return { activeTab, setActiveTab, TabContent };
  };
};