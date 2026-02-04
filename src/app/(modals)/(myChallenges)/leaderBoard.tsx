import React, { memo, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Header } from "@/components/Header";
import { LeaderboardUser } from "@/types";
import LeaderBoardRow from "@/components/LeaderBoardRow";
import { getFontSize } from "@/utils/responsiveFn";
import ProgressBar from "@/constants/ProgressBar";

// LeaderBoard Screen Component
const LeaderBoard = memo(() => {
  const { users: usersParam } = useLocalSearchParams();

  const users: LeaderboardUser[] = useMemo(() => {
    try {
      return JSON.parse(
        Array.isArray(usersParam) ? usersParam[0] : usersParam || "[]"
      );
    } catch (error) {
      console.error("Error parsing users:", error);
      return [];
    }
  }, [usersParam]);

  const renderItem = useCallback(
    ({ item, index }: { item: LeaderboardUser; index: number }) => (
      <LeaderBoardRow user={item} position={index + 1} variant={true} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: LeaderboardUser) => item.id.toString(),
    []
  );

  return (
    <View style={styles.container}>
      <Header title={`  Action Board`} icon={true} />
      <LinearGradient
        colors={["#000", "#000", Colors.orangeOpacity]}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.innerContainer}>
            <Text
              style={styles.heading}
            >
              MEN REMAINING 320/2000
            </Text>
            <ProgressBar remaining={320} total={2000} />
          </View>
          <View
            style={{
              ...styles.innerContainer,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderWidth: 0,
            }}
          >
            <Text
              style={styles.heading}
            >
              “The only time you really fail is when you fall down and stay
              down.”
            </Text>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.60)",
                textAlign: "center",
                fontWeight: "400",
                fontSize: getFontSize(1.8),
              }}
            >
              — Stephen Richards
            </Text>
          </View>
        </View>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </LinearGradient>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  innerContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1.5),
    padding: getFontSize(2),
    width: "95%",
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginTop: getFontSize(2),
    height: getFontSize(12),
  },
  heading:{
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: "400",
    textAlign: "center",
    marginBottom: getFontSize(3),
  },
  tabContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  levelSection: {
    marginBottom: getFontSize(3),
  },
  levelText: {
    color: "white",
    fontSize: getFontSize(2.2),
    fontWeight: "600",
  },
  content: {
    paddingBottom: getFontSize(2),
    marginTop: getFontSize(3),
  },
});

export default LeaderBoard;
