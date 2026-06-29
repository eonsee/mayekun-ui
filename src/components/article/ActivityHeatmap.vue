<template>
  <div class="activity-heatmap">
    <div class="heatmap-header">
      <h3 class="heatmap-title">文章动态</h3>
      <div class="heatmap-controls">
        <!-- 模式切换 -->
        <div class="mode-switch">
          <button
            class="mode-btn"
            :class="{ active: heatmapMode === 'season' }"
            @click="setMode('season')"
            title="四季模式"
          >四季</button>
          <button
            class="mode-btn"
            :class="{ active: heatmapMode === 'solar' }"
            @click="setMode('solar')"
            title="节气模式"
          >节气</button>
        </div>
        <!-- 四季选择 -->
        <div v-if="heatmapMode === 'season'" class="season-switch">
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
        <!-- 节气选择 -->
        <div v-if="heatmapMode === 'solar'" class="solar-switch">
          <button
            v-for="st in SOLAR_TERMS"
            :key="st.key"
            class="solar-btn"
            :class="{ active: currentSolarTerm === st.key }"
            :style="currentSolarTerm === st.key ? { background: st.color, color: getContrastColor(st.color) } : {}"
            @click="blogStore.currentSolarTerm = st.key"
            :title="st.name + '：' + st.desc"
          >
            {{ st.name }}
          </button>
          <span class="solar-desc">{{ activeSolarDesc }}</span>
        </div>
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
              :style="heatmapMode === 'solar' ? getSolarStyle(day.count) : {}"
              :title="`${day.date}: ${day.count} 篇文章`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-legend">
        <template v-if="heatmapMode === 'season'">
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
        </template>
        <template v-else>
          <div class="legend-item" style="background: #f1f5f9"></div>
          <span class="legend-label">0</span>
          <div class="legend-item" :style="{ background: getSolarBaseColor(0.3) }"></div>
          <span class="legend-label">1</span>
          <div class="legend-item" :style="{ background: getSolarBaseColor(0.55) }"></div>
          <span class="legend-label">2</span>
          <div class="legend-item" :style="{ background: getSolarBaseColor(0.8) }"></div>
          <span class="legend-label">3</span>
          <div class="legend-item" :style="{ background: getSolarBaseColor(1) }"></div>
          <span class="legend-label">≥4</span>
        </template>
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
import { computed, onMounted } from 'vue'
import { useBlogStore, SOLAR_TERMS, type SolarTermKey, type HeatmapMode } from '@/store'

const blogStore = useBlogStore()
const currentSeason = computed(() => blogStore.currentSeason)
const currentSolarTerm = computed(() => blogStore.currentSolarTerm)
const heatmapMode = computed(() => blogStore.heatmapMode)

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

// 模式切换
const setMode = (mode: HeatmapMode) => {
  blogStore.heatmapMode = mode
}

// 判断文字颜色（深色背景用白字，浅色背景用黑字）
const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1e293b' : '#ffffff'
}

// 获取当前节气的颜色配置
const getActiveSolarTerm = () => {
  return SOLAR_TERMS.find(st => st.key === currentSolarTerm.value) || SOLAR_TERMS[0]
}

// 当前节气的描述
const activeSolarDesc = computed(() => {
  const st = getActiveSolarTerm()
  return `${st.name}：${st.desc}`
})

// 节气模式：根据 count 返回内联样式（基于节气颜色不同透明度）
const getSolarStyle = (count: number): Record<string, string> => {
  if (count === 0) return {}
  const baseColor = getActiveSolarTerm().color
  const opacity = count === 1 ? 0.35 : count === 2 ? 0.6 : count === 3 ? 0.8 : 1
  return { background: baseColor, opacity: String(opacity) }
}

// 节气模式图例颜色
const getSolarBaseColor = (opacity: number): string => {
  const baseColor = getActiveSolarTerm().color
  const r = parseInt(baseColor.slice(1, 3), 16)
  const g = parseInt(baseColor.slice(3, 5), 16)
  const b = parseInt(baseColor.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// 计算起始日期的偏移量（用于对齐周天）
const getStartOffset = (): number => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 364)
  const dayOfWeek = startDate.getDay()
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

// 将后端热力图数据填充到 365 天网格中
const activityData = computed<ActivityDay[]>(() => {
  const data: ActivityDay[] = []
  const today = new Date()
  const heatMapMap = new Map<string, number>()
  blogStore.heatMapData.forEach((item) => {
    heatMapMap.set(item.date, item.count)
  })

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const count = heatMapMap.get(dateStr) || 0
    data.push({ date: dateStr, count })
  }

  return data
})

const totalArticles = computed(() => {
  return activityData.value.reduce((sum, day) => sum + day.count, 0)
})

const activeDays = computed(() => {
  return activityData.value.filter(day => day.count > 0).length
})

const getLevelClass = (count: number): string => {
  if (heatmapMode.value !== 'season') return 'level-0'
  const season = currentSeason.value
  if (count === 0) return `${season}-level-0`
  if (count === 1) return `${season}-level-1`
  if (count === 2) return `${season}-level-2`
  if (count === 3) return `${season}-level-3`
  return `${season}-level-4`
}

// 组件加载时拉取热力图数据
onMounted(() => {
  blogStore.fetchHeatMapData()
})
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
  flex-wrap: wrap;
  gap: 8px;
}

.heatmap-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.heatmap-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mode-switch {
  display: flex;
  gap: 2px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.mode-btn {
  padding: 2px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--primary-color);
  color: white;
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

.solar-switch {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.solar-btn {
  padding: 2px 6px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.625rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.solar-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.solar-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  align-self: center;
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
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
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
.winter-level-0,
.level-0 {
  background: #f1f5f9;
}

[data-theme='dark'] .spring-level-0,
[data-theme='dark'] .summer-level-0,
[data-theme='dark'] .autumn-level-0,
[data-theme='dark'] .winter-level-0,
[data-theme='dark'] .level-0 {
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

  .solar-switch {
    gap: 2px;
  }

  .solar-btn {
    font-size: 0.5rem;
    padding: 1px 4px;
  }
}
</style>
