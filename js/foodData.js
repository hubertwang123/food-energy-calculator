// 食物数据库
const FOOD_DATABASE = [
  // 中式快餐
  { id: 1, name: '米饭（一碗/150g）', calories: 174, protein: 4, fat: 0.3, carbs: 39, category: '主食' },
  { id: 2, name: '面条（一碗/200g）', calories: 280, protein: 9, fat: 1, carbs: 56, category: '主食' },
  { id: 3, name: '馒头（一个/100g）', calories: 223, protein: 7, fat: 1, carbs: 47, category: '主食' },
  { id: 4, name: '包子（一个/100g）', calories: 227, protein: 7, fat: 3, carbs: 42, category: '主食' },
  { id: 5, name: '炒饭（一份/300g）', calories: 450, protein: 10, fat: 15, carbs: 70, category: '主食' },
  { id: 6, name: '水饺（10个/200g）', calories: 340, protein: 14, fat: 8, carbs: 52, category: '主食' },

  // 肉类
  { id: 7, name: '鸡胸肉（100g）', calories: 133, protein: 24, fat: 5, carbs: 0, category: '肉类' },
  { id: 8, name: '猪肉（瘦/100g）', calories: 143, protein: 20, fat: 7, carbs: 0, category: '肉类' },
  { id: 9, name: '牛肉（瘦/100g）', calories: 125, protein: 20, fat: 4, carbs: 0, category: '肉类' },
  { id: 10, name: '鱼肉（100g）', calories: 104, protein: 20, fat: 2, carbs: 0, category: '肉类' },
  { id: 11, name: '鸡蛋（一个/50g）', calories: 72, protein: 6, fat: 5, carbs: 1, category: '肉类' },
  { id: 12, name: '虾仁（100g）', calories: 101, protein: 21, fat: 1, carbs: 1, category: '肉类' },

  // 蔬菜
  { id: 13, name: '西兰花（100g）', calories: 34, protein: 3, fat: 0.4, carbs: 7, category: '蔬菜' },
  { id: 14, name: '番茄（一个/150g）', calories: 27, protein: 1, fat: 0.3, carbs: 6, category: '蔬菜' },
  { id: 15, name: '黄瓜（一根/100g）', calories: 15, protein: 1, fat: 0.1, carbs: 3, category: '蔬菜' },
  { id: 16, name: '生菜（100g）', calories: 15, protein: 1, fat: 0.2, carbs: 3, category: '蔬菜' },
  { id: 17, name: '胡萝卜（100g）', calories: 41, protein: 1, fat: 0.2, carbs: 10, category: '蔬菜' },
  { id: 18, name: '土豆（一个/150g）', calories: 116, protein: 3, fat: 0.2, carbs: 27, category: '蔬菜' },

  // 水果
  { id: 19, name: '苹果（一个/150g）', calories: 78, protein: 0.4, fat: 0.3, carbs: 21, category: '水果' },
  { id: 20, name: '香蕉（一根/120g）', calories: 108, protein: 1, fat: 0.4, carbs: 28, category: '水果' },
  { id: 21, name: '橙子（一个/150g）', calories: 70, protein: 1, fat: 0.2, carbs: 18, category: '水果' },
  { id: 22, name: '葡萄（100g）', calories: 69, protein: 1, fat: 0.2, carbs: 18, category: '水果' },
  { id: 23, name: '西瓜（100g）', calories: 30, protein: 1, fat: 0.2, carbs: 8, category: '水果' },
  { id: 24, name: '草莓（100g）', calories: 32, protein: 1, fat: 0.3, carbs: 8, category: '水果' },

  // 零食饮料
  { id: 25, name: '薯片（一包/100g）', calories: 547, protein: 6, fat: 37, carbs: 50, category: '零食' },
  { id: 26, name: '饼干（100g）', calories: 450, protein: 7, fat: 15, carbs: 70, category: '零食' },
  { id: 27, name: '巧克力（一块/50g）', calories: 270, protein: 3, fat: 15, carbs: 30, category: '零食' },
  { id: 28, name: '可乐（一瓶/330ml）', calories: 139, protein: 0, fat: 0, carbs: 35, category: '饮料' },
  { id: 29, name: '奶茶（一杯/500ml）', calories: 350, protein: 5, fat: 8, carbs: 65, category: '饮料' },
  { id: 30, name: '牛奶（一杯/250ml）', calories: 150, protein: 8, fat: 8, carbs: 12, category: '饮料' },

  // 西式快餐
  { id: 31, name: '汉堡（一个）', calories: 540, protein: 25, fat: 29, carbs: 45, category: '快餐' },
  { id: 32, name: '披萨（一片/100g）', calories: 266, protein: 11, fat: 10, carbs: 33, category: '快餐' },
  { id: 33, name: '炸鸡（一块/100g）', calories: 290, protein: 17, fat: 18, carbs: 15, category: '快餐' },
  { id: 34, name: '薯条（中份/120g）', calories: 365, protein: 4, fat: 17, carbs: 48, category: '快餐' },
  { id: 35, name: '三明治（一个）', calories: 320, protein: 15, fat: 12, carbs: 38, category: '快餐' },

  // 豆制品
  { id: 36, name: '豆腐（100g）', calories: 76, protein: 8, fat: 4, carbs: 4, category: '豆制品' },
  { id: 37, name: '豆浆（一杯/250ml）', calories: 54, protein: 4, fat: 2, carbs: 6, category: '豆制品' },
  { id: 38, name: '豆干（100g）', calories: 140, protein: 17, fat: 4, carbs: 10, category: '豆制品' },

  // 坚果
  { id: 39, name: '核桃（10个/30g）', calories: 196, protein: 4, fat: 20, carbs: 4, category: '坚果' },
  { id: 40, name: '杏仁（30g）', calories: 173, protein: 6, fat: 15, carbs: 6, category: '坚果' },
  { id: 41, name: '腰果（30g）', calories: 166, protein: 5, fat: 13, carbs: 9, category: '坚果' },

  // 调味品和其他
  { id: 42, name: '白糖（一勺/10g）', calories: 39, protein: 0, fat: 0, carbs: 10, category: '调料' },
  { id: 43, name: '食用油（一勺/10ml）', calories: 90, protein: 0, fat: 10, carbs: 0, category: '调料' },
  { id: 44, name: '酸奶（一杯/150g）', calories: 99, protein: 5, fat: 3, carbs: 13, category: '乳制品' },
  { id: 45, name: '冰淇淋（一球/100g）', calories: 207, protein: 4, fat: 11, carbs: 24, category: '甜品' },

  // 中式菜肴
  { id: 46, name: '黄焖鸡（一份/400g）', calories: 680, protein: 45, fat: 28, carbs: 58, category: '中餐' },
  { id: 47, name: '兰州拉面（一碗/500g）', calories: 520, protein: 22, fat: 12, carbs: 85, category: '中餐' },
  { id: 48, name: '西红柿炒鸡蛋（一份/200g）', calories: 180, protein: 12, fat: 11, carbs: 10, category: '中餐' },
  { id: 49, name: '宫保鸡丁（一份/300g）', calories: 420, protein: 35, fat: 22, carbs: 25, category: '中餐' },
  { id: 50, name: '麻婆豆腐（一份/300g）', calories: 280, protein: 18, fat: 16, carbs: 18, category: '中餐' },
  { id: 51, name: '鱼香肉丝（一份/300g）', calories: 380, protein: 22, fat: 20, carbs: 30, category: '中餐' },
  { id: 52, name: '红烧肉（一份/200g）', calories: 520, protein: 28, fat: 38, carbs: 15, category: '中餐' },
  { id: 53, name: '酸菜鱼（一份/500g）', calories: 450, protein: 48, fat: 18, carbs: 25, category: '中餐' },
  { id: 54, name: '回锅肉（一份/250g）', calories: 480, protein: 30, fat: 32, carbs: 20, category: '中餐' },
  { id: 55, name: '水煮肉片（一份/350g）', calories: 520, protein: 38, fat: 34, carbs: 18, category: '中餐' },
  { id: 56, name: '糖醋里脊（一份/250g）', calories: 450, protein: 28, fat: 18, carbs: 45, category: '中餐' },
  { id: 57, name: '青椒肉丝（一份/250g）', calories: 320, protein: 24, fat: 18, carbs: 18, category: '中餐' },
  { id: 58, name: '木须肉（一份/250g）', calories: 350, protein: 26, fat: 22, carbs: 15, category: '中餐' },
  { id: 59, name: '鱼头豆腐汤（一份/400g）', calories: 280, protein: 32, fat: 12, carbs: 12, category: '中餐' },
  { id: 60, name: '干煸豆角（一份/250g）', calories: 280, protein: 8, fat: 20, carbs: 18, category: '中餐' },

  // 面食类
  { id: 61, name: '刀削面（一碗/400g）', calories: 480, protein: 18, fat: 10, carbs: 82, category: '面食' },
  { id: 62, name: '炸酱面（一碗/450g）', calories: 550, protein: 22, fat: 18, carbs: 75, category: '面食' },
  { id: 63, name: '阳春面（一碗/350g）', calories: 380, protein: 12, fat: 8, carbs: 68, category: '面食' },
  { id: 64, name: '热干面（一碗/400g）', calories: 620, protein: 20, fat: 28, carbs: 70, category: '面食' },
  { id: 65, name: '担担面（一碗/350g）', calories: 520, protein: 18, fat: 22, carbs: 62, category: '面食' },
  { id: 66, name: '云吞面（一碗/450g）', calories: 480, protein: 24, fat: 14, carbs: 65, category: '面食' },
  { id: 67, name: '烩面（一碗/500g）', calories: 560, protein: 26, fat: 16, carbs: 78, category: '面食' },

  // 盖饭类
  { id: 68, name: '鱼香肉丝盖饭（一份/450g）', calories: 620, protein: 28, fat: 22, carbs: 80, category: '盖饭' },
  { id: 69, name: '宫保鸡丁盖饭（一份/450g）', calories: 650, protein: 38, fat: 24, carbs: 78, category: '盖饭' },
  { id: 70, name: '番茄鸡蛋盖饭（一份/400g）', calories: 520, protein: 18, fat: 15, carbs: 78, category: '盖饭' },
  { id: 71, name: '青椒肉丝盖饭（一份/450g）', calories: 580, protein: 30, fat: 20, carbs: 76, category: '盖饭' },
  { id: 72, name: '麻婆豆腐盖饭（一份/450g）', calories: 560, protein: 22, fat: 18, carbs: 82, category: '盖饭' },

  // 煲仔饭/砂锅类
  { id: 73, name: '腊味煲仔饭（一份/400g）', calories: 680, protein: 28, fat: 30, carbs: 75, category: '煲仔饭' },
  { id: 74, name: '排骨煲仔饭（一份/450g）', calories: 720, protein: 35, fat: 32, carbs: 72, category: '煲仔饭' },
  { id: 75, name: '香菇滑鸡煲仔饭（一份/420g）', calories: 640, protein: 32, fat: 24, carbs: 76, category: '煲仔饭' },

  // 粥类
  { id: 76, name: '皮蛋瘦肉粥（一碗/400g）', calories: 180, protein: 12, fat: 4, carbs: 26, category: '粥' },
  { id: 77, name: '海鲜粥（一碗/450g）', calories: 220, protein: 18, fat: 5, carbs: 30, category: '粥' },
  { id: 78, name: '鸡肉粥（一碗/400g）', calories: 200, protein: 14, fat: 4, carbs: 28, category: '粥' },
  { id: 79, name: '白粥（一碗/300g）', calories: 120, protein: 3, fat: 0.3, carbs: 27, category: '粥' },

  // 小吃类
  { id: 80, name: '煎饼果子（一个/250g）', calories: 420, protein: 14, fat: 18, carbs: 52, category: '小吃' },
  { id: 81, name: '肉夹馍（一个/200g）', calories: 480, protein: 22, fat: 20, carbs: 52, category: '小吃' },
  { id: 82, name: '生煎包（5个/200g）', calories: 380, protein: 16, fat: 14, carbs: 48, category: '小吃' },
  { id: 83, name: '锅贴（10个/250g）', calories: 420, protein: 18, fat: 16, carbs: 52, category: '小吃' },
  { id: 84, name: '韭菜盒子（一个/150g）', calories: 320, protein: 10, fat: 14, carbs: 40, category: '小吃' },
  { id: 85, name: '春卷（5个/200g）', calories: 380, protein: 12, fat: 18, carbs: 45, category: '小吃' },
];

// 获取所有食物分类
function getFoodCategories() {
  const categories = new Set(FOOD_DATABASE.map(food => food.category));
  return ['全部', ...Array.from(categories)];
}

// 根据关键词搜索食物
function searchFood(keyword) {
  if (!keyword) return FOOD_DATABASE;
  const lowerKeyword = keyword.toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerKeyword)
  );
}

// 根据分类筛选食物
function filterByCategory(category) {
  if (category === '全部') return FOOD_DATABASE;
  return FOOD_DATABASE.filter(food => food.category === category);
}

// 根据ID获取食物
function getFoodById(id) {
  return FOOD_DATABASE.find(food => food.id === id);
}

// ========== 运动数据库 ==========

// 运动消耗数据库（消耗热量基于体重和时间）
// caloriesPerMinutePer60kg: 每分钟每60kg体重消耗的热量
const EXERCISE_DATABASE = [
  // 有氧运动
  { id: 1, name: '跑步（8km/h）', caloriesPerMinutePer60kg: 8.0, category: '有氧运动', unit: '分钟' },
  { id: 2, name: '跑步（10km/h）', caloriesPerMinutePer60kg: 10.0, category: '有氧运动', unit: '分钟' },
  { id: 3, name: '跑步（12km/h）', caloriesPerMinutePer60kg: 12.5, category: '有氧运动', unit: '分钟' },
  { id: 4, name: '快走（6km/h）', caloriesPerMinutePer60kg: 4.5, category: '有氧运动', unit: '分钟' },
  { id: 5, name: '慢跑', caloriesPerMinutePer60kg: 7.0, category: '有氧运动', unit: '分钟' },
  { id: 6, name: '游泳（自由泳）', caloriesPerMinutePer60kg: 9.0, category: '有氧运动', unit: '分钟' },
  { id: 7, name: '游泳（蛙泳）', caloriesPerMinutePer60kg: 7.5, category: '有氧运动', unit: '分钟' },
  { id: 8, name: '骑自行车（中速）', caloriesPerMinutePer60kg: 6.0, category: '有氧运动', unit: '分钟' },
  { id: 9, name: '骑自行车（快速）', caloriesPerMinutePer60kg: 9.0, category: '有氧运动', unit: '分钟' },
  { id: 10, name: '跳绳', caloriesPerMinutePer60kg: 11.0, category: '有氧运动', unit: '分钟' },
  { id: 11, name: '爬楼梯', caloriesPerMinutePer60kg: 8.5, category: '有氧运动', unit: '分钟' },
  { id: 12, name: '椭圆机', caloriesPerMinutePer60kg: 7.0, category: '有氧运动', unit: '分钟' },
  { id: 13, name: '划船机', caloriesPerMinutePer60kg: 8.0, category: '有氧运动', unit: '分钟' },

  // 球类运动
  { id: 14, name: '篮球', caloriesPerMinutePer60kg: 8.0, category: '球类运动', unit: '分钟' },
  { id: 15, name: '足球', caloriesPerMinutePer60kg: 9.0, category: '球类运动', unit: '分钟' },
  { id: 16, name: '羽毛球', caloriesPerMinutePer60kg: 6.5, category: '球类运动', unit: '分钟' },
  { id: 17, name: '乒乓球', caloriesPerMinutePer60kg: 5.0, category: '球类运动', unit: '分钟' },
  { id: 18, name: '网球', caloriesPerMinutePer60kg: 7.0, category: '球类运动', unit: '分钟' },
  { id: 19, name: '排球', caloriesPerMinutePer60kg: 4.5, category: '球类运动', unit: '分钟' },

  // 力量训练
  { id: 20, name: '力量训练（轻度）', caloriesPerMinutePer60kg: 4.0, category: '力量训练', unit: '分钟' },
  { id: 21, name: '力量训练（中度）', caloriesPerMinutePer60kg: 5.5, category: '力量训练', unit: '分钟' },
  { id: 22, name: '力量训练（高强度）', caloriesPerMinutePer60kg: 7.5, category: '力量训练', unit: '分钟' },
  { id: 23, name: '深蹲（组）', caloriesPerMinutePer60kg: 6.0, category: '力量训练', unit: '分钟' },
  { id: 24, name: '卧推（组）', caloriesPerMinutePer60kg: 5.0, category: '力量训练', unit: '分钟' },
  { id: 25, name: '引体向上（组）', caloriesPerMinutePer60kg: 7.0, category: '力量训练', unit: '分钟' },

  // 其他运动
  { id: 26, name: '瑜伽', caloriesPerMinutePer60kg: 3.0, category: '其他运动', unit: '分钟' },
  { id: 27, name: '普拉提', caloriesPerMinutePer60kg: 3.5, category: '其他运动', unit: '分钟' },
  { id: 28, name: '舞蹈', caloriesPerMinutePer60kg: 5.5, category: '其他运动', unit: '分钟' },
  { id: 29, name: 'HIIT高强度间歇训练', caloriesPerMinutePer60kg: 10.0, category: '其他运动', unit: '分钟' },
  { id: 30, name: '拳击', caloriesPerMinutePer60kg: 9.0, category: '其他运动', unit: '分钟' },
  { id: 31, name: '攀岩', caloriesPerMinutePer60kg: 8.0, category: '其他运动', unit: '分钟' },
  { id: 32, name: '滑雪', caloriesPerMinutePer60kg: 7.5, category: '其他运动', unit: '分钟' },
];

// 计算运动消耗的热量（根据体重和时长）
function calculateExerciseCalories(exercise, duration, userWeight = 60) {
  // 根据体重调整：实际消耗 = 基准消耗 * (实际体重 / 60kg)
  const weightFactor = userWeight / 60;
  return exercise.caloriesPerMinutePer60kg * duration * weightFactor;
}

// 获取所有运动分类
function getExerciseCategories() {
  const categories = new Set(EXERCISE_DATABASE.map(ex => ex.category));
  return ['全部', ...Array.from(categories)];
}

// 根据关键词搜索运动
function searchExercise(keyword) {
  if (!keyword) return EXERCISE_DATABASE;
  const lowerKeyword = keyword.toLowerCase();
  return EXERCISE_DATABASE.filter(ex =>
    ex.name.toLowerCase().includes(lowerKeyword)
  );
}

// 根据分类筛选运动
function filterExerciseByCategory(category) {
  if (category === '全部') return EXERCISE_DATABASE;
  return EXERCISE_DATABASE.filter(ex => ex.category === category);
}

// 根据ID获取运动
function getExerciseById(id) {
  return EXERCISE_DATABASE.find(ex => ex.id === id);
}
