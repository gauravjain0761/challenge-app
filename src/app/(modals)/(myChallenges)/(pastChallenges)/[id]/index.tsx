import {Redirect, useLocalSearchParams} from 'expo-router';

export default function PastChallengeIndexScreen() {
  const params = useLocalSearchParams();
  const challengeId = params?.id;

  return (
    <Redirect
      href={`/(modals)/(myChallenges)/(pastChallenges)/${challengeId}/progress`}
    />
  );
}
