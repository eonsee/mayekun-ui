<template>
  <div class="works-page">
    <div class="container">
      <!-- Growth Timeline -->
      <section class="timeline-section">
        <div class="timeline-header">
          <h2 class="timeline-title">成长轨迹</h2>
          <p class="timeline-subtitle">每一步，都算数</p>
        </div>

        <div class="timeline-body">
          <!-- SVG curved line -->
          <svg class="timeline-svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M 0,60 C 100,20 200,100 300,60 C 400,20 500,100 600,60 C 700,20 800,100 900,60 C 1000,20 1100,100 1200,60"
              stroke="url(#lineGrad)" stroke-width="3" fill="none" filter="url(#glow)"/>
          </svg>

          <div class="timeline-nodes">
            <div
              v-for="(item, index) in timeline"
              :key="item.year"
              class="tl-node"
              :class="{ active: activeNode === index, current: item.isCurrent }"
              @mouseenter="activeNode = index"
              @mouseleave="activeNode = -1"
            >
              <!-- Pulse ring -->
              <div v-if="item.isCurrent" class="pulse-ring"></div>

              <!-- Node icon -->
              <div class="node-icon" :style="{ background: item.color }">
                <svg viewBox="0 0 40 40" width="24" height="24" fill="none" v-html="item.svgPath"></svg>
              </div>

              <!-- Year badge -->
              <div class="node-year-badge" :style="{ borderColor: item.color }">
                <span class="year-text">{{ item.year }}</span>
              </div>

              <!-- Info card -->
              <div class="node-info">
                <div class="info-label" :style="{ color: item.color }">{{ item.label }}</div>
                <div class="info-desc">{{ item.desc }}</div>
                <div v-if="item.achievements.length" class="info-tags">
                  <span v-for="a in item.achievements" :key="a" class="info-tag" :style="{ background: item.color + '14', color: item.color }">{{ a }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Works Grid -->
      <div class="works-grid">
        <WorkCard
          v-for="(work, index) in works"
          :key="work.id"
          :work="work"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="animate-fade-in-up"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBlogStore } from '@/store'
import WorkCard from '@/components/work/WorkCard.vue'

const blogStore = useBlogStore()
const works = computed(() => blogStore.filteredWorks)
const activeNode = ref(-1)

interface TimelineItem {
  year: number
  label: string
  desc: string
  achievements: string[]
  color: string
  svgPath: string
  isCurrent: boolean
}

const timeline: TimelineItem[] = [
  {
    year: 2001,
    label: '诞生',
    desc: '来到这个世界，开启人生旅程',
    achievements: [],
    color: '#f472b6',
    svgPath: '<circle cx="20" cy="14" r="6" fill="white"/><ellipse cx="20" cy="28" rx="8" ry="6" fill="white"/><circle cx="17" cy="13" r="1" fill="#f472b6"/><circle cx="23" cy="13" r="1" fill="#f472b6"/><path d="M18 16 Q20 18 22 16" stroke="#f472b6" stroke-width="1" fill="none"/>',
    isCurrent: false
  },
  {
    year: 2006,
    label: '小学',
    desc: '踏入校园，启蒙求知之路',
    achievements: [],
    color: '#fb923c',
    svgPath: '<circle cx="20" cy="11" r="5" fill="white"/><rect x="14" y="18" width="12" height="12" rx="3" fill="white"/><line x1="20" y1="30" x2="20" y2="36" stroke="white" stroke-width="2"/><line x1="16" y1="36" x2="24" y2="36" stroke="white" stroke-width="2"/><circle cx="18" cy="10" r="1" fill="#fb923c"/><circle cx="22" cy="10" r="1" fill="#fb923c"/><path d="M18 13 Q20 15 22 13" stroke="#fb923c" stroke-width="1" fill="none"/>',
    isCurrent: false
  },
  {
    year: 2014,
    label: '初中',
    desc: '初识编程，对计算机产生浓厚兴趣',
    achievements: ['NOIP 初赛'],
    color: '#facc15',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><circle cx="18" cy="9" r="1" fill="#facc15"/><circle cx="22" cy="9" r="1" fill="#facc15"/><path d="M18 12 Q20 14 22 12" stroke="#facc15" stroke-width="1" fill="none"/><rect x="25" y="14" width="6" height="8" rx="1" fill="white" opacity="0.7"/>',
    isCurrent: false
  },
  {
    year: 2017,
    label: '高中',
    desc: '深入学习编程，参加信息学竞赛',
    achievements: ['NOIP 提高组', '省级二等奖'],
    color: '#4ade80',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><rect x="10" y="7" width="20" height="4" rx="2" fill="white" opacity="0.6"/><rect x="14" y="3" width="12" height="5" rx="1" fill="white" opacity="0.5"/><circle cx="18" cy="9" r="1" fill="#4ade80"/><circle cx="22" cy="9" r="1" fill="#4ade80"/><path d="M18 12 Q20 14 22 12" stroke="#4ade80" stroke-width="1" fill="none"/>',
    isCurrent: false
  },
  {
    year: 2020,
    label: '大学',
    desc: '计算机科学与技术专业，系统学习开发技术',
    achievements: ['全栈开发', '开源贡献', 'ACM 竞赛'],
    color: '#3b82f6',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><rect x="10" y="7" width="20" height="4" rx="2" fill="white" opacity="0.6"/><circle cx="18" cy="9" r="1" fill="#3b82f6"/><circle cx="22" cy="9" r="1" fill="#3b82f6"/><path d="M18 12 Q20 14 22 12" stroke="#3b82f6" stroke-width="1" fill="none"/><rect x="26" y="20" width="7" height="5" rx="1" fill="white" opacity="0.5"/>',
    isCurrent: false
  },
  {
    year: 2024,
    label: '工作',
    desc: 'Java 后端开发工程师，参与多个企业级项目',
    achievements: ['微服务架构', 'Spring Cloud', 'DevOps'],
    color: '#8b5cf6',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><rect x="10" y="17" width="3" height="10" rx="1" fill="white" opacity="0.5"/><circle cx="18" cy="9" r="1" fill="#8b5cf6"/><circle cx="22" cy="9" r="1" fill="#8b5cf6"/><path d="M18 12 Q20 14 22 12" stroke="#8b5cf6" stroke-width="1" fill="none"/><rect x="26" y="14" width="7" height="10" rx="1" fill="white" opacity="0.5"/>',
    isCurrent: false
  },
  {
    year: 2026,
    label: '现在',
    desc: '持续深耕技术，积累项目经验',
    achievements: ['Mayekun Blog', '开源项目'],
    color: '#ec4899',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><circle cx="18" cy="9" r="1" fill="#ec4899"/><circle cx="22" cy="9" r="1" fill="#ec4899"/><path d="M18 12 Q20 14 22 12" stroke="#ec4899" stroke-width="1" fill="none"/><circle cx="20" cy="10" r="7" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>',
    isCurrent: true
  },
  {
    year: 2030,
    label: '未来',
    desc: '持续成长，技术赋能业务，创造更多价值',
    achievements: [],
    color: '#06b6d4',
    svgPath: '<circle cx="20" cy="10" r="5" fill="white"/><rect x="13" y="17" width="14" height="13" rx="3" fill="white"/><line x1="17" y1="30" x2="15" y2="37" stroke="white" stroke-width="2"/><line x1="23" y1="30" x2="25" y2="37" stroke="white" stroke-width="2"/><circle cx="18" cy="9" r="1" fill="#06b6d4"/><circle cx="22" cy="9" r="1" fill="#06b6d4"/><path d="M18 12 Q20 14 22 12" stroke="#06b6d4" stroke-width="1" fill="none"/><path d="M28 8 L32 4 L36 8 L32 12 Z" fill="white" opacity="0.5"/><path d="M4 8 L8 4 L12 8 L8 12 Z" fill="white" opacity="0.5"/>',
    isCurrent: false
  }
]
</script>

<style scoped>
.works-page {
  padding: 48px 0 80px;
  min-height: calc(100vh - 64px);
}

/* Timeline Section */
.timeline-section {
  margin-bottom: 64px;
}

.timeline-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

.timeline-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #000;
}

.timeline-subtitle {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
}

/* Timeline Body */
.timeline-body {
  position: relative;
  padding: 0 20px;
}

.timeline-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  z-index: 0;
}

.timeline-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  padding: 0 10px;
}

.tl-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  padding-top: 36px;
  position: relative;
}

/* Pulse ring for current node */
.pulse-ring {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #8b5cf6;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1.8);
    opacity: 0;
  }
}

/* Node Icon */
.node-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.tl-node.active .node-icon {
  transform: scale(1.2) translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.tl-node.current .node-icon {
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
}

/* Year Badge */
.node-year-badge {
  margin-top: 10px;
  padding: 2px 12px;
  border-radius: 20px;
  border: 1.5px solid;
  background: var(--bg-primary);
  transition: all 0.35s ease;
}

.year-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.tl-node.active .node-year-badge {
  background: var(--bg-secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Info Card */
.node-info {
  margin-top: 12px;
  padding: 14px 12px;
  background: var(--bg-secondary);
  border-radius: 14px;
  border: 1px solid var(--border-color);
  text-align: center;
  width: 140px;
  opacity: 0.5;
  transform: translateY(6px) scale(0.96);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.tl-node.active .node-info {
  opacity: 1;
  transform: translateY(0) scale(1);
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
}

.tl-node.current .node-info {
  opacity: 1;
  transform: translateY(0) scale(1);
  border-color: #8b5cf6;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.12);
}

.info-label {
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.info-desc {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.info-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.625rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Works Grid */
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }

  .timeline-svg {
    height: 80px;
  }

  .tl-node {
    padding-top: 24px;
  }

  .node-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .node-info {
    width: 110px;
    padding: 10px 8px;
  }

  .info-desc {
    display: none;
  }

  .pulse-ring {
    width: 40px;
    height: 40px;
    top: 18px;
  }
}
</style>
