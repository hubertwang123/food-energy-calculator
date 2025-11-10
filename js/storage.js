// LocalStorage 操作管理

const STORAGE_KEYS = {
  DAILY_RECORDS: 'foodCalc_dailyRecords',
  CUSTOM_FOODS: 'foodCalc_customFoods',
  SETTINGS: 'foodCalc_settings',
  FAVORITES: 'foodCalc_favorites',
  MEAL_COMBOS: 'foodCalc_mealCombos',
  EXERCISE_RECORDS: 'foodCalc_exerciseRecords'
};

// 日期格式化工具
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取今天的日期字符串
function getTodayString() {
  return formatDate(new Date());
}

// ========== 每日记录相关 ==========

// 获取所有日期的记录
function getAllDailyRecords() {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
  return data ? JSON.parse(data) : {};
}

// 获取特定日期的记录
function getDailyRecord(date) {
  const records = getAllDailyRecords();
  return records[date] || [];
}

// 获取今天的记录
function getTodayRecord() {
  return getDailyRecord(getTodayString());
}

// 保存特定日期的记录
function saveDailyRecord(date, records) {
  const allRecords = getAllDailyRecords();
  allRecords[date] = records;
  localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(allRecords));
}

// 添加食物到今天的记录
function addFoodToToday(food, quantity = 1, mealType = 'breakfast') {
  const today = getTodayString();
  const records = getDailyRecord(today);

  const record = {
    id: Date.now(),
    foodId: food.id,
    name: food.name,
    quantity: quantity,
    calories: food.calories * quantity,
    protein: food.protein * quantity,
    fat: food.fat * quantity,
    carbs: food.carbs * quantity,
    category: food.category,
    mealType: mealType, // 餐次：breakfast, lunch, dinner, snack
    timestamp: new Date().toISOString()
  };

  records.push(record);
  saveDailyRecord(today, records);
  return record;
}

// 删除今天的某条记录
function deleteTodayRecord(recordId) {
  const today = getTodayString();
  let records = getDailyRecord(today);
  records = records.filter(r => r.id !== recordId);
  saveDailyRecord(today, records);
}

// 更新今天的某条记录的数量
function updateTodayRecordQuantity(recordId, newQuantity) {
  const today = getTodayString();
  const records = getDailyRecord(today);
  const record = records.find(r => r.id === recordId);

  if (record) {
    const originalCalories = record.calories / record.quantity;
    const originalProtein = record.protein / record.quantity;
    const originalFat = record.fat / record.quantity;
    const originalCarbs = record.carbs / record.quantity;

    record.quantity = newQuantity;
    record.calories = originalCalories * newQuantity;
    record.protein = originalProtein * newQuantity;
    record.fat = originalFat * newQuantity;
    record.carbs = originalCarbs * newQuantity;

    saveDailyRecord(today, records);
  }
}

// 计算特定日期的总营养
function calculateDailyTotal(date) {
  const records = getDailyRecord(date);
  return records.reduce((total, record) => ({
    calories: total.calories + record.calories,
    protein: total.protein + record.protein,
    fat: total.fat + record.fat,
    carbs: total.carbs + record.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
}

// 按餐次分组获取今日记录
function getTodayRecordsByMeal() {
  const records = getTodayRecord();
  const grouped = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  records.forEach(record => {
    const mealType = record.mealType || 'breakfast';
    if (grouped[mealType]) {
      grouped[mealType].push(record);
    }
  });

  return grouped;
}

// 计算特定餐次的营养总计
function calculateMealTotal(records) {
  return records.reduce((total, record) => ({
    calories: total.calories + record.calories,
    protein: total.protein + record.protein,
    fat: total.fat + record.fat,
    carbs: total.carbs + record.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
}

// 获取历史记录（最近N天）
function getRecentRecords(days = 7) {
  const allRecords = getAllDailyRecords();
  const dates = Object.keys(allRecords).sort().reverse();
  return dates.slice(0, days).map(date => ({
    date,
    records: allRecords[date],
    total: calculateDailyTotal(date)
  }));
}

// 删除特定日期的所有记录
function deleteDailyRecord(date) {
  const allRecords = getAllDailyRecords();
  delete allRecords[date];
  localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(allRecords));
}

// 清空今日所有记录
function clearTodayRecords() {
  const today = getTodayString();
  saveDailyRecord(today, []);
}

// ========== 自定义食物相关 ==========

// 获取所有自定义食物
function getCustomFoods() {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
  return data ? JSON.parse(data) : [];
}

// 添加自定义食物
function addCustomFood(name, calories, protein, fat, carbs, category = '自定义') {
  const customFoods = getCustomFoods();

  const newFood = {
    id: `custom_${Date.now()}`,
    name,
    calories: parseFloat(calories),
    protein: parseFloat(protein),
    fat: parseFloat(fat),
    carbs: parseFloat(carbs),
    category,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  customFoods.push(newFood);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
  return newFood;
}

// 删除自定义食物
function deleteCustomFood(foodId) {
  let customFoods = getCustomFoods();
  customFoods = customFoods.filter(f => f.id !== foodId);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
}

// 获取所有食物（内置 + 自定义）
function getAllFoods() {
  const customFoods = getCustomFoods();
  return [...FOOD_DATABASE, ...customFoods];
}

// ========== 数据导出相关 ==========

// 导出为CSV格式
function exportToCSV() {
  const allRecords = getAllDailyRecords();
  const dates = Object.keys(allRecords).sort();

  let csv = '日期,食物名称,数量,热量(kcal),蛋白质(g),脂肪(g),碳水化合物(g),分类\n';

  dates.forEach(date => {
    const records = allRecords[date];
    records.forEach(record => {
      csv += `${date},${record.name},${record.quantity},${record.calories.toFixed(1)},${record.protein.toFixed(1)},${record.fat.toFixed(1)},${record.carbs.toFixed(1)},${record.category}\n`;
    });

    // 添加每日小计
    const total = calculateDailyTotal(date);
    csv += `${date},【每日小计】,-,${total.calories.toFixed(1)},${total.protein.toFixed(1)},${total.fat.toFixed(1)},${total.carbs.toFixed(1)},-\n`;
    csv += '\n';
  });

  return csv;
}

// 下载CSV文件
function downloadCSV() {
  const csv = exportToCSV();
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `饮食记录_${getTodayString()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ========== 数据清理 ==========

// 清空所有数据
function clearAllData() {
  if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
    localStorage.removeItem(STORAGE_KEYS.DAILY_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_FOODS);
    alert('所有数据已清空！');
    location.reload();
  }
}

// ========== 用户设置和目标计算 ==========

// 获取用户设置
function getUserSettings() {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : null;
}

// 保存用户设置
function saveUserSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// 计算BMR（基础代谢率）- Mifflin-St Jeor公式
function calculateBMR(weight, height, age, gender) {
  // weight: kg, height: cm, age: years
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// 计算TDEE（每日总能量消耗）
function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    sedentary: 1.2,      // 久坐（很少运动）
    light: 1.375,        // 轻度活动（每周1-3次）
    moderate: 1.55,      // 中度活动（每周3-5次）
    active: 1.725,       // 高度活动（每周6-7次）
    veryActive: 1.9      // 极度活动（体力劳动或每天2次训练）
  };
  return bmr * (activityMultipliers[activityLevel] || 1.2);
}

// 计算每日营养目标
function calculateNutritionGoals(settings) {
  const { weight, height, age, gender, activityLevel, goal, proteinRatio } = settings;

  // 计算TDEE
  const bmr = calculateBMR(weight, height, age, gender);
  let tdee = calculateTDEE(bmr, activityLevel);

  // 根据目标调整热量
  let calorieGoal;
  switch (goal) {
    case 'lose':
      calorieGoal = tdee - 500; // 减脂：每天减少500卡
      break;
    case 'gain':
      calorieGoal = tdee + 300; // 增肌：每天增加300卡
      break;
    case 'maintain':
    default:
      calorieGoal = tdee; // 维持
  }

  // 计算蛋白质目标（g）
  // 健身人士推荐：1.6-2.2g/kg体重
  let proteinGoal;
  if (proteinRatio === 'high') {
    proteinGoal = weight * 2.2; // 高蛋白
  } else if (proteinRatio === 'medium') {
    proteinGoal = weight * 1.8; // 中等
  } else {
    proteinGoal = weight * 1.6; // 标准
  }

  // 蛋白质提供的热量（1g蛋白质 = 4 kcal）
  const proteinCalories = proteinGoal * 4;

  // 脂肪目标（占总热量的25%）
  const fatCalories = calorieGoal * 0.25;
  const fatGoal = fatCalories / 9; // 1g脂肪 = 9 kcal

  // 碳水化合物目标（剩余热量）
  const carbCalories = calorieGoal - proteinCalories - fatCalories;
  const carbGoal = carbCalories / 4; // 1g碳水 = 4 kcal

  return {
    calories: Math.round(calorieGoal),
    protein: Math.round(proteinGoal),
    fat: Math.round(fatGoal),
    carbs: Math.round(carbGoal),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee)
  };
}

// 获取用户的营养目标
function getUserGoals() {
  const settings = getUserSettings();
  if (!settings) return null;
  return calculateNutritionGoals(settings);
}

// 计算剩余营养需求
function getRemainingNutrition() {
  const goals = getUserGoals();
  if (!goals) return null;

  const consumed = calculateDailyTotal(getTodayString());

  return {
    calories: goals.calories - consumed.calories,
    protein: goals.protein - consumed.protein,
    fat: goals.fat - consumed.fat,
    carbs: goals.carbs - consumed.carbs
  };
}

// ========== 收藏功能 ==========

// 获取收藏的食物ID列表
function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return data ? JSON.parse(data) : [];
}

// 添加到收藏
function addToFavorites(foodId) {
  const favorites = getFavorites();
  if (!favorites.includes(foodId)) {
    favorites.push(foodId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  }
  return false;
}

// 从收藏中移除
function removeFromFavorites(foodId) {
  let favorites = getFavorites();
  favorites = favorites.filter(id => id !== foodId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

// 检查是否已收藏
function isFavorite(foodId) {
  return getFavorites().includes(foodId);
}

// ========== 餐食组合功能 ==========

// 获取所有餐食组合
function getMealCombos() {
  const data = localStorage.getItem(STORAGE_KEYS.MEAL_COMBOS);
  return data ? JSON.parse(data) : [];
}

// 保存餐食组合
function saveMealCombo(name, foods, mealType) {
  const combos = getMealCombos();
  const combo = {
    id: Date.now(),
    name: name,
    foods: foods, // 数组，每个元素包含 {foodId, quantity}
    mealType: mealType,
    createdAt: new Date().toISOString()
  };
  combos.push(combo);
  localStorage.setItem(STORAGE_KEYS.MEAL_COMBOS, JSON.stringify(combos));
  return combo;
}

// 删除餐食组合
function deleteMealCombo(comboId) {
  let combos = getMealCombos();
  combos = combos.filter(c => c.id !== comboId);
  localStorage.setItem(STORAGE_KEYS.MEAL_COMBOS, JSON.stringify(combos));
}

// 应用餐食组合（批量添加食物）
function applyMealCombo(comboId) {
  const combos = getMealCombos();
  const combo = combos.find(c => c.id === comboId);
  if (!combo) return false;

  const allFoods = getAllFoods();
  combo.foods.forEach(item => {
    const food = allFoods.find(f => String(f.id) === String(item.foodId));
    if (food) {
      addFoodToToday(food, item.quantity, combo.mealType);
    }
  });
  return true;
}

// ========== 快捷添加 - 复制昨天的餐次 ==========

// 获取昨天的日期
function getYesterdayString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

// 复制昨天的特定餐次到今天
function copyYesterdayMeal(mealType) {
  const yesterday = getYesterdayString();
  const yesterdayRecords = getDailyRecord(yesterday);

  if (yesterdayRecords.length === 0) {
    return 0;
  }

  const mealRecords = yesterdayRecords.filter(r => r.mealType === mealType);

  if (mealRecords.length === 0) {
    return 0;
  }

  const allFoods = getAllFoods();
  mealRecords.forEach(record => {
    const food = allFoods.find(f => String(f.id) === String(record.foodId));
    if (food) {
      addFoodToToday(food, record.quantity, mealType);
    }
  });

  return mealRecords.length;
}

// ========== 运动记录相关 ==========

// 获取所有日期的运动记录
function getAllExerciseRecords() {
  const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_RECORDS);
  return data ? JSON.parse(data) : {};
}

// 获取特定日期的运动记录
function getExerciseRecord(date) {
  const records = getAllExerciseRecords();
  return records[date] || [];
}

// 获取今天的运动记录
function getTodayExercise() {
  return getExerciseRecord(getTodayString());
}

// 保存特定日期的运动记录
function saveExerciseRecord(date, records) {
  const allRecords = getAllExerciseRecords();
  allRecords[date] = records;
  localStorage.setItem(STORAGE_KEYS.EXERCISE_RECORDS, JSON.stringify(allRecords));
}

// 添加运动到今天的记录
function addExerciseToToday(exercise, duration) {
  const today = getTodayString();
  const records = getExerciseRecord(today);

  // 获取用户体重（从设置中获取，默认60kg）
  const settings = getUserSettings();
  const userWeight = settings ? settings.weight : 60;

  // 计算消耗的热量
  const caloriesBurned = calculateExerciseCalories(exercise, duration, userWeight);

  const record = {
    id: Date.now(),
    exerciseId: exercise.id,
    name: exercise.name,
    duration: duration,
    caloriesBurned: caloriesBurned,
    category: exercise.category,
    timestamp: new Date().toISOString()
  };

  records.push(record);
  saveExerciseRecord(today, records);
  return record;
}

// 删除今天的某条运动记录
function deleteTodayExercise(recordId) {
  const today = getTodayString();
  let records = getExerciseRecord(today);
  records = records.filter(r => r.id !== recordId);
  saveExerciseRecord(today, records);
}

// 计算特定日期运动消耗的总热量
function calculateDailyExerciseTotal(date) {
  const records = getExerciseRecord(date);
  return records.reduce((total, record) => total + record.caloriesBurned, 0);
}

// 计算今天的净热量（摄入 - 消耗）
function calculateNetCalories() {
  const intake = calculateDailyTotal(getTodayString());
  const burned = calculateDailyExerciseTotal(getTodayString());
  return {
    intake: intake.calories,
    burned: burned,
    net: intake.calories - burned
  };
}
