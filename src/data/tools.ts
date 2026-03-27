export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  path: string
  color: string
  category: string
}

export const tools: Tool[] = [
  {
    id: 'screenshot-frame',
    name: '截图加壳',
    description: '为截图添加精美的手机壳效果，展示更专业',
    icon: '📱',
    path: '/screenshot-frame',
    color: '#7C3AED',
    category: '图片工具',
  },
  {
    id: 'coming-soon-1',
    name: '图片压缩',
    description: '智能压缩图片，保持高质量同时减小文件体积',
    icon: '🖼️',
    path: '/',
    color: '#F472B6',
    category: '图片工具',
  },
  {
    id: 'coming-soon-2',
    name: '格式转换',
    description: '支持多种图片格式互相转换，操作简单便捷',
    icon: '🔄',
    path: '/',
    color: '#38BDF8',
    category: '格式工具',
  },
  {
    id: 'coming-soon-3',
    name: '颜色提取',
    description: '从图片中智能提取主色调，生成配色方案',
    icon: '🎨',
    path: '/',
    color: '#34D399',
    category: '设计工具',
  },
]
