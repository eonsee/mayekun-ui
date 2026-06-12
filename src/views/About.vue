<template>
  <div class="about-page">
    <div class="container">
      <!-- Profile Section -->
      <section class="profile-section">
        <div class="profile-card">
          <div class="profile-avatar-wrapper">
            <img :src="myAvatar" :alt="profile.name" class="profile-avatar" />
            <div class="avatar-glow"></div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name gradient-text">{{ profile.name }}</h1>
            <p class="profile-title">{{ profile.title }}</p>
            <p class="profile-bio">{{ profile.bio }}</p>
            <div class="profile-location">
              <MapPin :size="16" />
              {{ profile.location }}
            </div>
            <div class="social-links">
              <a v-if="profile.social.github" :href="profile.social.github" target="_blank" class="social-link">
                <Github :size="20" />
              </a>
              <a v-if="profile.social.twitter" :href="profile.social.twitter" target="_blank" class="social-link">
                <Twitter :size="20" />
              </a>
              <a v-if="profile.social.linkedin" :href="profile.social.linkedin" target="_blank" class="social-link">
                <Linkedin :size="20" />
              </a>
              <a v-if="profile.social.weibo" :href="profile.social.weibo" target="_blank" class="social-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M10.098 20c-4.612 0-8.59-2.507-8.59-5.5 0-1.56.932-3.36 2.53-5.076 2.133-2.267 4.618-3.293 5.548-2.293.425.45.507 1.19.243 2.13-.14.49.36.34.36.34 1.44-.51 2.75-.54 3.23.24.25.41.25.95-.02 1.55-.14.32.02.42.28.36.93-.19 1.65-.12 2.04.37.43.54.36 1.38-.17 2.38-.9 1.7-3.12 4.89-5.51 4.89zm-.17-10.19c-2.18.07-3.94 1.62-3.94 3.46 0 1.84 1.76 3.3 3.94 3.23 2.18-.07 3.94-1.62 3.94-3.46 0-1.84-1.76-3.3-3.94-3.23z"/>
                </svg>
              </a>
              <a :href="`mailto:${profile.email}`" class="social-link">
                <Mail :size="20" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="skills-section">
        <h2 class="section-title">技能专长</h2>
        <div class="skills-grid">
          <div
            v-for="(skill, index) in groupedSkills"
            :key="skill.category"
            class="skill-category"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <h3 class="category-title">{{ skill.category }}</h3>
            <div class="skill-list">
              <div v-for="item in skill.skills" :key="item.name" class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">{{ item.name }}</span>
                  <span class="skill-level">{{ item.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: `${item.level}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <h2 class="section-title">联系我</h2>
        <div class="contact-card">
          <div class="contact-info">
            <div class="contact-item">
              <Mail :size="24" />
              <div>
                <div class="contact-label">邮箱</div>
                <a :href="`mailto:${profile.email}`" class="contact-value">{{ profile.email }}</a>
              </div>
            </div>
            <div class="contact-item">
              <MapPin :size="24" />
              <div>
                <div class="contact-label">位置</div>
                <div class="contact-value">{{ profile.location }}</div>
              </div>
            </div>
          </div>
          <div class="contact-cta">
            <p>有项目想要合作？或者只是想打个招呼？</p>
            <a :href="`mailto:${profile.email}`" class="cta-btn">
              <Send :size="18" />
              发送邮件
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Github, Twitter, Linkedin, Mail, Send } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import myAvatar from '@/assets/my.jpg'

const blogStore = useBlogStore()

const profile = computed(() => blogStore.profileData)

const groupedSkills = computed(() => {
  const groups: Record<string, { name: string; level: number }[]> = {}

  profile.value.skills.forEach(skill => {
    if (!groups[skill.category]) {
      groups[skill.category] = []
    }
    groups[skill.category].push({ name: skill.name, level: skill.level })
  })

  return Object.entries(groups).map(([category, skills]) => ({
    category,
    skills
  }))
})
</script>

<style scoped>
.about-page {
  padding: 48px 0 80px;
  min-height: calc(100vh - 64px);
}

/* Profile Section */
.profile-section {
  margin-bottom: 64px;
}

.profile-card {
  display: flex;
  gap: 48px;
  padding: 48px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  align-items: center;
}

.profile-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: var(--primary-gradient);
  opacity: 0.2;
  filter: blur(20px);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-title {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.profile-bio {
  font-size: 1rem;
  color: var(--text-tertiary);
  line-height: 1.8;
  margin-bottom: 16px;
}

.profile-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 0.9375rem;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: var(--primary-gradient);
  color: white;
  transform: translateY(-2px);
}

/* Skills Section */
.skills-section {
  margin-bottom: 64px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 32px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.skill-category {
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.category-title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.skill-level {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.skill-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  transition: width 1s ease;
}

/* Contact Section */
.contact-section {
  margin-bottom: 64px;
}

.contact-card {
  padding: 48px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.contact-item svg {
  color: var(--primary-color);
  margin-top: 2px;
}

.contact-label {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}

.contact-value {
  font-size: 1rem;
  color: var(--text-primary);
}

.contact-value:hover {
  color: var(--primary-color);
}

.contact-cta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 48px;
  border-left: 1px solid var(--border-color);
}

.contact-cta p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 500;
  width: fit-content;
  transition: all var(--transition-normal);
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  color: white;
}

@media (max-width: 1024px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    grid-template-columns: 1fr;
  }

  .contact-cta {
    padding-left: 0;
    padding-top: 32px;
    border-left: none;
    border-top: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .profile-name {
    font-size: 2rem;
  }

  .profile-avatar {
    width: 150px;
    height: 150px;
  }
}
</style>
