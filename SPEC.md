# 徐苗工具箱 - 项目规范

## 1. Concept & Vision

一个可爱、精致、充满活力的工具集合网页。整体设计风格偏向甜美清新，带有柔和的渐变色、圆润的卡片和流畅的微交互。首页像一个精美的工具展示柜，每个工具都是一颗闪耀的宝石。

## 2. Design Language

### 色彩系统
```css
--primary: #7C3AED;        /* 紫色 - 主色调 */
--primary-light: #A78BFA;  /* 浅紫 */
--secondary: #F472B6;       /* 粉色 - 强调色 */
--accent: #38BDF8;          /* 天蓝 - 辅助色 */
--success: #34D399;         /* 翠绿 */
--warning: #FBBF24;         /* 暖黄 */
--background: #FAFBFF;      /* 米白背景 */
--card-bg: #FFFFFF;         /* 卡片白 */
--text-primary: #1F2937;    /* 深灰文字 */
--text-secondary: #6B7280;  /* 浅灰文字 */
```

### 字体
- 标题: "Quicksand", "PingFang SC", sans-serif (圆润可爱)
- 正文: "Inter", "Noto Sans SC", sans-serif

### 动效哲学
- 入场动画: 卡片依次浮入，带有轻微弹性
- 悬停动画: 卡片轻微上浮 + 阴影扩散 + 边框发光
- 3D效果: 卡片可带有CSS 3D transform效果
- 页面切换: 淡入淡出 + 轻微位移

## 3. Layout & Structure

### 目录结构
```
src/
├── components/          # 公共组件
│   ├── Header/          # 顶部导航
│   ├── Footer/          # 底部
│   ├── ToolCard/        # 工具卡片
│   └── SearchBar/       # 搜索栏
├── pages/
│   ├── Home/            # 首页-工具列表
│   └── ScreenshotFrame/  # 截图加壳工具
├── styles/
│   └── globals.css      # 全局样式
├── App.tsx
└── main.tsx
```

### 页面
1. **首页** - 工具集合展示，带搜索和分类
2. **截图加壳工具** - 上传截图，选择手机壳模板，预览下载

## 4. Features & Interactions

### 首页
- 工具卡片网格展示 (响应式: 1/2/3/4列)
- 搜索框实时过滤工具
- 卡片悬停3D倾斜效果
- 点击进入对应工具页面

### 截图加壳工具
- 拖拽/点击上传截图
- 选择手机壳类型 (iPhone/Android多款)
- 实时预览加壳效果
- 下载最终图片

## 5. Component Inventory

### ToolCard
- 默认: 白色卡片，圆角16px，柔和阴影
- 悬停: 上浮8px，阴影加深，边框发光，图标轻微放大
- 3D倾斜: 随鼠标位置轻微3D旋转

### SearchBar
- 圆角输入框，带搜索图标
- 聚焦时边框变紫色，轻微放大

### Header
- Logo + 标题
- 移动端: 汉堡菜单
- 桌面端: 横向导航

## 6. Technical Approach

- **框架**: React 18 + TypeScript + Vite
- **动画**: Framer Motion (React官方动画库，支持3D)
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **3D效果**: CSS transform + Framer Motion
