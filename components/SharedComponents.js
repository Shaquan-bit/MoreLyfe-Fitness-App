// this file has reusable parts that are used on different screens

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../storage/Theme";

//mylyfe logo
const logoImage = require("../assets/more-lyfe-fitness-logo.jpeg");

// shows a title and subtitle at the top of a screen
export function ScreenHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
    </View>
  );
}

// shows a small badge label on cards
export function Badge({ label, color }) {
  const bg = color || Colors.primary;
  const text = color ? "#FFFFFF" : Colors.textDark;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

// shows the app logo and lets the size be changed
export function BrandLogo({ size = 100, compact = false, style }) {
  return (
    <Image
      source={logoImage}
      style={[
        styles.logo,
        { width: size, height: size, borderRadius: size / 2 },
        compact && styles.logoCompact,
        style,
      ]}
      resizeMode="contain"
    />
  );
}

// shows a message when there is nothing in a list yet
export function EmptyState({ icon, message, hint }) {
  return (
    <View style={styles.empty}>
      <Ionicons
        name={icon || "folder-open-outline"}
        size={60}
        color={Colors.textSecondary}
      />
      <Text style={styles.emptyText}>{message}</Text>
      {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
    </View>
  );
}

// shows an image or a blank placeholder if there is no image
export function AppImage({ source, width, height, style }) {
  const imgStyle = [
    styles.appImg,
    { width: width || "100%", height: height || 160 },
    style,
  ];

  if (!source) return <View style={imgStyle} />;

  return <Image source={source} style={imgStyle} resizeMode="cover" />;
}

// shows a small box for stats like totals and progress
export function StatBox({ value, label, icon }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptyHint: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    opacity: 0.7,
  },
  appImg: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  logo: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  logoCompact: {
    marginBottom: 0,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 4,
  },
  statNum: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
});
