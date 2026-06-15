<template>
  <div class="article-toc">
    <h4 class="toc-title">目录</h4>
    <nav class="toc-nav">
      <ul class="toc-list">
        <li
          v-for="(heading, index) in headings"
          :key="index"
          class="toc-item"
          :class="{ active: activeIndex === index }"
        >
          <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id, index)">
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  content: string
}>()

interface Heading {
  id: string
  text: string
  level: number
}

const headings = computed<Heading[]>(() => {
  const regex = /^#{1,3}\s+(.+)$/gm
  const matches: Heading[] = []
  let match

  while ((match = regex.exec(props.content)) !== null) {
    const text = match[1].trim()
    const level = match[0].trim().split(' ')[0].length
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '')
    matches.push({ id, text, level })
  }

  return matches
})

const activeIndex = ref(0)

const scrollToHeading = (id: string, index: number) => {
  activeIndex.value = index
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  const headingElements = headings.value.map(h => document.getElementById(h.id))
  const scrollPosition = window.scrollY + 100

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    if (element && element.offsetTop <= scrollPosition) {
      activeIndex.value = i
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-toc {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.toc-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.toc-list {
  list-style: none;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-item a {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  padding: 6px 0;
  transition: all var(--transition-fast);
}

.toc-item a:hover {
  color: var(--text-primary);
}

.toc-item.active a {
  color: var(--primary-color);
}
</style>
