import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import { getFontSize } from "../utils/responsiveFn";
import { ActionPerDay } from "../types";
import AntIcon from "react-native-vector-icons/AntDesign";


interface ActionSummaryItemProps {
  icon: string;
  label: string;
  value: number;
  isFirstItem?: boolean;
}

const GridItem = memo(
  ({
    index,
    completedDays,
    action,
  }: {
    index: number;
    completedDays: number;
    action?: ActionPerDay;
  }) => (
    <View style={{ alignItems: "center", marginTop: getFontSize(1.5) }}>
      <View
        style={[
          styles.gridItem,
          index < completedDays && styles.gridItemCompleted,
        ]}
      >
        {action && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.gridItemText}>
              {action.completedAction}/{action.totalAction}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          color: Colors.white,
          fontSize: getFontSize(1.2),
          fontWeight: "600",
          marginTop: getFontSize(0.5),
          marginRight: getFontSize(0.7),
        }}
      >
        Day{index + 1}
      </Text>
    </View>
  )
);
const ActionSummaryItem = memo(
  ({ icon, label, value, isFirstItem = false }: ActionSummaryItemProps) => (
    <View
      style={[
        styles.calenderActionContainer,
        isFirstItem && { marginTop: getFontSize(4) },
      ]}
    >
      <View style={styles.calenderAction}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntIcon name={icon} size={getFontSize(2.5)} color={Colors.white} />
          <Text style={styles.calenderActionText}>{label}</Text>
        </View>
        <Text style={styles.calenderActionText}>{value}</Text>
      </View>
    </View>
  )
);

const CalendarGrid = memo(
  ({
    totalDays,
    completedDays,
    actionPerDay,
    totalActions,
    completedActions,
    failedActions,
    skippedActions,
  }: {
    totalDays: number;
    completedDays: number;
    actionPerDay: ActionPerDay[];
    totalActions: number;
    completedActions: number;
    failedActions: number;
    skippedActions: number;
  }) => {
    // Memoize the grid items array
    const gridItems = useMemo(
      () =>
        Array(totalDays)
          .fill(0)
          .map((_, index) => ({
            index,
            action: actionPerDay[index],
          })),
      [totalDays, actionPerDay]
    );
    const actionItems = useMemo(
      () => [
        { icon: "appstore-o", label: "TOTAL ACTIONS", value: totalActions },
        { icon: "check", label: "COMPLETED ACTIONS", value: completedActions },
        { icon: "close", label: "FAILED ACTIONS", value: failedActions },
        { icon: "arrowright", label: "SKIPPED ACTIONS", value: skippedActions },
      ],
      [totalActions, completedActions, failedActions, skippedActions]
    );

    return (
      <View style={styles.innerContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TOTAL DAYS</Text>
            <Text style={styles.statValue}>{totalDays} Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DAY STREAK</Text>
            <Text style={styles.statValue}>{completedDays} Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ACTION STREAK</Text>
            <Text style={styles.statValue}>14 Actions</Text>
          </View>
        </View>
        <View style={styles.gridContainer}>
          {gridItems.map(({ index, action }) => (
            <GridItem
              key={index}
              index={index}
              completedDays={completedDays}
              action={action}
            />
          ))}
        </View>
        {actionItems.map((item, index) => (
          <ActionSummaryItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            isFirstItem={index === 0}
          />
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1.5),
    padding: getFontSize(2),
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
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
});

export default CalendarGrid;
