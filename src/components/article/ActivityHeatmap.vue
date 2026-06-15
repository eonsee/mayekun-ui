<template>
  <div class="activity-heatmap">
    <div class="heatmap-header">
      <h3 class="heatmap-title">文章动态</h3>
      <div class="season-switch">
        <button
          v-for="s in seasons"
          :key="s.key"
          class="season-btn"
          :class="{ active: currentSeason === s.key }"
          @click="blogStore.currentSeason = s.key"
          :title="s.label"
        >
          {{ s.icon }}
        </button>
      </div>
    </div>
    <div class="heatmap-wrapper">
      <!-- 热力图主体 -->
      <div class="heatmap-main">
        <!-- 月份标签 -->
        <div class="month-labels">
          <span v-for="(month, index) in monthLabels" :key="index" class="month-label">{{ month }}</span>
        </div>
        <!-- 热力图区域 -->
        <div class="heatmap-content">
          <!-- 周天标签 -->
          <div class="weekday-labels">
            <span class="weekday-label">周一</span>
            <span class="weekday-label"></span>
            <span class="weekday-label">周三</span>
            <span class="weekday-label"></span>
            <span class="weekday-label"></span>
            <span class="weekday-label"></span>
            <span class="weekday-label">周日</span>
          </div>
          <!-- 热力格子 -->
          <div class="heatmap-grid">
            <!-- 空白占位格子，用于对齐周天 -->
            <div
              v-for="i in startOffset"
              :key="'offset-' + i"
              class="heatmap-day empty"
            ></div>
            <div
              v-for="(day, index) in activityData"
              :key="index"
              class="heatmap-day"
              :class="getLevelClass(day.count)"
              :title="`${day.date}: ${day.count} 篇文章`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-legend">
        <div class="legend-item" :class="getLevelClass(0)"></div>
        <span class="legend-label">0</span>
        <div class="legend-item" :class="getLevelClass(1)"></div>
        <span class="legend-label">1</span>
        <div class="legend-item" :class="getLevelClass(2)"></div>
        <span class="legend-label">2</span>
        <div class="legend-item" :class="getLevelClass(3)"></div>
        <span class="legend-label">3</span>
        <div class="legend-item" :class="getLevelClass(4)"></div>
        <span class="legend-label">≥4</span>
      </div>
      <div class="heatmap-stats">
        <div class="stat-item">
          <span class="stat-value">{{ totalArticles }}</span>
          <span class="stat-label">篇文章</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ activeDays }}</span>
          <span class="stat-label">天活跃</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/store'

const blogStore = useBlogStore()
const currentSeason = computed(() => blogStore.currentSeason)

interface ActivityDay {
  date: string
  count: number
}

// 季节配置
const seasons: { key: 'spring' | 'summer' | 'autumn' | 'winter'; label: string; icon: string }[] = [
  { key: 'spring', label: '春季', icon: '春' },
  { key: 'summer', label: '夏季', icon: '夏' },
  { key: 'autumn', label: '秋季', icon: '秋' },
  { key: 'winter', label: '冬季', icon: '冬' }
]

// 获取当前季节
// 计算起始日期的偏移量（用于对齐周天）
const getStartOffset = (): number => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 364)
  // 获取星期几：0=周日, 1=周一, ..., 6=周六
  const dayOfWeek = startDate.getDay()
  // 转换为周一=0, 周日=6
  return dayOfWeek === 0 ? 6 : dayOfWeek - 1
}

const startOffset = getStartOffset()

// 生成月份标签
const generateMonthLabels = (): string[] => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const today = new Date()
  const labels: string[] = []
  let lastMonth = -1

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const month = date.getMonth()
    if (month !== lastMonth) {
      labels.push(months[month])
      lastMonth = month
    }
  }
  return labels
}

const monthLabels = generateMonthLabels()

// 生成过去一年的活动数据
const generateActivityData = (): ActivityDay[] => {
  const data: ActivityDay[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // 模拟数据：随机生成 0-3 篇文章
    const random = Math.random()
    let count = 0
    if (random > 0.7) count = Math.floor(Math.random() * 3) + 1

    data.push({ date: dateStr, count })
  }

  return data
}

const activityData = generateActivityData()

const totalArticles = computed(() => {
  return activityData.reduce((sum, day) => sum + day.count, 0)
})

const activeDays = computed(() => {
  return activityData.filter(day => day.count > 0).length
})

const getLevelClass = (count: number): string => {
  const season = currentSeason.value
  if (count === 0) return `${season}-level-0`
  if (count === 1) return `${season}-level-1`
  if (count === 2) return `${season}-level-2`
  if (count === 3) return `${season}-level-3`
  return `${season}-level-4`
}
</script>

<style scoped>
.activity-heatmap {
  padding: 20px 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.heatmap-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.season-switch {
  display: flex;
  gap: 4px;
}

.season-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.season-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.season-btn.active {
  background: var(--primary-color);
  color: white;
}

.heatmap-wrapper {
  margin-bottom: 12px;
}

.heatmap-main {
  width: 100%;
}

.heatmap-content {
  display: flex;
  gap: 8px;
}

.month-labels {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
  margin-left: 32px;
  font-size: 0.625rem;
  color: var(--text-tertiary);
}

.month-label {
  flex: 1;
  text-align: left;
}

.weekday-labels {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 2px;
  font-size: 0.625rem;
  color: var(--text-tertiary);
  align-items: center;
}

.weekday-label {
  height: 10px;
  line-height: 10px;
}

.heatmap-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 2px;
}

.heatmap-day {
  aspect-ratio: 1;
  border-radius: 2px;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.heatmap-day:hover {
  transform: scale(1.4);
}

.heatmap-day.empty {
  background: transparent;
  cursor: default;
}

.heatmap-day.empty:hover {
  transform: none;
}

/* 无活动格子 - 统一颜色 */
.spring-level-0,
.summer-level-0,
.autumn-level-0,
.winter-level-0 {
  background: #f1f5f9;
}

[data-theme='dark'] .spring-level-0,
[data-theme='dark'] .summer-level-0,
[data-theme='dark'] .autumn-level-0,
[data-theme='dark'] .winter-level-0 {
  background: #1e293b;
}

/* 春季 - 嫩绿色 */
.spring-level-1 { background: #86efac; }
.spring-level-2 { background: #22c55e; }
.spring-level-3 { background: #16a34a; }
.spring-level-4 { background: #15803d; }

/* 夏季 - 清凉蓝/青色 */
.summer-level-1 { background: #67e8f9; }
.summer-level-2 { background: #06b6d4; }
.summer-level-3 { background: #0891b2; }
.summer-level-4 { background: #0e7490; }

/* 秋季 - 橙色/棕色 */
.autumn-level-1 { background: #fdba74; }
.autumn-level-2 { background: #f97316; }
.autumn-level-3 { background: #ea580c; }
.autumn-level-4 { background: #c2410c; }

/* 冬季 - 冷蓝色/紫色 */
.winter-level-1 { background: #93c5fd; }
.winter-level-2 { background: #3b82f6; }
.winter-level-3 { background: #2563eb; }
.winter-level-4 { background: #1d4ed8; }

/* 暗色主题 */
[data-theme='dark'] .spring-level-1 { background: #166534; }
[data-theme='dark'] .spring-level-2 { background: #22c55e; }
[data-theme='dark'] .spring-level-3 { background: #4ade80; }
[data-theme='dark'] .spring-level-4 { background: #86efac; }

[data-theme='dark'] .summer-level-1 { background: #155e75; }
[data-theme='dark'] .summer-level-2 { background: #06b6d4; }
[data-theme='dark'] .summer-level-3 { background: #22d3ee; }
[data-theme='dark'] .summer-level-4 { background: #67e8f9; }

[data-theme='dark'] .autumn-level-1 { background: #9a3412; }
[data-theme='dark'] .autumn-level-2 { background: #f97316; }
[data-theme='dark'] .autumn-level-3 { background: #fb923c; }
[data-theme='dark'] .autumn-level-4 { background: #fdba74; }

[data-theme='dark'] .winter-level-1 { background: #1e40af; }
[data-theme='dark'] .winter-level-2 { background: #3b82f6; }
[data-theme='dark'] .winter-level-3 { background: #60a5fa; }
[data-theme='dark'] .winter-level-4 { background: #93c5fd; }

.heatmap-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-label {
  font-size: 0.625rem;
  color: var(--text-tertiary);
}

.legend-item {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.heatmap-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .activity-heatmap {
    padding: 16px;
  }

  .heatmap-grid {
    grid-template-columns: repeat(26, 1fr);
  }

  .heatmap-day:nth-child(n+183) {
    display: none;
  }

  .weekday-labels {
    font-size: 0.5rem;
  }

  .month-labels {
    font-size: 0.5rem;
    margin-left: 24px;
  }
}
</style>
