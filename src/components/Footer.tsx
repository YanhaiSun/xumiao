import { Sparkles, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', textAlign: 'center' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={14} color="#7C3AED" />
          <span style={{ fontFamily: 'miaoziguozhiti, Quicksand, sans-serif', fontWeight: 600, fontSize: '14px', color: '#7C3AED' }}>
            菜菜工具箱
          </span>
          <Sparkles size={14} color="#7C3AED" />
        </div>
        <p style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          Made with <Heart size={12} color="#F472B6" fill="#F472B6" /> by 菜菜
        </p>
      </div>
    </footer>
  )
}
