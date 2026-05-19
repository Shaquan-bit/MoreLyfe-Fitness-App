// lets a new user create an account

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, SharedStyles } from "../storage/Theme";
import { BrandLogo } from "../components/SharedComponents";
import { getUsers, saveUser } from "../storage/Storage";

export default function RegisterScreen({ navigation }) {
  // stores all the values typed into the register form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // these are the fitness goals the user can choose from
  const goalOptions = [
    "Lose Weight",
    "Build Muscle",
    "Improve Endurance",
    "Stay Healthy",
    "Increase Flexibility",
  ];

  // checks the form before the account is saved
  function validateForm() {
    const cleanAge = parseInt(age, 10);

    if (!fullName.trim()) {
      Alert.alert("Missing Field", "Please enter your full name.");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Missing Field", "Please enter your email.");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return false;
    }
    if (!age.trim()) {
      Alert.alert("Missing Field", "Please enter your age.");
      return false;
    }
    if (isNaN(cleanAge) || cleanAge < 10 || cleanAge > 100) {
      Alert.alert("Invalid Age", "Age must be between 10 and 100.");
      return false;
    }
    if (!fitnessGoal) {
      Alert.alert("Missing Field", "Please select a fitness goal.");
      return false;
    }
    if (!username.trim()) {
      Alert.alert("Missing Field", "Please enter a username.");
      return false;
    }
    if (username.length < 3) {
      Alert.alert("Too Short", "Username must be at least 3 characters.");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Missing Field", "Please enter a password.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  }

  // creates the account if the form is valid and the username is not taken
  async function handleRegister() {
    if (!validateForm()) return;

    // this checks if another user already has the same username
    const existingUsers = await getUsers();
    const usernameTaken = existingUsers.some(
      (us) => us.username.toLowerCase() === username.toLowerCase(),
    );

    if (usernameTaken) {
      Alert.alert(
        "Username Taken",
        "That username is already in use. Try another.",
      );
      return;
    }

    // this is the new user object that will be saved
    const newUser = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      age: age.trim(),
      fitnessGoal,
      username: username.trim(),
      password,
    };

    await saveUser(newUser);

    Alert.alert(
      "Account Created!",
      `Welcome, ${fullName}! You can now log in.`,
      [{ text: "Go to Login", onPress: () => navigation.navigate("Login") }],
    );
  }

  // shows the full register screen with all input fields and buttons
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoWrap}>
          <BrandLogo size={54} compact />
        </View>

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>
          Fill in your details to get started
        </Text>

        <Text style={SharedStyles.label}>Full Name</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="e.g. Chris Smith"
          placeholderTextColor={Colors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={SharedStyles.label}>Email Address</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="you@example.com"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={SharedStyles.label}>Age</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="e.g. 32"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={SharedStyles.label}>Fitness Goal</Text>
        {/* shows the goal choices as buttons */}
        <View style={styles.goalsRow}>
          {goalOptions.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.goalBtn,
                fitnessGoal === goal && styles.goalBtnActive,
              ]}
              onPress={() => setFitnessGoal(goal)}
            >
              <Text
                style={[
                  styles.goalBtnText,
                  fitnessGoal === goal && styles.goalBtnTextActive,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={SharedStyles.label}>Username</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="Choose a username"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={SharedStyles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[SharedStyles.input, styles.passwordInput]}
            placeholder="At least 6 characters"
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPass(!showPass)}
          >
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerBtnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLinkText}>
            Already have an account?{" "}
            <Text style={{ color: Colors.primary }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // styles for the register screen
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtn: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  logoWrap: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  goalsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  goalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  goalBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  goalBtnTextActive: {
    color: Colors.textDark,
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
  eyeBtn: {
    padding: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  registerBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  registerBtnText: {
    color: Colors.textDark,
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 18,
  },
  loginLinkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
