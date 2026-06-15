<template>
  <div class="stats-chart">
    <div class="chart-header">
      <div class="chart-title">
        <TrendingUp :size="20" />
        <span>阅读趋势</span>
      </div>
      <div class="chart-total">
        <span class="total-number">{{ totalViews }}</span>
        <span class="total-label">次阅读</span>
      </div>
    </div>
    <div class="chart-container">
      <div class="chart-y-axis">
        <span v-for="(label, index) in yLabels" :key="index" class="y-label">{{ label }}</span>
      </div>
      <div class="chart-area">
        <svg class="chart-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
          <!-- 网格线 -->
          <g class="grid-lines">
            <line v-for="i in 5" :key="i" x1="0" :y1="(i-1) * 30" x2="400" :y2="(i-1) * 30" />
          </g>
          <!-- 渐变填充 -->
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stop-color="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>
          <path :d="areaPath" fill="url(#chartGradient)" />
          <!-- 曲线 -->
          <path :d="linePath" class="chart-line" />
          <!-- 数据点 -->
          <g class="data-points">
            <circle
              v-for="(point, index) in dataPoints"
              :key="index"
              :cx="point.x"
              :cy="point.y"
              r="4"
              class="data-point"
            />
          </g>
        </svg>
        <div class="chart-x-axis">
          <span v-for="(label, index) in xLabels" :key="index" class="x-label">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

// 模拟过去12个月的阅读数据
const monthlyData = [320, 450, 380, 620, 580, 720, 850, 920, 780, 1050, 1200, 1380]

const totalViews = computed(() => {
  return monthlyData.reduce((sum, val) => sum + val, 0)
})

const maxValue = computed(() => Math.max(...monthlyData))
const minValue = 0

const yLabels = computed(() => {
  const step = Math.ceil(maxValue.value / 4 / 100) * 100
  return [maxValue.value, Math.round(maxValue.value * 0.75), Math.round(maxValue.value * 0.5), Math.round(maxValue.value * 0.25), 0]
})

const xLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const dataPoints = computed(() => {
  const width = 400
  const height = 120
  const padding = 10

  return monthlyData.map((value, index) => {
    const x = padding + (index / (monthlyData.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - minValue) / (maxValue.value - minValue)) * (height - padding * 2)
    return { x, y }
  })
})

const linePath = computed(() => {
  if (dataPoints.value.length === 0) return ''

  const points = dataPoints.value
  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) / 3
    const cpx2 = prev.x + (curr.x - prev.x) * 2 / 3
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }

  return path
})

const areaPath = computed(() => {
  if (dataPoints.value.length === 0) return ''

  const points = dataPoints.value
  const height = 120

  let path = `M ${points[0].x} ${height}`
  path += ` L ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) / 3
    const cpx2 = prev.x + (curr.x - prev.x) * 2 / 3
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }

  path += ` L ${points[points.length - 1].x} ${height}`
  path += ' Z'

  return path
})
</script>

<style scoped>
.stats-chart {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-title svg {
  color: var(--primary-color);
}

.chart-total {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.total-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.chart-container {
  display: flex;
  gap: 12px;
  flex: 1;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  width: 40px;
}

.y-label {
  font-size: 0.625rem;
  color: var(--text-tertiary);
  text-align: right;
}

.chart-area {
  flex: 1;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 120px;
}

.grid-lines line {
  stroke: var(--border-color);
  stroke-width: 0.5;
  stroke-dasharray: 4 4;
}

.chart-line {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-point {
  fill: var(--primary-color);
  stroke: white;
  stroke-width: 2;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-left: 4px;
  padding-right: 4px;
}

.x-label {
  font-size: 0.625rem;
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .stats-chart {
    padding: 16px;
  }

  .chart-y-axis {
    display: none;
  }

  .total-number {
    font-size: 1.25rem;
  }

  .x-label {
    font-size: 0.5rem;
  }
}
</style>
