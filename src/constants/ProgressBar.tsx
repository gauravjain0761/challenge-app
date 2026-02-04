import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { getFontSize } from "../utils/responsiveFn";
import { Colors } from "./Colors";

const ProgressBar = memo(
  ({ remaining, total }: { remaining: number; total: number }) => {
    const percentage = useMemo(
      () => (remaining / total) * 100,
      [remaining, total]
    );

    return (
      <View style={styles.progressBar}>
        <LinearGradient
          colors={["rgba(239, 108, 0, 0.80)", "rgba(137, 62, 0, 0.80)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  progressBar: {
    height: getFontSize(1.5),
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(0.5),
    overflow: "hidden",
    width:"100%"
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.orange,
    borderRadius: getFontSize(0.5),
  },
});

export default ProgressBar;
