import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, SharedStyles } from "../storage/Theme";
import { getWorkouts } from "../storage/Storage";
import {
  ScreenHeader,
  StatBox,
  EmptyState,
} from "../components/SharedComponents";

export default function ProgressScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, []),
  );

  async function loadWorkouts() {
    const data = await getWorkouts();
    if (data) setWorkouts(data);
  }

  function openDetail(workout) {
    setSelectedWorkout(workout);
    setDetailVisible(true);
  }

  function formatDate(dateStr) {
    const date = dateStr ? new Date(dateStr) : null;
    if (!date || Number.isNaN(date.getTime())) {
      return "Unknown Date";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getMostPerformed() {
    const counts = {};
    let topExercise = "None yet";
    let topCount = 0;

    workouts.forEach((workout) => {
      (workout.exercises || []).forEach((exercise) => {
        const name = exercise.name;
        const count = (counts[name] = (counts[name] || 0) + 1);

        if (count > topCount) {
          topCount = count;
          topExercise = name;
        }
      });
    });

    return topExercise;
  }

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, workout) => {
    return sum + (workout.exercises?.length || 0);
  }, 0);
  const mostPerformed = getMostPerformed();

  return (
    <View style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Progress" subtitle="Your fitness journey" />

      <ScrollView
        contentContainerStyle={SharedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatBox
            value={totalWorkouts}
            label="Workouts"
            icon="trophy-outline"
          />
          <StatBox
            value={totalExercises}
            label="Exercises"
            icon="barbell-outline"
          />
        </View>

        <View style={styles.highlightCard}>
          <Ionicons name="star-outline" size={22} color={Colors.primary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.highlightLabel}>Most Performed Exercise</Text>
            <Text style={styles.highlightValue}>{mostPerformed}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Workout History</Text>

        {workouts.length === 0 ? (
          <EmptyState
            icon="time-outline"
            message="No workouts logged yet"
            hint="Head to 'Log Workout' to record your first session!"
          />
        ) : (
          workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => openDetail(workout)}
            >
              <View style={SharedStyles.row}>
                <View>
                  <Text style={styles.workoutDate}>
                    {formatDate(workout.date)}
                  </Text>
                  <Text style={styles.workoutMeta}>
                    {workout.exercises?.length || 0} exercise
                    {workout.exercises?.length !== 1 ? "s" : ""}
                    {workout.totalDuration ? " / " + workout.totalDuration : ""}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.textSecondary}
                />
              </View>

              <View style={styles.exTags}>
                {(workout.exercises || [])
                  .slice(0, 3)
                  .map((exercise, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{exercise.name}</Text>
                    </View>
                  ))}
                {(workout.exercises?.length || 0) > 3 && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      +{workout.exercises.length - 3} more
                    </Text>
                  </View>
                )}
              </View>

              {workout.notes ? (
                <Text style={styles.notesPreview} numberOfLines={1}>
                  Notes: {workout.notes}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={detailVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedWorkout && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={SharedStyles.row}>
                  <Text style={styles.modalTitle}>Workout Details</Text>
                  <TouchableOpacity onPress={() => setDetailVisible(false)}>
                    <Ionicons
                      name="close-circle"
                      size={28}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailMeta}>
                  <View style={styles.detailMetaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailMetaText}>
                      {" "}
                      {formatDate(selectedWorkout.date)}
                    </Text>
                  </View>
                  <View style={styles.detailMetaItem}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailMetaText}>
                      {"  "}
                      {selectedWorkout.totalDuration || "Duration not recorded"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailSectionLabel}>Exercises</Text>
                {(selectedWorkout.exercises || []).map((exercise, index) => (
                  <View key={index} style={styles.detailExRow}>
                    <Text style={styles.detailExName}>{exercise.name}</Text>
                    <View style={styles.detailExStats}>
                      {exercise.sets ? (
                        <DetailStat label="Sets" value={exercise.sets} />
                      ) : null}
                      {exercise.reps ? (
                        <DetailStat label="Reps" value={exercise.reps} />
                      ) : null}
                      {exercise.weight ? (
                        <DetailStat label="Weight" value={exercise.weight} />
                      ) : null}
                      {exercise.duration ? (
                        <DetailStat
                          label="Duration"
                          value={exercise.duration}
                        />
                      ) : null}
                    </View>
                  </View>
                ))}

                {selectedWorkout.notes ? (
                  <>
                    <Text style={styles.detailSectionLabel}>Notes</Text>
                    <Text style={styles.detailNotes}>
                      {selectedWorkout.notes}
                    </Text>
                  </>
                ) : null}

                <TouchableOpacity
                  style={[SharedStyles.primaryButton, { marginTop: 16 }]}
                  onPress={() => setDetailVisible(false)}
                >
                  <Text style={SharedStyles.primaryButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DetailStat({ label, value }) {
  return (
    <View style={styles.detailStat}>
      <Text style={styles.detailStatValue}>{value}</Text>
      <Text style={styles.detailStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  highlightLabel: { color: Colors.textSecondary, fontSize: 12 },
  highlightValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  workoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workoutDate: { color: Colors.textPrimary, fontWeight: "bold", fontSize: 15 },
  workoutMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  exTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  notesPreview: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  detailMeta: { marginBottom: 18 },
  detailMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailMetaText: { color: Colors.textSecondary, fontSize: 14 },
  detailSectionLabel: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  detailExRow: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailExName: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  detailExStats: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailStat: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    minWidth: 60,
  },
  detailStatValue: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
  detailStatLabel: { color: Colors.textSecondary, fontSize: 10, marginTop: 2 },
  detailNotes: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
