// log a workout session by picking exercises, filling in details, and saving it

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, SharedStyles } from "../storage/Theme";
import { getExercises, logWorkout } from "../storage/Storage";
import { ScreenHeader, EmptyState } from "../components/SharedComponents";

export default function LogWorkoutScreen() {
  // stores exercises, selected workout items, and form fields
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [notes, setNotes] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [pickModalVisible, setPickModalVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  // loads exercises so the user can choose what to log
  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    const data = await getExercises();
    if (data) setExercises(data);
  }

  // adds an exercise to the current workout
  function addExerciseToWorkout(exercise) {
    const alreadyAdded = selectedExercises.some((e) => e.id === exercise.id);

    if (alreadyAdded) {
      Alert.alert(
        "Already Added",
        `${exercise.name} is already in your workout.`,
      );
      return;
    }

    const workoutExercise = {
      id: exercise.id,
      name: exercise.name,
      sets: "3",
      reps: "10",
      weight: "",
      duration: "",
    };

    setSelectedExercises([...selectedExercises, workoutExercise]);
    setPickModalVisible(false);
  }

  // updates sets, reps, weight, or duration for one selected exercise
  function updateExerciseField(exId, field, value) {
    const updatedExercises = selectedExercises.map((exercise) => {
      if (exercise.id === exId) {
        return { ...exercise, [field]: value };
      }

      return exercise;
    });

    setSelectedExercises(updatedExercises);
  }

  function removeExercise(exId) {
    const updatedExercises = selectedExercises.filter(
      (exercise) => exercise.id !== exId,
    );
    setSelectedExercises(updatedExercises);
  }

  // saves the completed workout to local storage
  async function handleSaveWorkout() {
    if (selectedExercises.length === 0) {
      Alert.alert("No Exercises", "Please add at least one exercise to log.");
      return;
    }
    // makes a new workout object with the date, exercises, notes, and duration
    const newWorkout = {
      date: new Date().toISOString().split("T")[0],
      exercises: selectedExercises,
      notes: notes.trim(),
      totalDuration: totalDuration.trim() || "Not recorded",
    };

    // saves the workout to local storage
    await logWorkout(newWorkout);

    //clears form after the workout is saved and shows a success message
    setSelectedExercises([]);
    setNotes("");
    setTotalDuration("");
    setSaved(true);

    // hides the success message after a few seconds
    setTimeout(() => setSaved(false), 3000);

    Alert.alert("Workout Saved!", "Your workout has been logged.");
  }

  // confirms if the user wants to cancel the workout and lose entered data
  function handleCancel() {
    Alert.alert(
      "Cancel Workout",
      "Are you sure? All entered data will be lost.",
      [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Cancel Workout",
          style: "destructive",
          onPress: () => {
            setSelectedExercises([]);
            setNotes("");
            setTotalDuration("");
          },
        },
      ],
    );
  }
  // shows the main log workout screen
  return (
    <View style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Log Workout" subtitle="Record your session" />

      <ScrollView
        contentContainerStyle={SharedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {saved && (
          <View style={styles.successBanner}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.success}
            />
            <Text style={styles.successText}> Workout saved successfully!</Text>
          </View>
        )}

        <View style={styles.bannerPlaceholder}>
          <Ionicons name="fitness-outline" size={37} color={Colors.primary} />
          <Text style={styles.bannerText}>Get Active!</Text>
        </View>

        <Text style={SharedStyles.label}>Total Duration</Text>
        <TextInput
          style={SharedStyles.input}
          placeholder="e.g. 20 min"
          placeholderTextColor={Colors.textSecondary}
          value={totalDuration}
          onChangeText={setTotalDuration}
        />

        <TouchableOpacity
          style={styles.addExButton}
          onPress={() => setPickModalVisible(true)}
        >
          <Ionicons
            name="add-circle-outline"
            size={18}
            color={Colors.textDark}
          />
          <Text style={styles.addExButtonText}>Add Exercise</Text>
        </TouchableOpacity>
        {selectedExercises.length === 0 ? ( //shows either the list of selected exercises or an empty state if there are none
          <EmptyState
            icon="barbell-outline"
            message="No exercises added yet"
            hint="Tap 'Add Exercise' to pick from your list"
          />
        ) : (
          selectedExercises.map((exercise) => (
            <WorkoutExerciseRow
              key={exercise.id}
              exercise={exercise}
              onUpdate={(field, value) =>
                updateExerciseField(exercise.id, field, value)
              }
              onRemove={() => removeExercise(exercise.id)}
            />
          ))
        )}

        <Text style={[SharedStyles.label, { marginTop: 8 }]}>
          Workout Notes
        </Text>
        <TextInput
          style={[SharedStyles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="How'd it go? New gains? Struggles? Take note!"
          placeholderTextColor={Colors.textSecondary}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
          <Ionicons name="save-outline" size={18} color={Colors.textDark} />
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>

        {selectedExercises.length > 0 && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Workout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={pickModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={SharedStyles.row}>
              <Text style={styles.modalTitle}>Pick Exercise</Text>
              <TouchableOpacity onPress={() => setPickModalVisible(false)}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {exercises.length === 0 ? (
                <EmptyState
                  icon="barbell-outline"
                  message="No exercises found"
                  hint="Add exercises in the Exercises tab first"
                />
              ) : (
                exercises.map((exercise) => {
                  const alreadyAdded = selectedExercises.some(
                    (item) => item.id === exercise.id,
                  );

                  return (
                    <TouchableOpacity
                      key={exercise.id}
                      style={[
                        styles.pickItem,
                        alreadyAdded && styles.pickItemAdded,
                      ]}
                      onPress={() => addExerciseToWorkout(exercise)}
                      disabled={alreadyAdded}
                    >
                      <View>
                        <Text style={styles.pickItemName}>{exercise.name}</Text>
                        <Text style={styles.pickItemSub}>
                          {exercise.category} / {exercise.muscleGroup}
                        </Text>
                      </View>
                      {alreadyAdded ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={Colors.success}
                        />
                      ) : (
                        <Ionicons
                          name="add-circle-outline"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
// shows one selected exercise with inputs for sets, reps, weight, and duration
function WorkoutExerciseRow({ exercise, onUpdate, onRemove }) {
  return (
    <View style={styles.exRow}>
      <View style={[SharedStyles.row, { marginBottom: 12 }]}>
        <View style={styles.exNameRow}>
          <Ionicons name="barbell-outline" size={16} color={Colors.primary} />
          <Text style={styles.exName}> {exercise.name}</Text>
        </View>
        <TouchableOpacity onPress={onRemove}>
          <Ionicons
            name="remove-circle-outline"
            size={22}
            color={Colors.danger}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGrid}>
        <MiniInput // input component for the sets, reps, weight, and duration fields
          label="Sets"
          value={exercise.sets}
          onChangeText={(value) => onUpdate("sets", value)}
        />
        <MiniInput
          label="Reps"
          value={exercise.reps}
          onChangeText={(value) => onUpdate("reps", value)}
        />
        <MiniInput
          label="Weight"
          value={exercise.weight}
          onChangeText={(value) => onUpdate("weight", value)}
          placeholder="kg / lbs"
        />
        <MiniInput
          label="Duration"
          value={exercise.duration}
          onChangeText={(value) => onUpdate("duration", value)}
          placeholder="e.g. 5 min"
        />
      </View>
    </View>
  );
}
// small reusable input used inside each workout exercise row
function MiniInput({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.miniInputContainer}>
      <Text style={styles.miniLabel}>{label}</Text>
      <TextInput
        style={styles.miniInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "-"}
        placeholderTextColor={Colors.textSecondary}
        keyboardType={
          label === "Sets" || label === "Reps" ? "numeric" : "default"
        }
      />
    </View>
  );
}

// styles for the log workout screen
const styles = StyleSheet.create({
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#183821",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: { color: Colors.success, fontWeight: "600", fontSize: 14 },
  bannerPlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  bannerText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 18,
    marginTop: 8,
    letterSpacing: 1,
  },
  addExButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  addExButtonText: { color: Colors.textDark, fontWeight: "700", fontSize: 15 },
  exRow: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exNameRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  exName: { color: Colors.textPrimary, fontWeight: "700", fontSize: 15 },
  inputGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  miniInputContainer: { width: "47%" },
  miniLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: "600",
  },
  miniInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    padding: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  saveButtonText: { color: Colors.textDark, fontWeight: "800", fontSize: 15 },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  cancelButtonText: { color: Colors.danger, fontWeight: "700", fontSize: 15 },
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  pickItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickItemAdded: { opacity: 0.5 },
  pickItemName: { color: Colors.textPrimary, fontWeight: "600", fontSize: 14 },
  pickItemSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
});
