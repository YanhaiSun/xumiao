import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Tool } from '../data/tools'

interface ToolCardProps {
  tool: Tool
  index: number
}

export default function ToolCard({ tool, index }: ToolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const isComingSoon = tool.path === '/'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={tool.path} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: 'relative',
            padding: '24px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${isHovered ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.5)'}`,
            transition: 'all 0.3s',
            boxShadow: isHovered
              ? '0 12px 40px rgba(124,58,237,0.18)'
              : '0 4px 20px rgba(124,58,237,0.06)',
            opacity: isComingSoon ? 0.7 : 1,
            transform: 'translateZ(20px)'
          }}
        >
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '16px',
              background: `linear-gradient(135deg, ${tool.color}15, ${tool.color}30)`,
              position: 'relative'
            }}
          >
            {tool.icon}
            {isComingSoon && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '2px 8px', fontSize: '10px', background: '#6B7280', color: 'white', borderRadius: '10px', fontWeight: 500 }}>
                待上线
              </span>
            )}
          </motion.div>

          {/* Content */}
          <div>
            <h3 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '6px', color: '#1F2937' }}>
              {tool.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '12px' }}>
              {tool.description}
            </p>

            {/* Category tag */}
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              fontSize: '11px',
              borderRadius: '8px',
              background: `${tool.color}15`,
              color: tool.color,
              fontWeight: 500
            }}>
              {tool.category}
            </span>
          </div>

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.2s'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tool.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
