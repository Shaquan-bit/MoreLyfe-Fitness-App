import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../storage/Theme";
import { BrandLogo } from "../components/SharedComponents";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <BrandLogo size={122} />
        </View>

        <Text style={styles.appName}>MoreLyfe</Text>
        <Text style={styles.appSubtitle}>FITNESS</Text>

        <Text style={styles.tagline}>
          Track your workouts.{"\n"}Fuel your body.{"\n"}Live more.
        </Text>
      </View>

      <View style={styles.featuresRow}>
        <FeatureItem icon="barbell-outline" label="Exercises" />
        <FeatureItem icon="restaurant-outline" label="Meals" />
        <FeatureItem icon="trending-up-outline" label="Progress" />
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.creditText}>
          Mobile Apps Project by Clair Callender & Shaquan Ellis{"\n"}The
          Barbados Community College
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({ icon, label }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
    letterSpacing: 8,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },
  featureItem: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  bottomSection: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: 24,
  },
  registerButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  creditText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 18,
  },
});
