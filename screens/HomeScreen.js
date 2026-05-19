/* main dashboard for the app, shows the user summary, training focus,
recommended exercises, and quick progress information. */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, SharedStyles } from "../storage/Theme";
import {
  getSession,
  getMeals,
  getWorkouts,
  getExercises,
} from "../storage/Storage";
import { BrandLogo } from "../components/SharedComponents";

//the images used for the exercise recommendations for demo purposes

const workoutImages = {
  pushUps: require("../assets/push-ups.jpeg"),
  squats: require("../assets/squats.jpeg"),
  sitUps: require("../assets/sit-ups.jpeg"),
  run: require("../assets/10km-run.jpeg"),
};

export default function HomeScreen({ navigation }) {
  // state variables tht hold the saved app data used on the dashboard.
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState("Chest");

  // loading fresh data whenever the user comes back to the Home tab
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    const currentUser = await getSession();
    const savedMeals = await getMeals();
    const savedWorkouts = await getWorkouts();
    const savedExercises = await getExercises();

    setUser(currentUser);
    setMeals(savedMeals || []);
    setWorkouts(savedWorkouts || []);
    setExercises(savedExercises || []);
  }
  // helper functions to calculate the displayed information on the dashboard
  function getFirstName() {
    if (!user || !user.fullName) return "Friend";
    return user.fullName.split(" ")[0];
  }

  function getCalories() {
    let total = 0;
    meals.forEach((meal) => {
      total += parseInt(meal.calories) || 0;
    });
    return total;
  }

  function getWorkoutMinutes() {
    let total = 0;
    workouts.forEach((workout) => {
      total += parseInt(workout.totalDuration) || 0;
    });
    return total;
  }

  function getLatestWorkoutText() {
    if (workouts.length === 0) return "No workout logged yet";

    const lastWorkout = workouts[workouts.length - 1];
    const amount = lastWorkout.exercises?.length || 0;
    return `${amount} exercises in your last session`;
  }

  function getExerciseImage(exercise) {
    const name = (exercise.name || "").toLowerCase();
    const category = (exercise.category || "").toLowerCase();

    if (name.includes("push")) return workoutImages.pushUps;
    if (name.includes("squat")) return workoutImages.squats;
    if (name.includes("sit")) return workoutImages.sitUps;
    if (category === "cardio" || name.includes("run")) return workoutImages.run;

    return workoutImages.pushUps;
  }

  // picks the correct recommendations based on the selected muscle group
  function getRecommendedExercises() {
    const matchingExercises = exercises.filter((exercise) => {
      const name = (exercise.name || "").toLowerCase();
      const category = (exercise.category || "").toLowerCase();
      const muscle = (exercise.muscleGroup || "").toLowerCase();
      const searchText = `${name} ${category} ${muscle}`;

      if (selectedFocus === "Chest") {
        return searchText.includes("chest") || searchText.includes("push");
      }

      if (selectedFocus === "Back") {
        return (
          searchText.includes("back") ||
          searchText.includes("lat") ||
          searchText.includes("trap") ||
          searchText.includes("row")
        );
      }

      if (selectedFocus === "Shoulders") {
        return (
          searchText.includes("shoulder") ||
          searchText.includes("deltoid") ||
          searchText.includes("overhead") ||
          searchText.includes("push")
        );
      }

      if (selectedFocus === "Biceps & Triceps") {
        return (
          searchText.includes("bicep") ||
          searchText.includes("tricep") ||
          searchText.includes("arm") ||
          searchText.includes("push")
        );
      }

      if (selectedFocus === "Quads & Hamstrings") {
        return (
          searchText.includes("quad") ||
          searchText.includes("hamstring") ||
          searchText.includes("leg") ||
          searchText.includes("squat") ||
          searchText.includes("run")
        );
      }

      if (selectedFocus === "Glutes & Calves") {
        return (
          searchText.includes("glute") ||
          searchText.includes("calf") ||
          searchText.includes("calves") ||
          searchText.includes("leg") ||
          searchText.includes("squat")
        );
      }

      if (selectedFocus === "Core") {
        return (
          searchText.includes("core") ||
          searchText.includes("abs") ||
          searchText.includes("sit")
        );
      }

      return true;
    });

    return matchingExercises.slice(0, 2);
  }
  const focusOptions = [
    { label: "Chest", icon: "body-outline" },
    { label: "Back", icon: "accessibility-outline" },
    { label: "Shoulders", icon: "barbell-outline" },
    { label: "Biceps & Triceps", icon: "fitness-outline" },
    { label: "Quads & Hamstrings", icon: "walk-outline" },
    { label: "Glutes & Calves", icon: "footsteps-outline" },
    { label: "Core", icon: "ellipse-outline" },
  ];
  const recommendedExercises = getRecommendedExercises();

  return (
    <View style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.smallText}>Welcome back,</Text>
            <Text style={styles.nameText}>{getFirstName()}</Text>
          </View>

          <BrandLogo size={46} compact />
        </View>

        <ImageBackground
          source={workoutImages.squats}
          style={styles.heroCard}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroShade}>
            <Text style={styles.heroMini}>Ready for today?</Text>
            <Text style={styles.heroTitle}>
              Build your body one workout at a time
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate("Log Workout")}
            >
              <Ionicons name="play" size={16} color={Colors.textDark} />
              <Text style={styles.heroButtonText}>Start Training</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.statsRow}>
          <StatCard
            icon="fitness-outline"
            number={workouts.length}
            label="Workouts"
          />
          <StatCard icon="flame-outline" number={getCalories()} label="Kcal" />
          <StatCard
            icon="time-outline"
            number={getWorkoutMinutes()}
            label="Minutes"
          />
        </View>

        <Text style={styles.sectionTitle}>Training Focus</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.focusScroll}
        >
          {focusOptions.map((focus) => (
            <FocusChip
              key={focus.label}
              label={focus.label}
              icon={focus.icon}
              active={selectedFocus === focus.label}
              onPress={() => setSelectedFocus(focus.label)}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Exercises")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recommendedExercises.length === 0 ? (
          <View style={styles.emptyRecommend}>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>
              Add an exercise for {selectedFocus} to see it here.
            </Text>
          </View>
        ) : (
          recommendedExercises.map((exercise) => (
            <WorkoutCard
              key={exercise.id}
              image={getExerciseImage(exercise)}
              title={exercise.name}
              info={`${exercise.category} / ${exercise.muscleGroup || "General"}`}
              onPress={() => navigation.navigate("Exercises")}
            />
          ))
        )}

        <View style={styles.bottomCard}>
          <View style={styles.bottomIcon}>
            <Ionicons
              name="trending-up-outline"
              size={22}
              color={Colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomTitle}>Your Progress</Text>
            <Text style={styles.bottomText}>{getLatestWorkoutText()}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Progress")}>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, number, label }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FocusChip({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.focusChip, active && styles.focusChipActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? Colors.textDark : Colors.primary}
      />
      <Text style={[styles.focusText, active && styles.focusTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function WorkoutCard({ image, title, info, onPress }) {
  return (
    <TouchableOpacity style={styles.workoutCard} onPress={onPress}>
      <Image source={image} style={styles.workoutImage} />
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>{title}</Text>
        <Text style={styles.workoutSub}>{info}</Text>
      </View>
      <Ionicons name="play-circle" size={28} color={Colors.primary} />
    </TouchableOpacity>
  );
}

// styles for the HomeScreen and all the components

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 34,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  smallText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  nameText: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },
  heroCard: {
    height: 230,
    marginBottom: 16,
  },
  heroImage: {
    borderRadius: 22,
  },
  heroShade: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.48)",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroMini: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 15,
  },
  heroButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
  },
  heroButtonText: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },
  focusScroll: {
    marginBottom: 22,
  },
  focusChip: {
    width: 112,
    height: 82,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  focusChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  focusText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 7,
  },
  focusTextActive: {
    color: Colors.textDark,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 12,
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workoutImage: {
    width: 70,
    height: 58,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 13,
  },
  workoutTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  workoutSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  emptyRecommend: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  bottomCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 15,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bottomTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  bottomText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
});
