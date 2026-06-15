export interface Article {
  id: string
  title: string
  summary: string
  content: string
  cover: string
  category: string
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  readTime: number
  views: number
}

export interface Work {
  id: string
  title: string
  description: string
  cover: string
  images: string[]
  category: string
  tags: string[]
  link: string
  github?: string
  createdAt: string
}

export interface Profile {
  name: string
  avatar: string
  bio: string
  title: string
  location: string
  email: string
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    weibo?: string
  }
  skills: {
    name: string
    icon: string
    url?: string
  }[]
}

export interface Category {
  id: string
  name: string
  count: number
}
