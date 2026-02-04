import {Redirect, useLocalSearchParams} from 'expo-router';

export default function ScheduleChallengeIndexScreen() {
  const params = useLocalSearchParams();
  const challengeId = params?.id;

  return <Redirect href={`/(modals)/(myChallenges)/(scheduledChallenges)/${challengeId}/info`} />;
}
