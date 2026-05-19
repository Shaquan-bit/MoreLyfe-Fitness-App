/* login screen. Checks username and password against saved users,
 then saves the session so the app knows who's logged in. */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, SharedStyles } from "../storage/Theme";
import { BrandLogo } from "../components/SharedComponents";
import { findUser, saveSession } from "../storage/Storage";

export default function LoginScreen({ navigation }) {
  // stores the user typed info into the login form.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // checks if the entered account exists then starts the session
  async function handleLogin() {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    const matchedUser = await findUser(cleanUsername, password);

    setLoading(false);

    if (matchedUser) {
      await saveSession(matchedUser);
      navigation.replace("MainApp");
    } else {
      Alert.alert(
        "Login Failed",
        "Incorrect username or password. Try demo / demo123",
      );
    }
  }
  // displays the login form with username, password, show password, and register link.
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <BrandLogo size={58} compact />
        </View>

        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>
          Log in to continue your fitness journey
        </Text>

        <Text style={SharedStyles.label}>Username</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="Enter your username"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={SharedStyles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[SharedStyles.input, styles.passwordInput]}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPass(!showPass)}
          >
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account?{" "}
            <Text style={{ color: Colors.primary }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
// styles for the login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    paddingTop: 52,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    justifyContent: "center",
  },
  iconContainer: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  demoHint: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoHintText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  eyeButton: {
    padding: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },
  loginButtonText: {
    color: Colors.textDark,
    fontWeight: "800",
    fontSize: 16,
  },
  registerLink: {
    alignItems: "center",
    marginTop: 20,
  },
  registerLinkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
