import {Redirect, useLocalSearchParams} from 'expo-router';

export default function ChallengeIndexScreen() {
  const params = useLocalSearchParams();
  const challengeId = params?.id;

  return (
    <Redirect href={`/(modals)/(exploreChallenges)/${challengeId}/info`} />
  );
}
