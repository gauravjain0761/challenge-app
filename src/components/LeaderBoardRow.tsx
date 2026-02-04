import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getFontSize } from "../utils/responsiveFn";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LeaderboardUser } from "../types";

interface LeaderBoardRowProps {
  user: LeaderboardUser;
  position: number;
  variant?: boolean;
}

// LeaderboardRow Component
const LeaderBoardRow = memo(
  ({ user, position, variant }: LeaderBoardRowProps) => (
    <TouchableOpacity style={[styles.leaderboardRow, variant && {marginBottom: getFontSize(2.5)}]}>
      <View style={styles.leaderboardLeft}>
        <View style={styles.leaderBoardIndex}>
          <Text style={styles.position}>{position}</Text>
        </View>
        <FastImage
          source={require("@/assets/images/iceBath.png")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.userName}>{user.name}</Text>
            <View
              style={{
                height: getFontSize(2.5),
                width: getFontSize(10),
                backgroundColor: Colors.black,
                borderRadius: getFontSize(1),
                marginLeft: getFontSize(1.5),
                marginBottom: getFontSize(0.5),
              }}
            >
              <LinearGradient
                colors={[
                  "rgb(185, 183, 183)",
                  "rgb(56, 55, 55)",
                  // Colors.black,
                ]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.5, y: 0 }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: getFontSize(1),
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: getFontSize(0.5),
                }}
              >
                <Text style={styles.levelText}>{user.level}</Text>
              </LinearGradient>
            </View>
            {user.isFriend && (
              <Text
                style={{
                  marginLeft: getFontSize(2),
                  color: "#C05600",
                  fontWeight: "500",
                  fontSize: getFontSize(1.8),
                }}
              >
                Friend
              </Text>
            )}
          </View>
          <Text style={styles.statText}>
            {user.done} Done {user.fails} Fails {user.skips} Skips
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.leaderboardStreak,
          variant && styles.leaderboardVariantStreak,
        ]}
      >
        <Icon name="fire" size={getFontSize(1.8)} color={Colors.orange} />
        <Text
          style={{
            ...styles.streakCount,
            color: Colors.black,
            fontWeight: "600",
          }}
        >
          {user.streak}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

const styles = StyleSheet.create({
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: getFontSize(1),
    borderRadius: getFontSize(1),
  },
  activeRow: {
    backgroundColor: Colors.orange + "20",
    borderColor: Colors.orange,
    borderWidth: 1,
  },
  position: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: "500",
    //width: getFontSize(3),
  },
  leaderBoardIndex: {
    width: getFontSize(5),
    paddingTop: getFontSize(1.2),
    paddingBottom: getFontSize(1.2),
    paddingLeft: getFontSize(0.2),
    paddingRight: getFontSize(0.2),
    borderRadius: getFontSize(1.3),
    backgroundColor: Colors.textInputBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginRight: getFontSize(2),
  },
  leaderboardStreak: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: getFontSize(0.2),
    paddingBottom: getFontSize(0.2),
    paddingLeft: getFontSize(0.7),
    paddingRight: getFontSize(1),
    backgroundColor: Colors.white,
    borderRadius: getFontSize(1),
    justifyContent: "center",
    position: "absolute",
    top: getFontSize(5),
    right: getFontSize(30.5),
  },
  leaderboardVariantStreak: {
    right: getFontSize(37.7),
  },
  avatar: {
    width: getFontSize(5.5),
    height: getFontSize(5.5),
    borderRadius: getFontSize(2.75),
    marginRight: getFontSize(1),
  },
  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: getFontSize(0.1),
  },
  userName: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: "500",
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: Colors.inactiveTabColor,
    fontSize: getFontSize(1.4),
  },
  levelBadge: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: getFontSize(1),
    paddingVertical: getFontSize(0.5),
    borderRadius: getFontSize(1),
    marginRight: getFontSize(1),
  },
  levelText: {
    color: Colors.white,
    fontSize: getFontSize(1.2),
    marginLeft: getFontSize(1.5),
    textAlign: "center",
  },
  streakCount: {
    color: Colors.white,
    fontSize: getFontSize(1.4),
  },
});

export default memo(LeaderBoardRow);
