// App.js
// This is where the app starts. It checks if someone is already
// logged in and loads sample data on the very first launch.

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import TabNavigator from "./navigation/TabNavigator";

import { getSession, initializeSampleData } from "./storage/Storage";
import { Colors } from "./storage/Theme";
import { BrandLogo } from "./components/SharedComponents";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function startApp() {
      await initializeSampleData();

      const currentUser = await getSession();
      setIsLoggedIn(!!currentUser);

      setIsLoading(false);
    }

    startApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <BrandLogo size={116} />
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 30 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={Colors.background} />

        <Stack.Navigator
          initialRouteName={isLoggedIn ? "MainApp" : "Welcome"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
