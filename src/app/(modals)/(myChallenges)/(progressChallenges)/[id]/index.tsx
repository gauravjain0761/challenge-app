import {Redirect, useLocalSearchParams} from 'expo-router';

export default function ProgressChallengeIndexScreen() {
  const params = useLocalSearchParams();
  const challengeId = params?.id;

  if (params?.isProgress === 'true') {
    return (
      <Redirect
        href={`/(modals)/(myChallenges)/(progressChallenges)/${challengeId}/progress`}
      />
    );
  }
  if (params?.isFriendNudge === 'true') {
    return (
      <Redirect
        href={`/(modals)/(myChallenges)/(progressChallenges)/${challengeId}/leaderboard/?encodedItem=${JSON.stringify(
          params,
        )}`}
      />
    );
  }

  return (
    <Redirect
      href={`/(modals)/(myChallenges)/(progressChallenges)/${challengeId}/actions`}
    />
  );
}
