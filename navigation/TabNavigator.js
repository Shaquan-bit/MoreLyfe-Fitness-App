// bottom tab menu for the main app screens.
import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import MealPlansScreen from "../screens/MealPlansScreen";
import LogWorkoutScreen from "../screens/LogWorkoutScreen";
import ProgressScreen from "../screens/ProgressScreen";

import { Colors } from "../storage/Theme";
import { clearSession } from "../storage/Storage";

//helps functionality with android devices conflicting bottom navigation tabs

export default function TabNavigator({ navigation }) {
  const insets = useSafeAreaInsets();
  const bottomSpace = Math.max(insets.bottom, 8);

  // logs the user out and sends them back to the welcome screen.
  async function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: async () => {
          await clearSession();
          navigation.replace("Welcome");
        },
      },
    ]);
  }

  // chooses which icon for each tab.
  function getIcon(routeName, focused) {
    if (routeName === "Home") return focused ? "home" : "home-outline";
    if (routeName === "Exercises")
      return focused ? "barbell" : "barbell-outline";
    if (routeName === "Meal Plans")
      return focused ? "restaurant" : "restaurant-outline";
    if (routeName === "Log Workout")
      return focused ? "add-circle" : "add-circle-outline";
    return focused ? "trending-up" : "trending-up-outline";
  }

  // creates the bottom tab navigator with the appropriate screens and icons.
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: bottomSpace,
          paddingTop: 6,
          height: 57 + bottomSpace,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
          color: Colors.textPrimary,
        },
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} />
      <Tab.Screen name="Meal Plans" component={MealPlansScreen} />
      <Tab.Screen name="Log Workout" component={LogWorkoutScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
