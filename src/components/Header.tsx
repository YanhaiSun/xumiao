import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X, Home, Smartphone } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/screenshot-frame', label: '截图加壳', icon: Smartphone },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED, #F472B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}
            >
              <Sparkles size={20} color="white" />
            </motion.div>
            <span style={{ fontFamily: 'miaoziguozhiti, Quicksand, sans-serif', fontWeight: 700, fontSize: '18px', color: '#7C3AED' }}>
              菜菜工具箱
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'none', gap: '8px' }} className="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      background: isActive ? 'rgba(124,58,237,0.9)' : 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: isActive ? 'white' : '#4B5563',
                      fontSize: '14px',
                      fontWeight: 500,
                      boxShadow: isActive ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '8px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} color="#7C3AED" /> : <Menu size={24} color="#7C3AED" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Glass effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.3)', overflow: 'hidden' }}
            className="mobile-nav"
          >
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: isActive ? '#7C3AED' : 'transparent',
                        color: isActive ? 'white' : '#4B5563',
                        fontSize: '15px',
                        fontWeight: 500
                      }}
                    >
                      <Icon size={20} />
                      {item.label}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </header>
  )
}
