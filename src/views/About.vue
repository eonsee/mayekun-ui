<template>
  <div class="about-page" :class="{ 'has-bg': hoveredSpot }">
    <!-- Dynamic Background -->
    <transition name="bg-fade">
      <div v-if="hoveredSpot" class="page-dynamic-bg" :key="hoveredSpot.name">
        <img :src="hoveredSpot.image" alt="" class="bg-img" />
        <div class="bg-overlay"></div>
        <div class="bg-info">
          <h3 class="bg-spot-name">{{ hoveredSpot.name }}</h3>
          <p class="bg-spot-desc">{{ hoveredSpot.desc }}</p>
        </div>
      </div>
    </transition>

    <div class="container page-content">
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
              <a v-if="profile.social.gitee" :href="profile.social.gitee" target="_blank" class="social-link" title="Gitee">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" fill-rule="evenodd">
                  <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zM7.527 4.5c-.55 0-1 .45-1 1s.45 1 1 1h3.5c.55 0 1 .45 1 1s-.45 1-1 1h-3.5c-.55 0-1 .45-1 1s.45 1 1 1h3.5c.55 0 1 .45 1 1s-.45 1-1 1h-3.5c-.55 0-1 .45-1 1s.45 1 1 1h3.5c.55 0 1 .45 1 1s-.45 1-1 1h-3.5c-.55 0-1 .45-1 1s.45 1 1 1h7.5c2.21 0 4-1.79 4-4s-1.79-4-4-4h-7.5z"/>
                </svg>
              </a>
              <a v-if="profile.social.juejin" :href="profile.social.juejin" target="_blank" class="social-link" title="掘金">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 14.316l7.454-5.88-2.022-1.625L12 10.995l-5.432-4.184-2.022 1.625L12 14.316zm0-7.47l7.454-5.88-2.022-1.626L12 3.527l-5.432-4.187-2.022 1.626L12 6.846zm0 14.94l-7.454-5.88 2.022-1.626L12 19.995l5.432-4.215 2.022 1.626L12 21.856z"/>
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
        <div class="skills-card">
          <div class="skill-items">
            <a
              v-for="item in profile.skills"
              :key="item.name"
              :href="item.url || '#'"
              :target="item.url ? '_blank' : undefined"
              class="skill-tag"
              :title="item.name"
            >
              <img
                :src="`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.icon}/${item.icon}-original.svg`"
                :alt="item.name"
                class="skill-icon"
                @error="onIconError"
              />
              <span class="skill-tag-name">{{ item.name }}</span>
            </a>
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

      <!-- Guangxi Travel Section -->
      <section class="travel-section">
        <div class="travel-header">
          <h2 class="section-title">广西风光</h2>
          <button class="recommend-btn" @click="showRecommendModal = true">
            <Plus :size="16" />
            推荐景点
          </button>
        </div>
        <div class="travel-marquee">
          <div class="marquee-track" :class="{ paused: isPaused }">
            <div
              v-for="(spot, i) in [...guangxiSpots, ...guangxiSpots]"
              :key="i"
              class="travel-card"
              @mouseenter="onCardHover(spot)"
              @mouseleave="onCardLeave"
            >
              <img :src="spot.image" :alt="spot.name" class="travel-img" />
              <div class="travel-overlay">
                <h4 class="travel-name">{{ spot.name }}</h4>
                <p class="travel-desc">{{ spot.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Recommend Modal -->
    <a-modal
      v-model:open="showRecommendModal"
      title="推荐广西景点"
      :okText="'提交审核'"
      :cancelText="'取消'"
      @ok="submitRecommend"
      :okButtonProps="{ disabled: !recommendForm.name || !recommendForm.desc }"
    >
      <div class="recommend-form">
        <div class="form-item">
          <label>景点名称 <span class="required">*</span></label>
          <a-input v-model:value="recommendForm.name" placeholder="如：桂林山水" />
        </div>
        <div class="form-item">
          <label>景点描述 <span class="required">*</span></label>
          <a-textarea v-model:value="recommendForm.desc" placeholder="简短描述该景点的特色" :rows="3" />
        </div>
        <div class="form-item">
          <label>景点图片</label>
          <a-input v-model:value="recommendForm.image" placeholder="图片URL（可选）" />
        </div>
        <div class="form-item">
          <label>推荐人</label>
          <a-input v-model:value="recommendForm.author" placeholder="您的昵称（可选）" />
        </div>
        <div class="form-tip">
          <Info :size="14" />
          提交后将由站主审核后展示
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { MapPin, Github, Twitter, Linkedin, Mail, Send, Plus, Info } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import myAvatar from '@/assets/my.jpg'

const blogStore = useBlogStore()
const profile = computed(() => blogStore.profileData)

onMounted(() => {
  blogStore.fetchProfile()
  blogStore.fetchSkills()
})
const isPaused = ref(false)
const hoveredSpot = ref<{ name: string; desc: string; image: string } | null>(null)
const showRecommendModal = ref(false)
const recommendForm = ref({
  name: '',
  desc: '',
  image: '',
  author: ''
})

let hoverTimer: ReturnType<typeof setTimeout> | null = null

const onCardHover = (spot: { name: string; desc: string; image: string }) => {
  isPaused.value = true
  hoverTimer = setTimeout(() => {
    hoveredSpot.value = spot
  }, 300)
}

const onCardLeave = () => {
  isPaused.value = false
  hoveredSpot.value = null
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

const submitRecommend = () => {
  // 前端模拟提交，实际项目中应调用后端API
  const pending = JSON.parse(localStorage.getItem('guangxi_pending') || '[]')
  pending.push({
    ...recommendForm.value,
    status: 'pending',
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('guangxi_pending', JSON.stringify(pending))
  recommendForm.value = { name: '', desc: '', image: '', author: '' }
  showRecommendModal.value = false
}

const onIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  const src = img.src.replace('-original.svg', '-plain.svg')
  if (img.src !== src) {
    img.src = src
  } else {
    img.style.display = 'none'
  }
}

const guangxiSpots = [
  { name: '桂林山水', desc: '山水甲天下', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Guilin%20karst%20mountains%20Li%20River%20misty%20landscape%20China%20photography&image_size=landscape_16_9' },
  { name: '阳朔西街', desc: '千年古街风情', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yangshuo%20West%20Street%20night%20lanterns%20ancient%20town%20Guangxi%20China&image_size=landscape_16_9' },
  { name: '龙脊梯田', desc: '大地艺术奇观', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Longji%20rice%20terraces%20golden%20layers%20mountains%20Guangxi%20China%20aerial%20view&image_size=landscape_16_9' },
  { name: '德天瀑布', desc: '亚洲第一跨国瀑布', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Detian%20waterfall%20cascading%20water%20lush%20green%20Guangxi%20border%20China&image_size=landscape_16_9' },
  { name: '北海银滩', desc: '天下第一滩', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beihai%20Silver%20Beach%20white%20sand%20blue%20sea%20tropical%20Guangxi%20China&image_size=landscape_16_9' },
  { name: '黄姚古镇', desc: '千年古镇梦境', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Huangyao%20ancient%20town%20stone%20bridge%20river%20traditional%20buildings%20Guangxi&image_size=landscape_16_9' },
  { name: '漓江风光', desc: '百里画廊', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Li%20River%20bamboo%20raft%20karst%20peaks%20reflection%20water%20Guilin%20China&image_size=landscape_16_9' },
  { name: '涠洲岛', desc: '中国最年轻火山岛', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Weizhou%20Island%20volcanic%20rock%20cliff%20ocean%20tropical%20Beihai%20Guangxi&image_size=landscape_16_9' },
  { name: '象鼻山', desc: '桂林城徽标志', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elephant%20Trunk%20Hill%20Xiangbishan%20Guilin%20river%20reflection%20sunset%20China&image_size=landscape_16_9' },
  { name: '遇龙河', desc: '小家碧玉般清幽', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yulong%20River%20bamboo%20rafting%20peaceful%20countryside%20karst%20Yangshuo%20Guangxi&image_size=landscape_16_9' },
]
</script>

<style scoped>
.about-page {
  position: relative;
  padding: 48px 0 80px;
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* Dynamic Background */
.page-dynamic-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px) brightness(0.4);
  transform: scale(1.05);
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.bg-info {
  position: absolute;
  bottom: 80px;
  left: 80px;
  color: white;
  z-index: 1;
}

.bg-spot-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.bg-spot-desc {
  font-size: 1.125rem;
  opacity: 0.9;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

/* Page content layer */
.page-content {
  position: relative;
  z-index: 1;
}

/* When background is active, make cards more opaque */
.about-page.has-bg .profile-card,
.about-page.has-bg .skills-card,
.about-page.has-bg .contact-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.about-page.has-bg .section-title {
  color: white;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.about-page.has-bg .skill-tag {
  background: rgba(255, 255, 255, 0.85);
}

.about-page.has-bg .travel-header .section-title {
  color: white;
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
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
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
  transition: color 0.4s ease;
}

.skills-card {
  padding: 28px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.skill-tag:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.06);
  transform: translateY(-1px);
  color: var(--primary-color);
}

.skill-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.skill-tag-name {
  white-space: nowrap;
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
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
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

/* Guangxi Travel Section */
.travel-section {
  margin-bottom: 64px;
}

.travel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.travel-header .section-title {
  margin-bottom: 0;
}

.recommend-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.recommend-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.travel-marquee {
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.marquee-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: marquee-scroll 80s linear infinite;
}

.marquee-track.paused {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.travel-card {
  position: relative;
  flex-shrink: 0;
  width: 300px;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.travel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.travel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.travel-card:hover .travel-img {
  transform: scale(1.08);
}

.travel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.travel-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.travel-desc {
  font-size: 0.75rem;
  opacity: 0.85;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Recommend Modal */
.recommend-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.required {
  color: #f56c6c;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.06);
  border-radius: var(--radius-lg);
}

@media (max-width: 1024px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
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

  .bg-info {
    left: 24px;
    bottom: 40px;
  }

  .bg-spot-name {
    font-size: 1.75rem;
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

  .travel-card {
    width: 240px;
    height: 160px;
  }

  .bg-spot-name {
    font-size: 1.5rem;
  }

  .bg-info {
    left: 16px;
    bottom: 24px;
  }
}
</style>
