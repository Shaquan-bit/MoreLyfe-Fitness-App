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
import { getMeals, addMeal, updateMeal, deleteMeal } from "../storage/Storage";
import {
  ScreenHeader,
  EmptyState,
  AppImage,
} from "../components/SharedComponents";

const mealImages = {
  oatmeal: require("../assets/blueberry-banana-oatmeal.jpg"),
  macPie: require("../assets/mac-pie.jpeg"),
  proteinShake: require("../assets/protein-shake.jpeg"),
  chickenRice: require("../assets/rice-with-chicken.jpeg"),
};

function getMealImage(meal) {
  const name = (meal.name || "").toLowerCase();

  if (name.includes("oat") || name.includes("blueberry"))
    return mealImages.oatmeal;
  if (name.includes("shake") || name.includes("protein"))
    return mealImages.proteinShake;
  if (name.includes("chicken") && name.includes("rice"))
    return mealImages.chickenRice;
  if (name.includes("mac") || name.includes("macaroni") || name.includes("pie"))
    return mealImages.macPie;

  return null;
}

export default function MealPlansScreen() {
  const [meals, setMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterTime, setFilterTime] = useState("All");

  const [formName, setFormName] = useState("");
  const [formCalories, setFormCalories] = useState("");
  const [formProtein, setFormProtein] = useState("");
  const [formCarbs, setFormCarbs] = useState("");
  const [formFats, setFormFats] = useState("");
  const [formTimeOfDay, setFormTimeOfDay] = useState("");

  const timeOptions = ["Breakfast", "Lunch", "Dinner", "Snack"];

  useEffect(() => {
    loadMeals();
  }, []);

  async function loadMeals() {
    const data = await getMeals();
    if (data) setMeals(data);
  }

  function openAddModal() {
    setEditingMeal(null);
    clearForm();
    setModalVisible(true);
  }

  function openEditModal(meal) {
    setEditingMeal(meal);
    setFormName(meal.name);
    setFormCalories(meal.calories);
    setFormProtein(meal.protein);
    setFormCarbs(meal.carbs);
    setFormFats(meal.fats);
    setFormTimeOfDay(meal.timeOfDay);
    setModalVisible(true);
  }

  function clearForm() {
    setFormName("");
    setFormCalories("");
    setFormProtein("");
    setFormCarbs("");
    setFormFats("");
    setFormTimeOfDay("");
  }

  async function handleSave() {
    if (!formName.trim() || !formCalories || !formTimeOfDay) {
      Alert.alert(
        "Missing Fields",
        "Please fill in meal name, calories, and time of day.",
      );
      return;
    }

    if (editingMeal) {
      const update = {
        ...editingMeal,
        name: formName,
        calories: formCalories,
        protein: formProtein,
        carbs: formCarbs,
        fats: formFats,
        timeOfDay: formTimeOfDay,
      };
      await updateMeal(update);
      Alert.alert("Updated!", "Meal plan has been updated.");
    } else {
      const newMeal = {
        name: formName.trim(),
        calories: formCalories,
        protein: formProtein,
        carbs: formCarbs,
        fats: formFats,
        timeOfDay: formTimeOfDay,
      };
      await addMeal(newMeal);
      Alert.alert("Added!", "New meal plan has been added.");
    }

    await loadMeals();
    setModalVisible(false);
    clearForm();
  }

  function handleDelete(meal) {
    Alert.alert("Delete Meal Plan", `Delete "${meal.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMeal(meal.id);
          await loadMeals();
        },
      },
    ]);
  }

  function toggleExpanded(mealId) {
    setExpandedId((current) => (current === mealId ? null : mealId));
  }

  let filteredMeals =
    filterTime === "All"
      ? meals
      : meals.filter((m) => m.timeOfDay === filterTime);

  let totalCalories = 0;
  filteredMeals.forEach((meal) => {
    totalCalories += parseInt(meal.calories) || 0;
  });

  return (
    <View style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Meal Plans" subtitle="Create and manage meals" />

      <ScrollView
        contentContainerStyle={SharedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Ionicons name="flame-outline" size={24} color={Colors.secondary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.summaryLabel}>Total Calories (All Meals)</Text>
            <Text style={styles.summaryValue}>{totalCalories} kcal</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={Colors.textDark}
          />
          <Text style={styles.addBtnText}>Add New Meal Plan</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {["All", ...timeOptions].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.filterTab,
                filterTime === time && styles.filterTabActive,
              ]}
              onPress={() => setFilterTime(time)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterTime === time && styles.filterTabTextActive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredMeals.length === 0 ? (
          <EmptyState
            icon="restaurant-outline"
            message="No meal plans found"
            hint="Tap Add New Meal Plan to get started"
          />
        ) : (
          filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              expanded={expandedId === meal.id}
              onToggle={() => toggleExpanded(meal.id)}
              onEdit={() => openEditModal(meal)}
              onDelete={() => handleDelete(meal)}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={SharedStyles.row}>
                <Text style={styles.modalTitle}>
                  {editingMeal ? "Edit Meal Plan" : "Add Meal Plan"}
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
                source={getMealImage({
                  name: formName,
                  timeOfDay: formTimeOfDay,
                })}
              />

              <Text style={SharedStyles.label}>Meal Name *</Text>
              <TextInput
                style={SharedStyles.input}
                placeholder="e.g. Grilled Chicken & Rice"
                placeholderTextColor={Colors.textSecondary}
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={SharedStyles.label}>Time of Day *</Text>
              <View style={styles.optionRow}>
                {timeOptions.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.optionBtn,
                      formTimeOfDay === t && styles.optionBtnActive,
                    ]}
                    onPress={() => setFormTimeOfDay(t)}
                  >
                    <Text
                      style={[
                        styles.optionBtnText,
                        formTimeOfDay === t && styles.optionBtnTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={SharedStyles.label}>Calories (kcal) *</Text>
              <TextInput
                style={SharedStyles.input}
                placeholder="e.g. 500"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={formCalories}
                onChangeText={setFormCalories}
              />

              <View style={styles.nutrientRow}>
                <View style={styles.nutrientField}>
                  <Text style={SharedStyles.label}>Protein (g)</Text>
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formProtein}
                    onChangeText={setFormProtein}
                  />
                </View>
                <View style={styles.nutrientField}>
                  <Text style={SharedStyles.label}>Carbs (g)</Text>
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formCarbs}
                    onChangeText={setFormCarbs}
                  />
                </View>
                <View style={styles.nutrientField}>
                  <Text style={SharedStyles.label}>Fats (g)</Text>
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={formFats}
                    onChangeText={setFormFats}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={SharedStyles.primaryButton}
                onPress={handleSave}
              >
                <Text style={SharedStyles.primaryButtonText}>
                  {editingMeal ? "Save Changes" : "Add Meal Plan"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MealCard({ meal, expanded, onToggle, onEdit, onDelete }) {
  const timeIcon = {
    Breakfast: "sunny-outline",
    Lunch: "partly-sunny-outline",
    Dinner: "moon-outline",
    Snack: "cafe-outline",
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggle}>
        <View style={SharedStyles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Ionicons
                name={timeIcon[meal.timeOfDay] || "time-outline"}
                size={13}
                color={Colors.textSecondary}
              />
              <Text style={styles.mealTime}> {meal.timeOfDay}</Text>
              <Text style={styles.calorieText}> {meal.calories} kcal</Text>
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
          <AppImage height={130} source={getMealImage(meal)} />

          <View style={styles.nutrientsRow}>
            <NutrientBox
              label="Protein"
              value={meal.protein || "0"}
              unit="g"
              color="#4FC3F7"
            />
            <NutrientBox
              label="Carbs"
              value={meal.carbs || "0"}
              unit="g"
              color={Colors.primary}
            />
            <NutrientBox
              label="Fats"
              value={meal.fats || "0"}
              unit="g"
              color={Colors.secondary}
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
              <Ionicons
                name="pencil-outline"
                size={15}
                color={Colors.primary}
              />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={15} color={Colors.danger} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function NutrientBox({ label, value, unit, color }) {
  return (
    <View style={styles.nutrientBox}>
      <Text style={[styles.nutrientNumber, { color }]}>
        {value}
        {unit}
      </Text>
      <Text style={styles.nutrientName}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: 12 },
  summaryValue: { color: Colors.textPrimary, fontSize: 22, fontWeight: "bold" },

  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  addBtnText: { color: Colors.textDark, fontWeight: "bold", fontSize: 15 },

  filterScroll: { marginBottom: 16 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.surface,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: 13,
  },
  filterTabTextActive: { color: Colors.textDark },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealName: { color: Colors.textPrimary, fontSize: 15, fontWeight: "bold" },
  mealTime: { color: Colors.textSecondary, fontSize: 12 },
  calorieText: { color: Colors.primary, fontSize: 12, fontWeight: "bold" },

  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nutrientsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },
  nutrientBox: { alignItems: "center" },
  nutrientNumber: { fontSize: 20, fontWeight: "bold" },
  nutrientName: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

  actionRow: { flexDirection: "row", gap: 10 },
  editBtn: {
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
  editBtnText: { color: Colors.primary, fontWeight: "600", fontSize: 13 },
  deleteBtn: {
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
  deleteBtnText: { color: Colors.danger, fontWeight: "600", fontSize: 13 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
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

  nutrientRow: { flexDirection: "row", gap: 8 },
  nutrientField: { flex: 1 },
});
