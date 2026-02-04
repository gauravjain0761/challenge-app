import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskItem } from "./TaskItem";
import { getFontSize } from "@/utils/responsiveFn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Task } from "../types";

interface Group {
  title: string;
  data: Task[];
}

interface TaskGroupProps {
  group: Group;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({
  group,
  isExpanded,
  onToggle,
}) => {
  const isActionsView = group.title.includes("DAY");

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity
        style={[styles.header, isActionsView && styles.actionHeader]}
        onPress={onToggle}
      >
        {isActionsView && (
          <View
            style={{
              ...styles.dayContainer,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.dayTitle}>{group.title}</Text>
            <Text style={styles.count}>({group.data.length})</Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="white"
            />
          </View>
        )}
        {!isActionsView && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.title}>{group.title}</Text>
              <Text style={styles.count}>({group.data.length})</Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color="white"
              />
            </View>
          </>
        )}
        {/* {!isActionsView && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="white" 
          />
        )} */}
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[
            styles.contentContainer,
            isActionsView && styles.actionContent,
          ]}
        >
          <FlatList
            data={group.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskItem task={item} />}
            scrollEnabled={false}
            // ItemSeparatorComponent={() => isActionsView ? <View style={styles.separator} /> : null}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: getFontSize(2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getFontSize(1),
  },
  actionHeader: {
    marginBottom: 0,
    paddingVertical: getFontSize(0.5),
  },
  dayContainer: {
    flex: 1,
  },
  dayTitle: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: "600",
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: "bold",
  },
  count: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: getFontSize(1.8),
    marginRight: getFontSize(1),
    marginLeft: getFontSize(0.3),
  },
  contentContainer: {
    marginTop: getFontSize(0.8),
  },
  actionContent: {
    marginTop: getFontSize(0.5),
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: getFontSize(1),
  },
});
