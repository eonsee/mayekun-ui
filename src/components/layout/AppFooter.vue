<template>
  <footer class="app-footer">
    <div class="container footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">
            <!-- <span class="gradient-text">mayekkun</span> -->
            <span class="gradient-text">每一段成长都会有新的热爱</span>
          </router-link>
          <p class="footer-tagline">创造、分享、成长</p>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4 class="footer-title">导航</h4>
            <router-link to="/" class="footer-link">首页</router-link>
            <router-link to="/articles" class="footer-link">文章</router-link>
            <router-link to="/works" class="footer-link">作品</router-link>
            <router-link to="/about" class="footer-link">关于</router-link>
          </div>

          <div class="footer-column">
            <h4 class="footer-title">社交</h4>
            <a href="https://github.com/eonsee" target="_blank" class="footer-link">
              <Github :size="16" />
              GitHub
            </a>
            <!-- <a href="https://gitee.com/mayekun" target="_blank" class="footer-link">
              <Gitee :size="16" />
              Gitee
            </a> -->
            <a href="https://twitter.com" target="_blank" class="footer-link">
              <Twitter :size="16" />
              Twitter
            </a>
            <a href="mailto:hello@mayekun.com" class="footer-link">
              <Mail :size="16" />
              Email
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} 马业坤 版权所有
        </p>
        <div class="footer-icp">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            桂ICP备2024029466号-3
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Github, Twitter, Mail, } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border-color);
  padding: 48px 0 24px;
}

[data-theme='dark'] .app-footer {
  background: rgba(15, 15, 26, 0.8);
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.footer-tagline {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  gap: 64px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.copyright,
.domain {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.footer-icp a {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.footer-icp a:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 32px;
  }

  .footer-links {
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
