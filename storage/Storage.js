import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  USERS: "morelyfe_users",
  CURRENT_USER: "morelyfe_current_user",
  EXERCISES: "morelyfe_exercises",
  MEALS: "morelyfe_meals",
  WORKOUTS: "morelyfe_workouts",
};

export const SAMPLE_EXERCISES = [
  {
    id: "1",
    name: "Push Up",
    category: "Strength",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    instructions:
      "Start in plank position. Lower chest to floor, then push back up. Keep core tight.",
  },
  {
    id: "2",
    name: "Squat",
    category: "Strength",
    muscleGroup: "Quads & Hamstrings",
    difficulty: "Beginner",
    instructions:
      "Stand feet shoulder-width apart. Lower hips until thighs parallel floor. Stand back up.",
  },
  {
    id: "3",
    name: "Sit Ups",
    category: "Core",
    muscleGroup: "Core",
    difficulty: "Beginner",
    instructions:
      "Lie on your back with knees bent. Lift your shoulders off the ground, then lower back down.",
  },
  {
    id: "4",
    name: "10 Km Run",
    category: "Cardio",
    muscleGroup: "Glutes & Calves",
    difficulty: "Advanced",
    instructions:
      "Warm up with light jogging. Run at a steady pace for 10 kilometers. Cool down with walking and stretching.",
  },
];

export const SAMPLE_MEALS = [
  {
    id: "1",
    name: "Blueberry Banana Oatmeal",
    calories: "309",
    protein: "6.3",
    carbs: "63.8",
    fats: "4.5",
    timeOfDay: "Breakfast",
  },
  {
    id: "2",
    name: "Grilled Chicken & Rice",
    calories: "520",
    protein: "45",
    carbs: "55",
    fats: "8",
    timeOfDay: "Lunch",
  },
  {
    id: "3",
    name: "Protein Shake",
    calories: "200",
    protein: "30",
    carbs: "10",
    fats: "3",
    timeOfDay: "Snack",
  },
  {
    id: "4",
    name: "Mac pie with beans, sweet potato and chicken",
    calories: "850",
    protein: "55",
    carbs: "90",
    fats: "25",
    timeOfDay: "Dinner",
  },
];

export const SAMPLE_WORKOUTS = [
  {
    id: "1",
    date: "2026-05-10",
    exercises: [
      {
        name: "Push Up",
        sets: "3",
        reps: "15",
        weight: "Bodyweight",
        duration: "5 min",
      },
      {
        name: "Squat",
        sets: "4",
        reps: "12",
        weight: "Bodyweight",
        duration: "8 min",
      },
    ],
    notes: "Good workout, getting better every time.",
    totalDuration: "30 min",
  },
  {
    id: "2",
    date: "2026-05-12",
    exercises: [
      {
        name: "Sit Ups",
        sets: "3",
        reps: "15",
        weight: "Bodyweight",
        duration: "5 min",
      },
      {
        name: "10 Km Run",
        sets: "1",
        reps: "10",
        weight: "Bodyweight",
        duration: "30 min",
      },
    ],
    notes: "Focused on bodyweight exercises. Felt tired but pushed through.",
    totalDuration: "35 min",
  },
];

export const SAMPLE_USERS = [
  {
    id: "1",
    fullName: "Demo User",
    email: "demo@morelyfe.com",
    age: "21",
    fitnessGoal: "Build Muscle",
    username: "demo",
    password: "demo123",
  },
];

// users

export const getUsers = async () => {
  const data = await AsyncStorage.getItem(KEYS.USERS);
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const saveUser = async (newUser) => {
  const users = await getUsers();
  users.push(newUser);
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const findUser = async (username, password) => {
  const users = await getUsers();
  return users.find(
    (us) => us.username === username && us.password === password,
  );
};

//saving session

export const saveSession = async (user) => {
  await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getSession = async () => {
  const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(KEYS.CURRENT_USER);
};

export const removeData = clearSession;

//exercises section

function fixMuscleGroupName(group) {
  if (group === "Legs") return "Quads & Hamstrings";
  if (group === "Abs") return "Core";
  if (group === "Full Body") return "Glutes & Calves";
  return group;
}

export const getExercises = async () => {
  const data = await AsyncStorage.getItem(KEYS.EXERCISES);
  if (data !== null) {
    const exercises = JSON.parse(data);

    return exercises.map((exercise) => {
      return {
        ...exercise,
        muscleGroup: fixMuscleGroupName(exercise.muscleGroup),
      };
    });
  } else {
    return [];
  }
};

const saveExercises = async (exercises) => {
  await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
};

export const addExercise = async (exercise) => {
  const exercises = await getExercises();
  exercise.id = Date.now().toString();
  exercises.push(exercise);
  await saveExercises(exercises);
};

export const updateExercise = async (updatedExercise) => {
  const exercises = await getExercises();
  const index = exercises.findIndex((e) => e.id === updatedExercise.id);
  if (index !== -1) {
    exercises[index] = updatedExercise;
  }
  await saveExercises(exercises);
};

export const deleteExercise = async (id) => {
  const exercises = await getExercises();
  await saveExercises(exercises.filter((e) => e.id !== id));
};

//meals section

export const getMeals = async () => {
  const data = await AsyncStorage.getItem(KEYS.MEALS);
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

const saveMeals = async (meals) => {
  await AsyncStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
};

export const addMeal = async (meal) => {
  const meals = await getMeals();
  meal.id = Date.now().toString();
  meals.push(meal);
  await saveMeals(meals);
};

export const updateMeal = async (updatedMeal) => {
  const meals = await getMeals();
  const index = meals.findIndex((m) => m.id === updatedMeal.id);
  if (index !== -1) {
    meals[index] = updatedMeal;
  }
  await saveMeals(meals);
};

export const deleteMeal = async (id) => {
  const meals = await getMeals();
  await saveMeals(meals.filter((m) => m.id !== id));
};

// workout section

export const getWorkouts = async () => {
  const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

export const logWorkout = async (workout) => {
  const workouts = await getWorkouts();
  workout.id = Date.now().toString();
  workout.date = workout.date || new Date().toISOString().split("T")[0];
  workouts.push(workout);
  await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const deleteWorkout = async (id) => {
  const workouts = await getWorkouts();
  await AsyncStorage.setItem(
    KEYS.WORKOUTS,
    JSON.stringify(workouts.filter((w) => w.id !== id)),
  );
};

export async function initializeSampleData() {
  const existingUsers = await getUsers();
  if (existingUsers.length === 0) {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(SAMPLE_USERS));
  }

  await AsyncStorage.setItem(KEYS.MEALS, JSON.stringify(SAMPLE_MEALS));
  await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(SAMPLE_WORKOUTS));
}
