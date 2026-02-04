import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AudioInput from '../AudioInput';
import Button from '@/components/Button';

const QuestionView = ({
  question,
  onPress = () => {},
  isLoading,
}: {
  question: string;
  onPress: () => void;
  isLoading?: boolean;
}) => {
  const [answer, setAnswer] = useState<any>(null);

  return (
    <View style={styles.container}>
      <AudioInput
        question={question || ''}
        onAnswerChange={({text, audio}) => {
          setAnswer({text, audio});
        }}
      />
      {(answer?.text !== '' || answer?.audio !== null) && (
        <Button
          title={isLoading ? 'Completing...' : 'Complete'}
          disabled={isLoading}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default QuestionView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
