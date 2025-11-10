// 主应用逻辑

// 当前状态
let currentView = 'today'; // 'today', 'history', 'custom'
let allFoods = [];
let currentMealType = 'breakfast'; // 当前选中的餐次

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

// 初始化应用
function initApp() {
  allFoods = getAllFoods();
  setupEventListeners();
  switchView('today');
  renderCategories();
}

// 设置事件监听器
function setupEventListeners() {
  // 导航按钮
  document.getElementById('navToday').addEventListener('click', () => switchView('today'));
  document.getElementById('navStats').addEventListener('click', () => switchView('stats'));
  document.getElementById('navHistory').addEventListener('click', () => switchView('history'));
  document.getElementById('navCustom').addEventListener('click', () => switchView('custom'));

  // 搜索框
  document.getElementById('searchInput').addEventListener('input', handleSearch);

  // 分类筛选
  document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);

  // 添加自定义食物按钮
  document.getElementById('showAddFoodBtn').addEventListener('click', showAddFoodForm);
  document.getElementById('cancelAddFood').addEventListener('click', hideAddFoodForm);
  document.getElementById('addFoodForm').addEventListener('submit', handleAddCustomFood);

  // 导出按钮
  document.getElementById('exportBtn').addEventListener('click', downloadCSV);

  // 清空数据按钮
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

  // 设置按钮
  document.getElementById('showSettingsBtn').addEventListener('click', showSettingsModal);
  document.getElementById('cancelSettings').addEventListener('click', hideSettingsModal);
  document.getElementById('previewSettings').addEventListener('click', previewNutritionGoals);
  document.getElementById('settingsForm').addEventListener('submit', handleSaveSettings);

  // 营养参考助手
  document.getElementById('referenceSearch').addEventListener('input', handleReferenceSearch);

  // 餐次选择按钮
  document.querySelectorAll('.meal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentMealType = this.getAttribute('data-meal');
    });
  });

  // 快捷操作按钮
  document.getElementById('copyYesterdayBtn').addEventListener('click', handleCopyYesterday);
  document.getElementById('showFavoritesBtn').addEventListener('click', handleShowFavorites);

  // 运动相关事件监听
  document.getElementById('exerciseSearchInput').addEventListener('input', handleExerciseSearch);
  document.getElementById('exerciseCategoryFilter').addEventListener('change', handleExerciseCategoryFilter);

  // 一键清空今日记录
  document.getElementById('clearTodayBtn').addEventListener('click', handleClearToday);
}

// 切换视图
function switchView(view) {
  currentView = view;

  // 更新导航按钮状态
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`nav${view.charAt(0).toUpperCase() + view.slice(1)}`).classList.add('active');

  // 隐藏所有视图
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  // 显示对应视图
  document.getElementById(`${view}View`).classList.add('active');

  // 根据视图加载数据
  if (view === 'today') {
    renderTodayView();
  } else if (view === 'stats') {
    renderStatsView();
  } else if (view === 'history') {
    renderHistoryView();
  } else if (view === 'custom') {
    renderCustomView();
  }
}

// ========== 今日视图相关 ==========

function renderTodayView() {
  renderTodaySummary();
  renderTodayRecords();
  renderFoodList();
  renderExerciseRecords();
  renderExerciseList();
  renderExerciseCategories();
}

// 渲染今日摘要
function renderTodaySummary() {
  const total = calculateDailyTotal(getTodayString());
  document.getElementById('totalCalories').textContent = total.calories.toFixed(0);
  document.getElementById('totalProtein').textContent = total.protein.toFixed(1);
  document.getElementById('totalFat').textContent = total.fat.toFixed(1);
  document.getElementById('totalCarbs').textContent = total.carbs.toFixed(1);

  // 获取用户目标
  const goals = getUserGoals();

  if (goals) {
    // 显示目标和剩余
    const remaining = getRemainingNutrition();

    // 热量
    document.getElementById('caloriesGoal').textContent =
      `目标: ${goals.calories} | 剩余: ${remaining.calories > 0 ? remaining.calories : 0}`;
    updateProgressBar('caloriesProgress', total.calories, goals.calories);

    // 蛋白质
    document.getElementById('proteinGoal').textContent =
      `目标: ${goals.protein}g | 剩余: ${remaining.protein > 0 ? remaining.protein.toFixed(1) : 0}g`;
    updateProgressBar('proteinProgress', total.protein, goals.protein);

    // 脂肪
    document.getElementById('fatGoal').textContent =
      `目标: ${goals.fat}g | 剩余: ${remaining.fat > 0 ? remaining.fat.toFixed(1) : 0}g`;
    updateProgressBar('fatProgress', total.fat, goals.fat);

    // 碳水
    document.getElementById('carbsGoal').textContent =
      `目标: ${goals.carbs}g | 剩余: ${remaining.carbs > 0 ? remaining.carbs.toFixed(1) : 0}g`;
    updateProgressBar('carbsProgress', total.carbs, goals.carbs);
  } else {
    // 没有设置目标，隐藏目标信息
    document.getElementById('caloriesGoal').textContent = '点击"营养目标设置"来设置目标';
    document.getElementById('proteinGoal').textContent = '';
    document.getElementById('fatGoal').textContent = '';
    document.getElementById('carbsGoal').textContent = '';

    // 隐藏进度条
    updateProgressBar('caloriesProgress', 0, 1);
    updateProgressBar('proteinProgress', 0, 1);
    updateProgressBar('fatProgress', 0, 1);
    updateProgressBar('carbsProgress', 0, 1);
  }
}

// 更新进度条
function updateProgressBar(elementId, current, goal) {
  const progressBar = document.getElementById(elementId);
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  progressBar.style.width = `${percentage}%`;
}

// 渲染今日记录列表（按餐次分组）
function renderTodayRecords() {
  const recordsByMeal = getTodayRecordsByMeal();
  const container = document.getElementById('todayRecords');

  const mealNames = {
    breakfast: '🌅 早餐',
    lunch: '🌞 午餐',
    dinner: '🌙 晚餐',
    snack: '🍎 加餐'
  };

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  let html = '';
  let hasRecords = false;

  mealOrder.forEach(mealType => {
    const records = recordsByMeal[mealType];
    if (records && records.length > 0) {
      hasRecords = true;
      const total = calculateMealTotal(records);

      html += `
        <div class="meal-group">
          <div class="meal-group-header">
            <span class="meal-group-title">${mealNames[mealType]}</span>
            <span class="meal-group-total">${total.calories.toFixed(0)} kcal</span>
          </div>
          ${records.map(record => `
            <div class="record-item">
              <div class="record-info">
                <div class="record-name">${record.name}</div>
                <div class="record-nutrients">
                  热量: ${record.calories.toFixed(0)} kcal |
                  蛋白质: ${record.protein.toFixed(1)}g |
                  脂肪: ${record.fat.toFixed(1)}g |
                  碳水: ${record.carbs.toFixed(1)}g
                </div>
              </div>
              <div class="record-actions">
                <input type="number" class="quantity-input" value="${record.quantity}" min="0.1" step="0.1"
                       onchange="updateRecordQuantity(${record.id}, this.value)">
                <span class="quantity-unit">份</span>
                <button class="btn-delete" onclick="deleteRecord(${record.id})">删除</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  });

  container.innerHTML = hasRecords ? html : '<p class="empty-message">今日还没有添加任何食物</p>';
}

// 更新记录数量
function updateRecordQuantity(recordId, newQuantity) {
  if (newQuantity <= 0) {
    alert('数量必须大于0');
    renderTodayRecords();
    return;
  }
  updateTodayRecordQuantity(recordId, parseFloat(newQuantity));
  renderTodayView();
}

// 删除记录
function deleteRecord(recordId) {
  if (confirm('确定要删除这条记录吗？')) {
    deleteTodayRecord(recordId);
    renderTodayView();
  }
}

// 渲染食物列表
function renderFoodList(foods = allFoods) {
  const container = document.getElementById('foodList');

  if (foods.length === 0) {
    container.innerHTML = '<p class="empty-message">没有找到相关食物</p>';
    return;
  }

  container.innerHTML = foods.map(food => {
    const isFav = isFavorite(food.id);
    return `
    <div class="food-item">
      <div class="food-info">
        <div class="food-name">
          ${food.name}
          <span class="favorite-star ${isFav ? 'active' : ''}"
                onclick="toggleFavorite('${food.id}'); event.stopPropagation();"
                title="${isFav ? '取消收藏' : '添加到收藏'}">
            ${isFav ? '⭐' : '☆'}
          </span>
        </div>
        <div class="food-category">${food.category}</div>
        <div class="food-nutrients">
          ${food.calories} kcal | 蛋白质 ${food.protein}g | 脂肪 ${food.fat}g | 碳水 ${food.carbs}g
        </div>
      </div>
      <button class="btn-add" onclick="addFoodToDay('${food.id}')">添加</button>
    </div>
  `}).join('');
}

// 添加食物到今天
function addFoodToDay(foodId) {
  const food = allFoods.find(f => String(f.id) === String(foodId));
  if (!food) {
    alert('食物不存在');
    return;
  }

  const mealNames = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  };

  addFoodToToday(food, 1, currentMealType);
  renderTodayView();

  // 显示提示
  showToast(`已添加 ${food.name} 到${mealNames[currentMealType]}`);
}

// 搜索处理
function handleSearch(e) {
  const keyword = e.target.value.trim();
  const category = document.getElementById('categoryFilter').value;

  let foods = allFoods;

  // 先按分类筛选
  if (category !== '全部') {
    foods = foods.filter(f => f.category === category);
  }

  // 再按关键词搜索
  if (keyword) {
    foods = foods.filter(f => f.name.includes(keyword));
  }

  renderFoodList(foods);
}

// 分类筛选处理
function handleCategoryFilter(e) {
  const category = e.target.value;
  const keyword = document.getElementById('searchInput').value.trim();

  let foods = allFoods;

  // 先按分类筛选
  if (category !== '全部') {
    foods = foods.filter(f => f.category === category);
  }

  // 再按关键词搜索
  if (keyword) {
    foods = foods.filter(f => f.name.includes(keyword));
  }

  renderFoodList(foods);
}

// 渲染分类选项
function renderCategories() {
  const categories = getFoodCategories();
  const select = document.getElementById('categoryFilter');

  select.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`
  ).join('');
}

// ========== 历史视图相关 ==========

function renderHistoryView() {
  const recentRecords = getRecentRecords(30); // 获取最近30天
  const container = document.getElementById('historyList');

  if (recentRecords.length === 0) {
    container.innerHTML = '<p class="empty-message">还没有历史记录</p>';
    return;
  }

  container.innerHTML = recentRecords.map(day => `
    <div class="history-day">
      <div class="history-header">
        <h3>${day.date} (${getDayOfWeek(day.date)})</h3>
        <button class="btn-delete-small" onclick="deleteDayHistory('${day.date}')">删除</button>
      </div>
      <div class="history-summary">
        <div class="summary-item">
          <span class="summary-label">热量:</span>
          <span class="summary-value">${day.total.calories.toFixed(0)} kcal</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">蛋白质:</span>
          <span class="summary-value">${day.total.protein.toFixed(1)}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">脂肪:</span>
          <span class="summary-value">${day.total.fat.toFixed(1)}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">碳水:</span>
          <span class="summary-value">${day.total.carbs.toFixed(1)}g</span>
        </div>
      </div>
      <div class="history-records">
        ${day.records.map(record => `
          <div class="history-record-item">
            ${record.name} × ${record.quantity} - ${record.calories.toFixed(0)} kcal
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// 获取星期几
function getDayOfWeek(dateStr) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// 删除某天的历史
function deleteDayHistory(date) {
  if (confirm(`确定要删除 ${date} 的所有记录吗？`)) {
    deleteDailyRecord(date);
    renderHistoryView();
  }
}

// ========== 自定义食物相关 ==========

function renderCustomView() {
  const customFoods = getCustomFoods();
  const container = document.getElementById('customFoodList');

  if (customFoods.length === 0) {
    container.innerHTML = '<p class="empty-message">还没有自定义食物，点击上方按钮添加</p>';
    return;
  }

  container.innerHTML = customFoods.map(food => `
    <div class="custom-food-item">
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div class="food-category">${food.category}</div>
        <div class="food-nutrients">
          ${food.calories} kcal | 蛋白质 ${food.protein}g | 脂肪 ${food.fat}g | 碳水 ${food.carbs}g
        </div>
      </div>
      <button class="btn-delete" onclick="removeCustomFood('${food.id}')">删除</button>
    </div>
  `).join('');
}

// 显示添加食物表单
function showAddFoodForm() {
  document.getElementById('addFoodModal').style.display = 'flex';
  document.getElementById('referenceSearch').value = '';
  document.getElementById('referenceResults').innerHTML = '';
}

// 隐藏添加食物表单
function hideAddFoodForm() {
  document.getElementById('addFoodModal').style.display = 'none';
  document.getElementById('addFoodForm').reset();
  document.getElementById('referenceSearch').value = '';
  document.getElementById('referenceResults').innerHTML = '';
}

// 处理添加自定义食物
function handleAddCustomFood(e) {
  e.preventDefault();

  const name = document.getElementById('foodName').value.trim();
  const calories = parseFloat(document.getElementById('foodCalories').value);
  const protein = parseFloat(document.getElementById('foodProtein').value);
  const fat = parseFloat(document.getElementById('foodFat').value);
  const carbs = parseFloat(document.getElementById('foodCarbs').value);
  const category = document.getElementById('foodCategory').value.trim() || '自定义';

  if (!name) {
    alert('请输入食物名称');
    return;
  }

  addCustomFood(name, calories, protein, fat, carbs, category);
  allFoods = getAllFoods(); // 更新食物列表
  hideAddFoodForm();
  renderCustomView();
  showToast('自定义食物添加成功！');
}

// 删除自定义食物
function removeCustomFood(foodId) {
  if (confirm('确定要删除这个自定义食物吗？')) {
    deleteCustomFood(foodId);
    allFoods = getAllFoods();
    renderCustomView();
  }
}

// ========== 营养目标设置相关 ==========

// 显示设置模态框
function showSettingsModal() {
  const settings = getUserSettings();
  if (settings) {
    // 填充已有设置
    document.getElementById('userWeight').value = settings.weight;
    document.getElementById('userHeight').value = settings.height;
    document.getElementById('userAge').value = settings.age;
    document.getElementById('userGender').value = settings.gender;
    document.getElementById('userActivity').value = settings.activityLevel;
    document.getElementById('userGoal').value = settings.goal;
    document.getElementById('userProtein').value = settings.proteinRatio;

    // 显示预览
    previewNutritionGoals();
  } else {
    // 隐藏预览
    document.getElementById('settingsPreview').style.display = 'none';
  }

  document.getElementById('settingsModal').style.display = 'flex';
}

// 隐藏设置模态框
function hideSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('settingsForm').reset();
  document.getElementById('settingsPreview').style.display = 'none';
}

// 预览营养目标
function previewNutritionGoals() {
  const weight = parseFloat(document.getElementById('userWeight').value);
  const height = parseFloat(document.getElementById('userHeight').value);
  const age = parseInt(document.getElementById('userAge').value);
  const gender = document.getElementById('userGender').value;
  const activityLevel = document.getElementById('userActivity').value;
  const goal = document.getElementById('userGoal').value;
  const proteinRatio = document.getElementById('userProtein').value;

  if (!weight || !height || !age || !gender || !activityLevel || !goal || !proteinRatio) {
    alert('请填写所有必填项');
    return;
  }

  const settings = { weight, height, age, gender, activityLevel, goal, proteinRatio };
  const goals = calculateNutritionGoals(settings);

  // 显示预览
  document.getElementById('settingsPreview').style.display = 'block';
  document.getElementById('previewBMR').textContent = `${goals.bmr} kcal`;
  document.getElementById('previewTDEE').textContent = `${goals.tdee} kcal`;
  document.getElementById('previewCalories').textContent = `${goals.calories} kcal`;
  document.getElementById('previewProtein').textContent = `${goals.protein}g`;
  document.getElementById('previewFat').textContent = `${goals.fat}g`;
  document.getElementById('previewCarbs').textContent = `${goals.carbs}g`;
}

// 保存设置
function handleSaveSettings(e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById('userWeight').value);
  const height = parseFloat(document.getElementById('userHeight').value);
  const age = parseInt(document.getElementById('userAge').value);
  const gender = document.getElementById('userGender').value;
  const activityLevel = document.getElementById('userActivity').value;
  const goal = document.getElementById('userGoal').value;
  const proteinRatio = document.getElementById('userProtein').value;

  const settings = { weight, height, age, gender, activityLevel, goal, proteinRatio };
  saveUserSettings(settings);

  hideSettingsModal();
  renderTodayView();
  showToast('营养目标已保存！');
}

// ========== 营养参考助手 ==========

// 处理参考搜索
function handleReferenceSearch(e) {
  const keyword = e.target.value.trim();
  const resultsContainer = document.getElementById('referenceResults');

  if (!keyword) {
    resultsContainer.innerHTML = '';
    return;
  }

  // 搜索食物数据库
  const results = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(keyword.toLowerCase())
  );

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="reference-empty">未找到相关食物，试试其他关键词</div>';
    return;
  }

  // 显示搜索结果（最多显示10个）
  resultsContainer.innerHTML = results.slice(0, 10).map(food => `
    <div class="reference-item" onclick="fillFoodReference(${food.id})">
      <div class="reference-item-info">
        <div class="reference-item-name">${food.name}</div>
        <div class="reference-item-nutrients">
          ${food.calories} kcal | 蛋白质 ${food.protein}g | 脂肪 ${food.fat}g | 碳水 ${food.carbs}g
        </div>
      </div>
      <button class="reference-item-btn" onclick="fillFoodReference(${food.id}); event.stopPropagation();">
        使用此数据
      </button>
    </div>
  `).join('');
}

// 填充食物参考数据
function fillFoodReference(foodId) {
  const food = FOOD_DATABASE.find(f => f.id === foodId);
  if (!food) return;

  // 填充表单
  document.getElementById('foodName').value = food.name;
  document.getElementById('foodCalories').value = food.calories;
  document.getElementById('foodProtein').value = food.protein;
  document.getElementById('foodFat').value = food.fat;
  document.getElementById('foodCarbs').value = food.carbs;
  document.getElementById('foodCategory').value = food.category;

  // 清空搜索
  document.getElementById('referenceSearch').value = '';
  document.getElementById('referenceResults').innerHTML = '';

  showToast(`已填充 ${food.name} 的营养数据`);
}

// ========== 工具函数 ==========

// 显示提示消息
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ========== 快捷功能 ==========

// 复制昨天的该餐次
function handleCopyYesterday() {
  const mealNames = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  };

  const count = copyYesterdayMeal(currentMealType);

  if (count > 0) {
    renderTodayView();
    showToast(`已复制昨天的${mealNames[currentMealType]}（${count}项）`);
  } else {
    alert(`昨天没有${mealNames[currentMealType]}记录`);
  }
}

// 显示收藏的食物
function handleShowFavorites() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    alert('还没有收藏任何食物，点击食物名称旁边的 ☆ 添加收藏');
    return;
  }

  const favoriteFoods = allFoods.filter(f => favorites.includes(f.id));
  renderFoodList(favoriteFoods);
  showToast(`显示 ${favoriteFoods.length} 个收藏的食物`);
}

// 切换收藏状态
function toggleFavorite(foodId) {
  if (isFavorite(foodId)) {
    removeFromFavorites(foodId);
    showToast('已取消收藏');
  } else {
    addToFavorites(foodId);
    showToast('已添加到收藏');
  }
  renderFoodList();
}

// 一键清空今日记录
function handleClearToday() {
  const records = getTodayRecord();

  if (records.length === 0) {
    alert('今日还没有任何食物记录');
    return;
  }

  if (confirm(`确定要清空今日的所有食物记录吗？\n\n共 ${records.length} 条记录将被删除，此操作不可恢复！`)) {
    clearTodayRecords();
    renderTodayView();
    showToast('已清空今日所有食物记录');
  }
}

// ========== 数据统计视图 ==========

let nutritionTrendChart = null;
let macrosPieChart = null;
let caloriesBarChart = null;

function renderStatsView() {
  // 销毁旧图表
  if (nutritionTrendChart) nutritionTrendChart.destroy();
  if (macrosPieChart) macrosPieChart.destroy();
  if (caloriesBarChart) caloriesBarChart.destroy();

  // 创建新图表
  createNutritionTrendChart();
  createMacrosPieChart();
  createCaloriesBarChart();
}

// 创建营养摄入趋势图（最近7天）
function createNutritionTrendChart() {
  const recentRecords = getRecentRecords(7);

  // 反转顺序，使最早的日期在左边
  recentRecords.reverse();

  const labels = recentRecords.map(r => {
    const date = new Date(r.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const caloriesData = recentRecords.map(r => r.total.calories);
  const proteinData = recentRecords.map(r => r.total.protein);
  const fatData = recentRecords.map(r => r.total.fat);
  const carbsData = recentRecords.map(r => r.total.carbs);

  const ctx = document.getElementById('nutritionTrendChart').getContext('2d');
  nutritionTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '热量 (kcal)',
          data: caloriesData,
          borderColor: '#7EC8E3',
          backgroundColor: 'rgba(126, 200, 227, 0.1)',
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: '蛋白质 (g)',
          data: proteinData,
          borderColor: '#C3B1E1',
          backgroundColor: 'rgba(195, 177, 225, 0.1)',
          tension: 0.3,
          yAxisID: 'y1'
        },
        {
          label: '脂肪 (g)',
          data: fatData,
          borderColor: '#FFB4C8',
          backgroundColor: 'rgba(255, 180, 200, 0.1)',
          tension: 0.3,
          yAxisID: 'y1'
        },
        {
          label: '碳水 (g)',
          data: carbsData,
          borderColor: '#FFE5B4',
          backgroundColor: 'rgba(255, 229, 180, 0.1)',
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '热量 (kcal)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: '营养素 (g)'
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y.toFixed(1);
              return label;
            }
          }
        }
      }
    }
  });
}

// 创建今日三大营养素占比饼图
function createMacrosPieChart() {
  const total = calculateDailyTotal(getTodayString());

  // 计算热量占比：蛋白质和碳水 4 kcal/g，脂肪 9 kcal/g
  const proteinCalories = total.protein * 4;
  const fatCalories = total.fat * 9;
  const carbsCalories = total.carbs * 4;

  const ctx = document.getElementById('macrosPieChart').getContext('2d');
  macrosPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['蛋白质', '脂肪', '碳水化合物'],
      datasets: [{
        data: [proteinCalories, fatCalories, carbsCalories],
        backgroundColor: [
          '#C3B1E1',
          '#FFB4C8',
          '#FFE5B4'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value.toFixed(0)} kcal (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// 创建本周热量摄入 vs 目标柱状图
function createCaloriesBarChart() {
  const recentRecords = getRecentRecords(7);
  const goals = getUserGoals();

  // 反转顺序
  recentRecords.reverse();

  const labels = recentRecords.map(r => {
    const date = new Date(r.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const actualCalories = recentRecords.map(r => r.total.calories);
  const targetCalories = goals ? new Array(7).fill(goals.calories) : new Array(7).fill(0);

  const ctx = document.getElementById('caloriesBarChart').getContext('2d');
  caloriesBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '实际摄入',
          data: actualCalories,
          backgroundColor: '#7EC8E3',
          borderColor: '#5FB8D9',
          borderWidth: 1
        },
        {
          label: '目标热量',
          data: targetCalories,
          backgroundColor: '#C3B1E1',
          borderColor: '#B09DD6',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '热量 (kcal)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y.toFixed(0) + ' kcal';
              return label;
            }
          }
        }
      }
    }
  });
}

// ========== 运动记录功能 ==========

// 渲染今日运动记录
function renderExerciseRecords() {
  const records = getTodayExercise();
  const container = document.getElementById('exerciseRecords');

  if (records.length === 0) {
    container.innerHTML = '<p class="empty-message">今日还没有添加任何运动</p>';
    return;
  }

  const totalBurned = calculateDailyExerciseTotal(getTodayString());
  const netCalories = calculateNetCalories();

  let html = '';
  records.forEach(record => {
    html += `
      <div class="exercise-record-item">
        <div class="exercise-record-info">
          <div class="exercise-record-name">${record.name}</div>
          <div class="exercise-record-details">
            ${record.duration} 分钟 | 消耗 <span class="calories-burned">-${record.caloriesBurned.toFixed(0)} kcal</span>
          </div>
        </div>
        <button class="btn-delete" onclick="deleteExercise(${record.id})">删除</button>
      </div>
    `;
  });

  // 添加净热量显示
  html += `
    <div class="net-calories-display">
      <h4>📊 今日净摄入</h4>
      <div>摄入: ${netCalories.intake.toFixed(0)} kcal - 消耗: ${netCalories.burned.toFixed(0)} kcal</div>
      <div class="net-calories-value">= ${netCalories.net.toFixed(0)} kcal</div>
    </div>
  `;

  container.innerHTML = html;
}

// 渲染运动列表
function renderExerciseList(exercises = EXERCISE_DATABASE) {
  const container = document.getElementById('exerciseList');

  if (exercises.length === 0) {
    container.innerHTML = '<p class="empty-message">未找到相关运动</p>';
    return;
  }

  // 获取用户体重以计算预估消耗
  const settings = getUserSettings();
  const userWeight = settings ? settings.weight : 60;

  const html = exercises.map(exercise => {
    // 预估30分钟的消耗
    const estimatedCalories = calculateExerciseCalories(exercise, 30, userWeight);

    return `
      <div class="exercise-item">
        <div class="exercise-info">
          <div class="exercise-name">${exercise.name}</div>
          <div class="exercise-details">
            <span>${exercise.category}</span>
            <span>约 ${estimatedCalories.toFixed(0)} kcal / 30分钟</span>
          </div>
        </div>
        <div class="exercise-controls">
          <input
            type="number"
            class="exercise-duration-input"
            id="duration-${exercise.id}"
            placeholder="分钟"
            min="1"
            max="300"
            value="30"
          >
          <button class="btn-add" onclick="addExerciseToDay(${exercise.id})">添加</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// 渲染运动分类
function renderExerciseCategories() {
  const categories = getExerciseCategories();
  const select = document.getElementById('exerciseCategoryFilter');

  select.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`
  ).join('');
}

// 处理运动搜索
function handleExerciseSearch(event) {
  const keyword = event.target.value;
  const category = document.getElementById('exerciseCategoryFilter').value;

  let exercises = searchExercise(keyword);
  if (category !== '全部') {
    exercises = exercises.filter(ex => ex.category === category);
  }

  renderExerciseList(exercises);
}

// 处理运动分类筛选
function handleExerciseCategoryFilter(event) {
  const category = event.target.value;
  const keyword = document.getElementById('exerciseSearchInput').value;

  let exercises = filterExerciseByCategory(category);
  if (keyword) {
    exercises = exercises.filter(ex =>
      ex.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  renderExerciseList(exercises);
}

// 添加运动到今日记录
function addExerciseToDay(exerciseId) {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return;

  const durationInput = document.getElementById(`duration-${exerciseId}`);
  const duration = parseInt(durationInput.value) || 30;

  if (duration <= 0) {
    alert('请输入有效的运动时长');
    return;
  }

  addExerciseToToday(exercise, duration);
  renderTodayView();
  showToast(`已添加 ${exercise.name}（${duration}分钟）`);

  // 重置输入为30
  durationInput.value = 30;
}

// 删除运动记录
function deleteExercise(recordId) {
  if (confirm('确定要删除这条运动记录吗？')) {
    deleteTodayExercise(recordId);
    renderTodayView();
    showToast('已删除运动记录');
  }
}
