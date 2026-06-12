<template>
  <header class="app-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <span class="logo-text gradient-text">mayekun.com</span>
      </router-link>

      <nav class="nav-menu" :class="{ 'nav-open': isMobileMenuOpen }">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <Menu :size="24" v-if="!isMobileMenuOpen" />
          <X :size="24" v-else />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'

const { isDark, toggleTheme } = inject('theme') as {
  isDark: { value: boolean }
  toggleTheme: () => void
}

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/articles' },
  { name: '作品', path: '/works' },
  { name: '关于', path: '/about' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-normal);
}

[data-theme='dark'] .app-header {
  background: rgba(15, 15, 26, 0.8);
}

.header-scrolled {
  border-bottom-color: var(--border-color);
  box-shadow: var(--shadow-sm);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  padding: 8px 0;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: width var(--transition-normal);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.mobile-menu-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 32px;
    gap: 0;
    background: var(--bg-primary);
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }

  .nav-open {
    transform: translateX(0);
  }

  .nav-link {
    width: 100%;
    padding: 16px 24px;
    font-size: 1.125rem;
    border-bottom: 1px solid var(--border-light);
  }

  .nav-link::after {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}
</style>
