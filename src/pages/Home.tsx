import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import ToolCard from '../components/ToolCard'
import { tools } from '../data/tools'

interface DailyQuote {
  content: string
  author: string
  date: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [quote, setQuote] = useState<DailyQuote | null>(null)

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    fetch('http://v3.wufazhuce.com:8000/api/channel/one/0/0')
      .then(res => res.json())
      .then(data => {
        if (data.data?.content_list?.[0]) {
          const item = data.data.content_list[0]
          setQuote({
            content: item.forward || item.content || '',
            author: item.text_author_info?.text_author_name || item.author?.user_name || '',
            date: data.data.date || ''
          })
        }
      })
      .catch(err => console.log('Failed to fetch quote:', err))
  }, [])

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      {/* Full page Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(124,58,237,0.12)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-100px', width: '350px', height: '350px', background: 'rgba(244,114,182,0.12)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '300px', height: '300px', background: 'rgba(56,189,248,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      {/* Hero Section - Daily Quote Irregular Sticky Note */}
      <section style={{ position: 'relative', padding: '48px 16px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {quote ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'relative',
                padding: '60px 90px',
                background: 'url(/quote-bg.png) center/cover no-repeat',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              {/* Quote content */}
              <div style={{ position: 'relative', zIndex: 1, paddingTop: '50px' }}>
                <p style={{
                  fontFamily: 'miaoziguozhiti, sans-serif',
                  fontSize: '18px',
                  lineHeight: 2.2,
                  color: '#2D3748',
                  marginBottom: '20px',
                  textAlign: 'left',
                  textIndent: '2em'
                }}>
                  {quote.content}
                </p>
                {quote.author && (
                  <p style={{
                    fontSize: '13px',
                    color: '#718096',
                    textAlign: 'right',
                    fontFamily: 'miaoziguozhiti, sans-serif'
                  }}>
                    — {quote.author}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '60px 90px',
                background: 'url(/quote-bg.png) center/cover no-repeat',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              <div style={{ paddingTop: '50px', textAlign: 'center', fontFamily: 'miaoziguozhiti, sans-serif', color: '#2D3748' }}>
                加载中...
              </div>
            </motion.div>
          )}

          {/* Search Bar - Glass effect */}
          <div style={{ maxWidth: '480px', margin: '32px auto 0', position: 'relative' }}>
            <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }} />
            <input
              type="text"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 30px rgba(124,58,237,0.1)',
                color: '#1F2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(124,58,237,0.3)'
                e.target.style.background = 'rgba(255,255,255,0.85)'
                e.target.style.boxShadow = '0 8px 40px rgba(124,58,237,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                e.target.style.background = 'rgba(255,255,255,0.7)'
                e.target.style.boxShadow = '0 4px 30px rgba(124,58,237,0.1)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Tools Grid Section - Glass effect container */}
      <section style={{ padding: '24px 16px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(124,58,237,0.08)' }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '32px', height: '4px', background: 'linear-gradient(90deg, #7C3AED, #F472B6)', borderRadius: '2px' }}></span>
            工具列表
          </h2>

          {filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 20px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: '#6B7280', fontSize: '16px' }}>没有找到相关工具</p>
              <button
                onClick={() => setSearchQuery('')}
                style={{ marginTop: '16px', color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                清除搜索
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {filteredTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
