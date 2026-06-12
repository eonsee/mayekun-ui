import type { Article, Work, Profile, Category } from '@/types'

export const articles: Article[] = [
  {
    id: '1',
    title: 'Vue 3 组合式 API 最佳实践指南',
    summary: '深入探讨 Vue 3 Composition API 的设计理念和使用技巧，帮助你构建更优雅、更可维护的组件代码。',
    content: `
# Vue 3 组合式 API 最佳实践指南

Vue 3 的组合式 API（Composition API）是一个革命性的特性，它彻底改变了我们编写 Vue 组件的方式。本文将深入探讨如何最佳地使用这一强大的工具。

## 为什么选择组合式 API？

组合式 API 提供了更好的逻辑复用能力、更灵活的代码组织方式，以及更好的 TypeScript 支持。

### 主要优势

1. **更好的逻辑复用** - 通过组合函数轻松共享逻辑
2. **更灵活的代码组织** - 按功能而非选项组织代码
3. **更好的类型推断** - 与 TypeScript 完美配合

## 基础用法

\`\`\`typescript
import { ref, computed, onMounted } from 'vue'

export function useCounter() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  onMounted(() => {
    console.log('Counter mounted')
  })
  
  return { count, doubled, increment }
}
\`\`\`

## 最佳实践

### 1. 使用组合函数

将可复用的逻辑提取到独立的组合函数中：

\`\`\`typescript
// composables/useUser.ts
export function useUser() {
  const user = ref<User | null>(null)
  const loading = ref(false)
  
  const fetchUser = async (id: string) => {
    loading.value = true
    user.value = await api.getUser(id)
    loading.value = false
  }
  
  return { user, loading, fetchUser }
}
\`\`\`

### 2. 响应式解构

使用 \`toRefs\` 保持响应性：

\`\`\`typescript
import { toRefs } from 'vue'

const props = defineProps<{ title: string }>()
const { title } = toRefs(props)
\`\`\`

## 总结

组合式 API 是 Vue 3 最重要的特性之一，掌握它将帮助你编写更好的 Vue 应用。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20code%20editor%20with%20vue%20logo%20on%20dark%20background%2C%20purple%20gradient%20accents&image_size=landscape_16_9',
    category: '前端开发',
    tags: ['Vue', 'TypeScript', '前端'],
    author: 'oaken',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: 8,
    views: 1234
  },
  {
    id: '2',
    title: '构建高性能 React 应用的 10 个技巧',
    summary: '从代码分割到虚拟列表，掌握这些优化技巧让你的 React 应用性能提升 200%。',
    content: `
# 构建高性能 React 应用的 10 个技巧

性能优化是前端开发中永恒的话题。本文将分享 10 个经过实战验证的 React 性能优化技巧。

## 1. 使用 React.memo 避免不必要的渲染

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>
})
\`\`\`

## 2. 合理使用 useMemo 和 useCallback

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => { doSomething(a, b) }, [a, b])
\`\`\`

## 3. 代码分割与懒加载

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  )
}
\`\`\`

## 4. 虚拟列表处理大数据

使用 react-window 或 react-virtualized 处理长列表。

## 5. 避免内联函数和对象

## 6. 使用 key 属性优化列表渲染

## 7. 合理的状态管理

## 8. 避免过深的组件嵌套

## 9. 使用 Web Workers 处理计算密集型任务

## 10. 图片优化与懒加载

## 总结

性能优化是一个持续的过程，需要在开发中不断实践和调整。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fast%20rocket%20launching%20with%20blue%20flames%2C%20modern%20tech%20illustration&image_size=landscape_16_9',
    category: '前端开发',
    tags: ['React', '性能优化', '前端'],
    author: 'Mayekun',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    readTime: 12,
    views: 2345
  },
  {
    id: '3',
    title: 'TypeScript 高级类型体操实战',
    summary: '从泛型到条件类型，深入理解 TypeScript 类型系统，掌握类型体操的核心技巧。',
    content: `
# TypeScript 高级类型体操实战

TypeScript 的类型系统是图灵完备的，这意味着我们可以用它进行复杂的类型计算。

## 泛型基础

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}
\`\`\`

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
\`\`\`

## 实战案例

### 实现 DeepReadonly

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P]
}
\`\`\`

## 总结

类型体操是 TypeScript 高级特性，掌握它能让你写出更安全的代码。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20typescript%20logo%20with%20geometric%20shapes%2C%20blue%20and%20white%20colors&image_size=landscape_16_9',
    category: '前端开发',
    tags: ['TypeScript', '类型系统', '前端'],
    author: 'Mayekun',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    readTime: 15,
    views: 1876
  },
  {
    id: '4',
    title: 'Node.js 微服务架构设计模式',
    summary: '探索 Node.js 微服务架构的最佳实践，包括服务拆分、通信机制和容错处理。',
    content: `
# Node.js 微服务架构设计模式

微服务架构已经成为构建大型分布式系统的主流选择。本文将探讨 Node.js 环境下的微服务设计模式。

## 服务拆分原则

1. **单一职责** - 每个服务只做一件事
2. **高内聚低耦合** - 服务内部紧密相关，服务之间松散耦合
3. **独立部署** - 每个服务可以独立部署和扩展

## 通信模式

### 同步通信

使用 REST 或 gRPC 进行服务间调用。

### 异步通信

使用消息队列（如 RabbitMQ、Kafka）进行解耦。

## 服务发现

\`\`\`javascript
// 使用 Consul 进行服务注册
const consul = require('consul')()

consul.agent.service.register({
  name: 'user-service',
  address: '192.168.1.100',
  port: 3000
})
\`\`\`

## 总结

微服务架构需要权衡利弊，适合的才是最好的。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=network%20of%20connected%20nodes%20with%20glowing%20lines%2C%20dark%20tech%20background&image_size=landscape_16_9',
    category: '后端开发',
    tags: ['Node.js', '微服务', '架构'],
    author: 'Mayekun',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    readTime: 10,
    views: 987
  },
  {
    id: '5',
    title: 'CSS Grid 完全指南',
    summary: '从基础到高级，全面掌握 CSS Grid 布局，打造响应式现代网页布局。',
    content: `
# CSS Grid 完全指南

CSS Grid 是现代网页布局的基石，它提供了强大的二维布局能力。

## 基础概念

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## 网格线与网格区域

\`\`\`css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
\`\`\`

## 响应式布局

\`\`\`css
.container {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## 实战案例

### 圣杯布局

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}
\`\`\`

## 总结

CSS Grid 让复杂布局变得简单，是每个前端开发者必须掌握的技能。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20layout%20grid%20design%20with%20colorful%20blocks%2C%20clean%20minimal%20style&image_size=landscape_16_9',
    category: '前端开发',
    tags: ['CSS', '布局', '前端'],
    author: 'Mayekun',
    createdAt: '2023-12-28',
    updatedAt: '2023-12-28',
    readTime: 6,
    views: 1567
  },
  {
    id: '6',
    title: 'Docker 容器化最佳实践',
    summary: '学习 Docker 容器化的核心概念和最佳实践，提升应用部署效率。',
    content: `
# Docker 容器化最佳实践

Docker 改变了我们构建、分发和运行应用程序的方式。

## Dockerfile 最佳实践

\`\`\`dockerfile
# 使用多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]
\`\`\`

## 镜像优化

1. 使用 Alpine 基础镜像
2. 合并 RUN 指令
3. 使用 .dockerignore
4. 利用构建缓存

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
\`\`\`

## 总结

容器化是现代 DevOps 的基础，掌握 Docker 是必备技能。
    `,
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=docker%20whale%20logo%20with%20containers%2C%20blue%20ocean%20background%2C%20modern%20tech%20style&image_size=landscape_16_9',
    category: 'DevOps',
    tags: ['Docker', '容器化', 'DevOps'],
    author: 'Mayekun',
    createdAt: '2023-12-20',
    updatedAt: '2023-12-21',
    readTime: 8,
    views: 2134
  }
]

export const works: Work[] = [
  {
    id: '1',
    title: 'Mayekun 个人博客',
    description: '基于 Vue 3 + TypeScript 构建的现代个人博客系统，支持文章发布、作品展示等功能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20blog%20website%20interface%20with%20purple%20gradient%2C%20clean%20design&image_size=landscape_16_9',
    images: [],
    category: '网站',
    tags: ['Vue', 'TypeScript', '博客'],
    link: 'https://mayekun.com',
    github: 'https://github.com/mayekun/blog',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: '任务管理应用',
    description: '功能完善的任务管理应用，支持看板视图、甘特图、团队协作等功能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kanban%20board%20app%20interface%20with%20colorful%20cards%2C%20modern%20UI%20design&image_size=landscape_16_9',
    images: [],
    category: '应用',
    tags: ['React', 'Node.js', '协作'],
    link: 'https://tasks.example.com',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    title: '数据可视化平台',
    description: '企业级数据可视化平台，支持多种图表类型、实时数据更新和自定义仪表盘。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20dashboard%20with%20charts%20and%20graphs%2C%20dark%20theme&image_size=landscape_16_9',
    images: [],
    category: '平台',
    tags: ['Vue', 'ECharts', '数据可视化'],
    link: 'https://data.example.com',
    createdAt: '2023-12-15'
  },
  {
    id: '4',
    title: '电商小程序',
    description: '功能完整的电商小程序，包含商品展示、购物车、订单管理等核心功能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20shopping%20app%20interface%20with%20products%2C%20modern%20design&image_size=landscape_16_9',
    images: [],
    category: '小程序',
    tags: ['微信小程序', '电商', '移动端'],
    link: '',
    createdAt: '2023-11-20'
  },
  {
    id: '5',
    title: '在线协作白板',
    description: '实时协作的在线白板工具，支持多人同时编辑、图形绘制、思维导图等功能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20whiteboard%20with%20drawings%20and%20sticky%20notes%2C%20collaborative%20workspace&image_size=landscape_16_9',
    images: [],
    category: '工具',
    tags: ['Canvas', 'WebSocket', '协作'],
    link: 'https://board.example.com',
    github: 'https://github.com/mayekun/whiteboard',
    createdAt: '2023-10-10'
  },
  {
    id: '6',
    title: 'API 文档生成器',
    description: '自动从代码注释生成 API 文档的工具，支持多种编程语言和文档格式。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=API%20documentation%20page%20with%20code%20examples%2C%20developer%20tools%20style&image_size=landscape_16_9',
    images: [],
    category: '工具',
    tags: ['Node.js', '文档', '开源'],
    link: 'https://apidoc.example.com',
    github: 'https://github.com/mayekun/apidoc',
    createdAt: '2023-09-01'
  }
]

export const profile: Profile = {
  name: 'oaken',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20creative%20developer%2C%20modern%20minimal%20style&image_size=square',
  bio: '全栈开发者，热爱技术与设计。专注于构建优雅、高性能的 Web 应用，致力于用代码创造价值。',
  title: '全栈开发者 / 技术博主',
  location: '中国·玉林',
  email: '2532615203@qq.com',
  social: {
    github: 'https://github.com/mayekun',
    twitter: 'https://twitter.com/mayekun',
    linkedin: 'https://linkedin.com/in/mayekun',
    weibo: 'https://weibo.com/mayekun'
  },
  skills: [
    { name: 'Vue.js', level: 95, category: '前端框架' },
    { name: 'React', level: 90, category: '前端框架' },
    { name: 'TypeScript', level: 92, category: '编程语言' },
    { name: 'Node.js', level: 88, category: '后端技术' },
    { name: 'Python', level: 75, category: '编程语言' },
    { name: 'Docker', level: 80, category: 'DevOps' },
    { name: 'PostgreSQL', level: 82, category: '数据库' },
    { name: 'UI/UX 设计', level: 78, category: '设计' }
  ]
}

export const categories: Category[] = [
  { id: '1', name: '全部', count: articles.length },
  { id: '2', name: '前端开发', count: articles.filter(a => a.category === '前端开发').length },
  { id: '3', name: '后端开发', count: articles.filter(a => a.category === '后端开发').length },
  { id: '4', name: 'DevOps', count: articles.filter(a => a.category === 'DevOps').length }
]
