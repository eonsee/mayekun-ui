<template>
  <a-config-provider :theme="antdTheme">
    <div class="app-container" :class="{ 'dark-mode': isDark }">
      <AppHeader />
      <main class="main-content">
        <router-view />
      </main>
      <AppFooter />
      <!-- 对联 - 暂时关闭 -->
      <!-- <Couplet v-if="showCouplet" /> -->
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, provide, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { theme as antdThemeFunc } from 'ant-design-vue'
import { useBlogStore } from '@/store'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import Couplet from '@/components/common/Couplet.vue'

const route = useRoute()
const blogStore = useBlogStore()
const isDark = ref(false)

const showCouplet = computed(() => {
  return route.path !== '/'
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// 季节对应的 Ant Design 主色
const seasonColors: Record<string, string> = {
  spring: '#22c55e',
  summer: '#06b6d4',
  autumn: '#f97316',
  winter: '#6366f1',
}

// 监听季节变化，切换主题色
watchEffect(() => {
  document.documentElement.setAttribute('data-season', blogStore.currentSeason)
})

// Ant Design 动态主题
const antdTheme = computed(() => ({
  algorithm: isDark.value ? antdThemeFunc.darkAlgorithm : antdThemeFunc.defaultAlgorithm,
  token: {
    colorPrimary: seasonColors[blogStore.currentSeason] || '#3b82f6',
  },
}))

provide('theme', { isDark, toggleTheme })
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

.main-content {
  flex: 1;
  padding-top: 64px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
