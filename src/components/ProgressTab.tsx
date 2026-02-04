import React, { memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { getFontSize } from "@/utils/responsiveFn";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import AntIcon from "react-native-vector-icons/AntDesign";
import LeaderBoardRow from "./LeaderBoardRow";
import { LeaderboardUser } from "../types";
import { router } from "expo-router";
import ProgressBar from "../constants/ProgressBar";
import CalendarGrid from "./CalenderGrid";

// Types
interface ProgressData {
  currentStreak: number;
  totalDays: number;
  dayStreak: number;
  actionStreak: number;
  totalActions: number;
  completedActions: number;
  failedActions: number;
  skippedActions: number;
  actionLevel: string;
  actionProgress: ActionProgress;
  leaderboard: LeaderboardUser[];
}

interface ActionPerDay {
  day: number;
  totalAction: number;
  completedAction: number;
}

interface ActionProgress {
  totalActions: number;
  completedActions: number;
  failedActions: number;
  skippedActions: number;
  actionPerDay: ActionPerDay[];
}

// Today's Progress Component
const TodayProgress = memo(({ progress }: { progress: ProgressData }) => (
  <View style={styles.innerContainer}>
    <View style={styles.todayHeader}>
      <View style={{ flex: 1 }}>
        <View style={{ ...styles.streakBadge, marginBottom: getFontSize(0.5) }}>
          <Text style={styles.todayTitle}>TODAY</Text>
          <Text style={styles.streakText}>CURRENT STREAK</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.actionCount}>
            {progress.completedActions}/{progress.totalActions} Actions
          </Text>
          <View style={styles.currentStreak}>
            <Icon name="fire" size={getFontSize(1.8)} color={Colors.orange} />
            <Text
              style={{
                ...styles.streakCount,
                color: Colors.black,
                fontWeight: "600",
              }}
            >
              {progress.currentStreak}d
            </Text>
          </View>
        </View>
      </View>
    </View>
    <ProgressBar
      remaining={progress.completedActions}
      total={progress.totalActions}
    />
  </View>
));

// Action Level Component
const ActionLevel = memo(({ actionLevel }: { actionLevel: string }) => (
  <View style={{ ...styles.innerContainer, marginTop: getFontSize(2) }}>
    <View style={styles.actionLevelHeader}>
      <View style={styles.actionLevelIcon}>
        <Icon
          name="lightning-bolt"
          size={getFontSize(4)}
          color={Colors.white}
        />
      </View>
      <View>
        <Text style={styles.actionLevelTitle}>Action Goal</Text>
        <Text style={styles.actionLevelValue}>{actionLevel}</Text>
      </View>
    </View>
    <View style={styles.actionLevelBars}>
      {[...Array(3)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.levelBar,
            index < 3 ? { backgroundColor: "rgba(192, 86, 0, 1)" } : null,
          ]}
        />
      ))}
    </View>
    <Text style={styles.actionLevelDesc}>
      Miss an action three times in a row, and you're out. Enjoy taking action!
    </Text>
  </View>
));

const LeaderboardPreview = memo(({ users }: { users: LeaderboardUser[] }) => {
  const handleActionBoardPress = useCallback(() => {
    router.push({
      pathname: "/leaderBoard",
      params: {
        users: JSON.stringify(users),
      },
    });
  }, [users]);

  return (
    <View style={{ ...styles.innerContainer, marginTop: getFontSize(2) }}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleActionBoardPress}
      >
        <Text style={styles.actionButtonText}>Action Board</Text>
      </TouchableOpacity>
      {users.slice(0, 3).map((user, index) => (
        <LeaderBoardRow key={user.id} user={user} position={index + 1} />
      ))}
    </View>
  );
});

// Main Progress Screen
const ProgressTab = () => {
  const progress: ProgressData = useMemo(
    () => ({
      currentStreak: 1,
      totalDays: 7,
      dayStreak: 4,
      actionStreak: 14,
      totalActions: 7,
      completedActions: 3,
      failedActions: 2,
      skippedActions: 0,
      actionLevel: "PERFECT",
      actionProgress: {
        totalActions: 19,
        completedActions: 11,
        failedActions: 5,
        skippedActions: 2,
        actionPerDay: [
          {
            day: 1,
            totalAction: 7,
            completedAction: 3,
          },
          {
            day: 2,
            totalAction: 2,
            completedAction: 1,
          },
          {
            day: 3,
            totalAction: 5,
            completedAction: 3,
          },
          {
            day: 4,
            totalAction: 4,
            completedAction: 4,
          },
        ],
      },
      leaderboard: [
        {
          id: 1,
          name: "John",
          level: "Advanced",
          done: 5,
          fails: 2,
          skips: 0,
          streak: 10,
        },
        {
          id: 2,
          name: "Stuart M.",
          level: "Intermediate",
          done: 8,
          fails: 2,
          skips: 0,
          streak: 8,
          isFriend: true,
        },
        {
          id: 3,
          name: "Wajid.",
          level: "Beginner",
          done: 3,
          fails: 2,
          skips: 0,
          streak: 1,
          isFriend: true,
        },
        {
          id: 4,
          name: "David.",
          level: "Begginner",
          done: 5,
          fails: 2,
          skips: 0,
          streak: 8,
        },
        {
          id: 5,
          name: "Johnathan",
          level: "Advanced",
          done: 5,
          fails: 2,
          skips: 0,
          streak: 10,
        },
        {
          id: 6,
          name: "Ali",
          level: "Intermediate",
          done: 8,
          fails: 2,
          skips: 0,
          streak: 8,
          isFriend: true,
        },
        {
          id: 7,
          name: "Peter",
          level: "Beginner",
          done: 3,
          fails: 2,
          skips: 0,
          streak: 1,
          isFriend: true,
        },
        {
          id: 8,
          name: "Drawid",
          level: "Begginner",
          done: 5,
          fails: 2,
          skips: 0,
          streak: 8,
        },
      ],
    }),
    []
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TodayProgress progress={progress} />
      <ActionLevel actionLevel={progress.actionLevel} />
      <Text style={styles.dateRange}>From Oct 28 - Dec 30</Text>
      <CalendarGrid
        totalDays={progress.totalDays}
        completedDays={progress.dayStreak}
        actionPerDay={progress.actionProgress.actionPerDay}
        totalActions={progress.actionProgress.totalActions}
        completedActions={progress.actionProgress.completedActions}
        failedActions={progress.actionProgress.failedActions}
        skippedActions={progress.actionProgress.skippedActions}
      />
      <LeaderboardPreview users={progress.leaderboard} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Today's Progress Styles
  innerContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1.5),
    padding: getFontSize(2),
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  streakText: {
    fontSize: getFontSize(1.6),
    color: Colors.white,
    fontWeight: "600",
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getFontSize(1),
  },
  todayTitle: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    fontWeight: "400",
  },
  currentStreak: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: getFontSize(0.2),
    paddingBottom: getFontSize(0.2),
    paddingLeft: getFontSize(0.7),
    paddingRight: getFontSize(1),
    backgroundColor: Colors.white,
    borderRadius: getFontSize(1),
    justifyContent: "center",
  },
  actionCount: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: "500",
    marginBottom: getFontSize(1),
  },
  // Action Level Styles
  actionLevelContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1.5),
    padding: getFontSize(2),
    width: "100%",
    marginTop: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  // ... Add all other necessary styles
  actionLevelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: getFontSize(1),
    marginBottom: getFontSize(1.5),
  },
  actionLevelIcon: {
    height: getFontSize(5.5),
    width: getFontSize(5.2),
    backgroundColor: Colors.textInputBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: getFontSize(1.2),
    marginRight: getFontSize(0.5),
  },
  actionLevelTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: "500",
    marginBottom: getFontSize(0.3),
  },
  actionLevelValue: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: "500",
  },
  actionLevelBars: {
    flexDirection: "row",
    gap: getFontSize(0.5),
    marginBottom: getFontSize(1.5),
  },
  levelBar: {
    flex: 1,
    height: getFontSize(1.5),
    backgroundColor: Colors.orange,
    borderRadius: getFontSize(0.4),
  },
  actionLevelDesc: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: getFontSize(1.8),
  },

  // Calendar Styles
  dateRange: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: "600",
    marginBottom: getFontSize(1),
    marginTop: getFontSize(3),
  },
  gridItemText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: getFontSize(1.8),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getFontSize(2),
  },
  statItem: {
    flex: 1,
  },
  calenderAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: getFontSize(1),
    paddingTop: getFontSize(1.5),
    paddingBottom: getFontSize(1.5),
  },
  calenderActionContainer: {
    //borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.textInputBackground,
    //marginTop: getFontSize(3),
  },
  calenderActionText: {
    color: Colors.white,
    marginLeft: getFontSize(1),
    fontSize: getFontSize(1.8),
    fontWeight: "600",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: getFontSize(1.4),
    marginBottom: getFontSize(0.5),
    fontWeight: "600",
  },
  statValue: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: "600",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getFontSize(0.5),
  },
  gridItem: {
    width: getFontSize(4),
    height: getFontSize(4),
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(0.5),
    marginRight: getFontSize(0.7),
  },
  gridItemCompleted: {
    borderWidth: 1,
    borderColor: Colors.orange,
  },

  // Stats Summary Styles
  statsContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: getFontSize(1.5),
    padding: getFontSize(2),
    margin: getFontSize(2),
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: getFontSize(1),
  },
  streakCount: {
    color: Colors.white,
    fontSize: getFontSize(1.4),
  },
  streakBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    position: "absolute",
    right: "38%",
    top: getFontSize(-1),
    height: getFontSize(3),
    width: "30%",
    backgroundColor: Colors.white,
    borderRadius: getFontSize(1.5),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: Colors.black,
    fontSize: getFontSize(1.8),
    fontWeight: "500",
  },
});

export default memo(ProgressTab);
