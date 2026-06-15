<template>
  <div class="auto-reader" :class="{ active: isPlaying }">
    <!-- 播放控制 -->
    <button class="reader-btn play-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '自动阅读'">
      <Pause v-if="isPlaying" :size="18" />
      <Play v-else :size="18" />
    </button>

    <!-- 倍速选择 -->
    <div class="speed-control" v-if="showSpeedMenu || isPlaying">
      <button
        v-for="s in speeds"
        :key="s"
        class="speed-btn"
        :class="{ active: speed === s }"
        @click="setSpeed(s)"
      >
        {{ s }}x
      </button>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar" v-if="isPlaying">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Play, Pause } from 'lucide-vue-next'

const isPlaying = ref(false)
const speed = ref(1)
const progress = ref(0)
const showSpeedMenu = ref(false)

const speeds = [0.5, 1, 1.5, 2]

let animationId: number | null = null
let lastTime = 0

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoScroll()
  } else {
    stopAutoScroll()
  }
}

const setSpeed = (s: number) => {
  speed.value = s
}

const startAutoScroll = () => {
  lastTime = performance.now()
  animate()
}

const stopAutoScroll = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const animate = () => {
  const currentTime = performance.now()
  const delta = currentTime - lastTime
  lastTime = currentTime

  // 根据倍速计算滚动距离
  const scrollSpeed = 50 * speed.value // 基础速度 50px/s
  const scrollAmount = (scrollSpeed * delta) / 1000

  window.scrollBy(0, scrollAmount)

  // 计算进度
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = (scrollTop / docHeight) * 100

  // 检查是否滚动到底部
  if (scrollTop >= docHeight - 10) {
    isPlaying.value = false
    stopAutoScroll()
    return
  }

  if (isPlaying.value) {
    animationId = requestAnimationFrame(animate)
  }
}

// 监听用户手动滚动
const handleScroll = () => {
  if (isPlaying.value) {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = (scrollTop / docHeight) * 100
  }
}

// 监听用户手动滚动停止自动播放
const handleWheel = () => {
  if (isPlaying.value) {
    isPlaying.value = false
    stopAutoScroll()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('wheel', handleWheel)
})

onUnmounted(() => {
  stopAutoScroll()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleWheel)
})

// 暴露方法供外部调用
defineExpose({
  play: () => {
    isPlaying.value = true
    startAutoScroll()
  },
  pause: () => {
    isPlaying.value = false
    stopAutoScroll()
  }
})
</script>

<style scoped>
.auto-reader {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  transition: all var(--transition-fast);
}

.auto-reader:hover {
  box-shadow: var(--shadow-xl);
}

.reader-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reader-btn:hover {
  background: var(--primary-color);
  color: white;
}

.auto-reader.active .play-btn {
  background: var(--primary-color);
  color: white;
}

.speed-control {
  display: flex;
  gap: 4px;
}

.speed-btn {
  padding: 6px 10px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.speed-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.speed-btn.active {
  background: var(--primary-color);
  color: white;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

@media (max-width: 768px) {
  .auto-reader {
    right: 16px;
    bottom: 16px;
  }

  .progress-bar {
    display: none;
  }
}
</style>
