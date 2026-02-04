import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface Props {
  startDate?: string;
  title?: string;
  description?: string;
}

const ChallengeTimer: React.FC<Props> = ({
  startDate,
  description = 'Join and get notifications when it starts',
  title,
}) => {
  const targetDateRef = useRef<Date | null>(null);
  if (!targetDateRef.current && startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) targetDateRef.current = d;
  }
  const targetDate = targetDateRef.current;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calculateTimeLeft = useCallback((date: Date): TimeLeft | null => {
    const diff = date.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, []);

  // Now compute your display units _even if_ you’ll bail out later:
  const units = useMemo(
    () => [
      {value: timeLeft.days, unit: 'd'},
      {value: timeLeft.hours, unit: 'h'},
      {value: timeLeft.minutes, unit: 'm'},
      {value: timeLeft.seconds, unit: 's'},
    ],
    [timeLeft],
  );

  // 2. The effect still only runs once:
  useEffect(() => {
    if (!targetDate) {
      setLoading(false);
      return;
    }
    const tick = () => {
      const next = calculateTimeLeft(targetDate);
      if (next === null) {
        setIsLive(true);
        setLoading(false);
        clearInterval(intervalRef.current!);
      } else {
        setLoading(false);
        setTimeLeft(prev =>
          prev.days === next.days &&
          prev.hours === next.hours &&
          prev.minutes === next.minutes &&
          prev.seconds === next.seconds
            ? prev
            : next,
        );
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []); // empty deps

  // 3. Only *render* conditionally, but hooks have all been called:
  if (loading || isLive) return null;

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.title,
          title
            ? {marginBottom: getFontSize(1), fontSize: getFontSize(2.2)}
            : null,
        ]}>
        {title || 'Challenge not Started'}
      </Text>
      {description && <Text style={styles.subtitle}>{description}</Text>}
      <View style={styles.unitsContainer}>
        {units.map(({value, unit}) =>
          value > 0 || (unit === 's' && value >= 0) ? (
            <View key={unit} style={styles.unitBox}>
              <Text style={styles.unitText}>
                {value}
                {unit}
              </Text>
            </View>
          ) : null,
        )}
      </View>
    </View>
  );
};

export default React.memo(ChallengeTimer);

const styles = StyleSheet.create({
  wrapper: {marginTop: getFontSize(1), alignItems: 'center'},
  title: {
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    color: Colors.white,
    marginBottom: getFontSize(0.5),
  },
  subtitle: {
    fontSize: getFontSize(1.7),
    color: Colors.inactiveTabColor,
    marginBottom: getFontSize(1),
  },
  unitsContainer: {flexDirection: 'row'},
  unitBox: {
    height: getFontSize(6),
    padding: getFontSize(1.5),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getFontSize(1),
    marginRight: getFontSize(1),
  },
  unitText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
  },
});
