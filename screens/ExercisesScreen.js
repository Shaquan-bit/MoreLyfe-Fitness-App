// shows all exercises. CRUD functionality

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
import {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
} from "../storage/Storage";
import {
  ScreenHeader,
  Badge,
  EmptyState,
  AppImage,
} from "../components/SharedComponents";

//  images for certain exercises based on name or category

const exerciseImages = {
  pushUp: require("../assets/push-ups.jpeg"),
  squat: require("../assets/squats.jpeg"),
  sitUps: require("../assets/sit-ups.jpeg"),
  cardio: require("../assets/10km-run.jpeg"),
};

export default function ExercisesScreen() {
  // stores the exercise list, modal state, and form values
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formMuscleGroup, setFormMuscleGroup] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("");
  const [formInstructions, setFormInstructions] = useState("");

  const categories = ["Strength", "Cardio", "Core", "Flexibility", "Other"];
  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps & Triceps",
    "Quads & Hamstrings",
    "Glutes & Calves",
    "Core",
  ];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  // loads saved exercises when the screen first opens
  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    const data = await getExercises();
    if (data) setExercises(data);
  }

  // opens the form for adding a new exercise
  function openAddModal() {
    setEditingExercise(null);
    clearForm();
    setModalVisible(true);
  }

  // opens the form and fills it with the exercise being edited
  function openEditModal(exercise) {
    setEditingExercise(exercise);
    setFormName(exercise.name);
    setFormCategory(exercise.category);
    setFormMuscleGroup(exercise.muscleGroup);
    setFormDifficulty(exercise.difficulty);
    setFormInstructions(exercise.instructions);
    setModalVisible(true);
  }

  // clears the form values when closing the modal or after saving
  function clearForm() {
    setFormName("");
    setFormCategory("");
    setFormMuscleGroup("");
    setFormDifficulty("");
    setFormInstructions("");
  }

  // saves either a new exercise or updates an existing one
  async function handleSave() {
    if (
      !formName.trim() ||
      !formCategory ||
      !formMuscleGroup ||
      !formDifficulty
    ) {
      Alert.alert(
        "Missing Fields",
        "Please fill in name, category, muscle group, and difficulty.",
      );
      return;
    }

    if (editingExercise) {
      const updated = {
        ...editingExercise,
        name: formName,
        category: formCategory,
        muscleGroup: formMuscleGroup,
        difficulty: formDifficulty,
        instructions: formInstructions,
      };
      await updateExercise(updated);
      Alert.alert("Updated!", "Exercise has been updated.");
    } else {
      const newExercise = {
        name: formName.trim(),
        category: formCategory,
        muscleGroup: formMuscleGroup.trim(),
        difficulty: formDifficulty,
        instructions: formInstructions.trim(),
      };
      await addExercise(newExercise);
      Alert.alert("Added!", "New exercise has been added.");
    }

    await loadExercises();
    setModalVisible(false);
    clearForm();
  }

  // confirms if u wanna delete and removes the exercise if confirmed

  function handleDelete(exercise) {
    Alert.alert("Delete Exercise", `Delete "${exercise.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteExercise(exercise.id);
          await loadExercises();
        },
      },
    ]);
  }

  // returns a color based on the difficulty level for badge styling

  function difficultyColor(level) {
    if (level === "Beginner") return Colors.success;
    if (level === "Intermediate") return Colors.warning;
    if (level === "Advanced") return Colors.danger;
    return Colors.textSecondary;
  }

  // returns an image based on the exercise name or category

  function getExerciseImage(exercise) {
    const name = (exercise.name || "").toLowerCase();
    const category = (exercise.category || "").toLowerCase();

    if (name.includes("push")) return exerciseImages.pushUp;
    if (name.includes("squat")) return exerciseImages.squat;
    if (name.includes("sit")) return exerciseImages.sitUps;
    if (name.includes("run") || category === "cardio")
      return exerciseImages.cardio;

    return null;
  }

  // renders the main screen with a header, list of exercises, and a modal for adding/editing exercises
  return (
    <View style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader
        title="Exercises"
        subtitle={`${exercises.length} exercises available`}
      />

      <ScrollView
        contentContainerStyle={SharedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={Colors.textDark}
          />
          <Text style={styles.addButtonText}>Add New Exercise</Text>
        </TouchableOpacity>

        {exercises.length === 0 ? (
          <EmptyState
            icon="barbell-outline"
            message="No exercises yet"
            hint="Tap the button above to add one"
          />
        ) : (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              expanded={expandedId === exercise.id}
              onToggle={() =>
                setExpandedId(expandedId === exercise.id ? null : exercise.id)
              }
              onEdit={() => openEditModal(exercise)}
              onDelete={() => handleDelete(exercise)}
              difficultyColor={difficultyColor}
              imageSource={getExerciseImage(exercise)}
            />
          ))
        )}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={SharedStyles.row}>
                <Text style={styles.modalTitle}>
                  {editingExercise ? "Edit Exercise" : "Add Exercise"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    clearForm();
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <AppImage
                height={120}
                label="Exercise Image"
                source={getExerciseImage({
                  name: formName,
                  category: formCategory,
                })}
              />

              <Text style={SharedStyles.label}>Exercise Name *</Text>
              <TextInput
                style={SharedStyles.input}
                placeholder="e.g. Push Up"
                placeholderTextColor={Colors.textSecondary}
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={SharedStyles.label}>Category *</Text>
              <View style={styles.optionRow}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.optionBtn,
                      formCategory === cat && styles.optionBtnActive,
                    ]}
                    onPress={() => setFormCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.optionBtnText,
                        formCategory === cat && styles.optionBtnTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={SharedStyles.label}>Muscle Group *</Text>
              <View style={styles.optionRow}>
                {muscleGroups.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.optionBtn,
                      formMuscleGroup === group && styles.optionBtnActive,
                    ]}
                    onPress={() => setFormMuscleGroup(group)}
                  >
                    <Text
                      style={[
                        styles.optionBtnText,
                        formMuscleGroup === group && styles.optionBtnTextActive,
                      ]}
                    >
                      {group}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={SharedStyles.label}>Difficulty *</Text>
              <View style={styles.optionRow}>
                {difficulties.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.optionBtn,
                      formDifficulty === d && styles.optionBtnActive,
                    ]}
                    onPress={() => setFormDifficulty(d)}
                  >
                    <Text
                      style={[
                        styles.optionBtnText,
                        formDifficulty === d && styles.optionBtnTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={SharedStyles.label}>Instructions</Text>
              <TextInput
                style={[
                  SharedStyles.input,
                  { height: 90, textAlignVertical: "top" },
                ]}
                placeholder="Step-by-step instructions..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                value={formInstructions}
                onChangeText={setFormInstructions}
              />

              <TouchableOpacity
                style={SharedStyles.primaryButton}
                onPress={handleSave}
              >
                <Text style={SharedStyles.primaryButtonText}>
                  {editingExercise ? "Save Changes" : "Add Exercise"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// card for each exercise in the list showing details when expanded

function ExerciseCard({
  exercise,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  difficultyColor,
  imageSource,
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggle}>
        <View style={SharedStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
              <Badge label={exercise.category} color={Colors.surfaceAlt} />
              <Badge
                label={exercise.difficulty}
                color={difficultyColor(exercise.difficulty)}
              />
            </View>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <AppImage height={130} label="Exercise Image" source={imageSource} />

          {exercise.muscleGroup ? (
            <View style={styles.detailRow}>
              <Ionicons
                name="body-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailText}>
                {" "}
                Muscle: {exercise.muscleGroup}
              </Text>
            </View>
          ) : null}

          {exercise.instructions ? (
            <Text style={styles.instructions}>{exercise.instructions}</Text>
          ) : null}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Ionicons
                name="pencil-outline"
                size={15}
                color={Colors.primary}
              />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={15} color={Colors.danger} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// styles for the exercise screen and cards

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  addButtonText: { color: Colors.textDark, fontWeight: "bold", fontSize: 15 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseName: { color: Colors.textPrimary, fontSize: 16, fontWeight: "bold" },
  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailText: { color: Colors.textSecondary, fontSize: 13 },
  instructions: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  actionRow: { flexDirection: "row", gap: 10 },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  editButtonText: { color: Colors.primary, fontWeight: "600", fontSize: 13 },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  deleteButtonText: { color: Colors.danger, fontWeight: "600", fontSize: 13 },
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
    maxHeight: "92%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  optionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  optionBtnTextActive: { color: Colors.textDark },
});
