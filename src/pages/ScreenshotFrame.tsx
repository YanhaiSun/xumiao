import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Download, RefreshCw, Trash2, Check } from 'lucide-react'
import { decode } from 'heic-decode'

interface FrameOption {
  id: string
  name: string
  emoji: string
  isPhone: boolean
  frameColor: string
  frameImage?: string
}

const frameOptions: FrameOption[] = [
  {
    id: 'phone',
    name: '手机',
    emoji: '📱',
    isPhone: true,
    frameColor: '#1F2937',
    frameImage: '/frames/iphone-frame.png'
  },
  {
    id: 'desktop',
    name: '电脑',
    emoji: '💻',
    isPhone: false,
    frameColor: '#374151',
    frameImage: '/frames/macbook-frame.png'
  }
]

export default function ScreenshotFrame() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(frameOptions[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImageFile = async (file: File): Promise<string> => {
    // Check if it's HEIC format
    const isHeic = file.type === 'image/heic' ||
                   file.type === 'image/heif' ||
                   file.name.toLowerCase().endsWith('.heic') ||
                   file.name.toLowerCase().endsWith('.heif')

    if (isHeic) {
      try {
        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer()

        // Decode HEIC using heic-decode
        const { width, height, data } = await decode({ buffer: arrayBuffer })

        // Create canvas and draw the decoded image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!

        // Create ImageData from the decoded data
        const imageData = new ImageData(data, width, height)
        ctx.putImageData(imageData, 0, 0)

        // Return as data URL (JPEG format)
        return canvas.toDataURL('image/jpeg', 0.92)
      } catch (err) {
        console.error('HEIC decode error:', err)
        throw new Error('无法解码HEIC图片')
      }
    }

    // For regular images, use FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    try {
      const dataUrl = await processImageFile(file)
      setScreenshot(dataUrl)
      setGeneratedImage(null)
    } catch (err) {
      console.error('Error processing image:', err)
      alert('图片处理失败，请尝试其他图片')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleClear = useCallback(() => {
    setScreenshot(null)
    setGeneratedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!screenshot) return
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 600))

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load frame image first to get dimensions
    const frameImg = new Image()
    frameImg.crossOrigin = 'anonymous'
    frameImg.src = selectedFrame.frameImage!

    frameImg.onload = () => {
      canvas.width = frameImg.width
      canvas.height = frameImg.height

      // Load screenshot
      const screenshotImg = new Image()
      screenshotImg.crossOrigin = 'anonymous'
      screenshotImg.src = screenshot

      screenshotImg.onload = () => {
        // Calculate screenshot position based on device type
        let screenX, screenY, screenW, screenH

        if (selectedFrame.id === 'phone') {
          // iPhone frame screen area
          screenX = canvas.width * 0.07
          screenY = canvas.height * 0.055
          screenW = canvas.width * 0.86
          screenH = canvas.height * 0.89
        } else {
          // MacBook screen area - adjusted to fill borders more
          screenX = canvas.width * 0.089
          screenY = canvas.height * 0.02
          screenW = canvas.width * 0.815
          screenH = canvas.height * 0.855
        }

        const imgAspect = screenshotImg.width / screenshotImg.height
        const screenAspect = screenW / screenH

        let drawWidth, drawHeight, drawX, drawY

        if (imgAspect > screenAspect) {
          drawWidth = screenW
          drawHeight = screenW / imgAspect
          drawX = screenX
          drawY = screenY + (screenH - drawHeight) / 2
        } else {
          drawHeight = screenH
          drawWidth = screenH * imgAspect
          drawX = screenX + (screenW - drawWidth) / 2
          drawY = screenY
        }

        // Step 1: Draw screenshot first
        ctx.save()
        roundRect(ctx, drawX, drawY, drawWidth, drawHeight, 6)
        ctx.clip()
        ctx.drawImage(screenshotImg, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()

        // Step 2: Draw frame on TOP (after screenshot)
        ctx.drawImage(frameImg, 0, 0)

        const result = canvas.toDataURL('image/png')
        setGeneratedImage(result)
        setIsLoading(false)
      }

      screenshotImg.onerror = () => {
        // Still draw frame even if screenshot fails
        ctx.drawImage(frameImg, 0, 0)
        setGeneratedImage(canvas.toDataURL('image/png'))
        setIsLoading(false)
      }
    }

    frameImg.onerror = () => {
      setIsLoading(false)
      alert('加载边框图片失败')
    }
  }, [screenshot, selectedFrame])

  const handleDownload = useCallback(() => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = `screenshot-framed-${Date.now()}.png`
    link.href = generatedImage
    link.click()
  }, [generatedImage])

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '32px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
            <span style={{ background: 'linear-gradient(135deg, #7C3AED, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              截图加壳工具
            </span>
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            上传截图，选择设备类型，一键生成精美展示图
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="#7C3AED" />
              上传截图
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            <AnimatePresence mode="wait">
              {!screenshot ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? '#7C3AED' : '#E5E7EB'}`,
                    borderRadius: '16px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isDragging ? 'rgba(124,58,237,0.05)' : 'transparent'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📤</div>
                  <p style={{ color: '#4B5563', fontWeight: 500, marginBottom: '4px' }}>拖拽图片到这里，或点击上传</p>
                  <p style={{ fontSize: '13px', color: '#9CA3AF' }}>支持 PNG、JPG、WebP、HEIC 格式</p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ position: 'relative' }}
                >
                  <img
                    src={screenshot}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', background: '#F9FAFB' }}
                  />
                  <button
                    onClick={handleClear}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '8px',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Frame Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📱</span>
              选择设备类型
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {frameOptions.map((option) => {
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFrame(option)}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      border: `2px solid ${selectedFrame.id === option.id ? '#7C3AED' : '#F3F4F6'}`,
                      background: selectedFrame.id === option.id ? 'rgba(124,58,237,0.05)' : 'white',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '36px' }}>{option.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#1F2937' }}>{option.name}</span>
                    </div>
                    {selectedFrame.id === option.id && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        background: '#7C3AED',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} color="white" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: screenshot && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: screenshot && !isLoading ? 0.98 : 1 }}
            onClick={handleGenerate}
            disabled={!screenshot || isLoading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: screenshot && !isLoading ? 'pointer' : 'not-allowed',
              background: screenshot && !isLoading
                ? 'linear-gradient(135deg, #7C3AED, #F472B6)'
                : '#E5E7EB',
              color: screenshot && !isLoading ? 'white' : '#9CA3AF',
              boxShadow: screenshot && !isLoading ? '0 4px 15px rgba(124,58,237,0.3)' : 'none'
            }}
          >
            {isLoading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <RefreshCw size={18} />
                </motion.div>
                生成中...
              </>
            ) : (
              <>
                <span style={{ fontSize: '18px' }}>✨</span>
                生成加壳图片
              </>
            )}
          </motion.button>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>👀</span>
              预览效果
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px', background: '#F9FAFB', borderRadius: '16px', padding: '20px' }}>
              <AnimatePresence mode="wait">
                {generatedImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center' }}
                  >
                    <img
                      src={generatedImage}
                      alt="Result"
                      style={{ maxHeight: '450px', maxWidth: '100%', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      style={{
                        marginTop: '20px',
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #7C3AED, #F472B6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(124,58,237,0.3)'
                      }}
                    >
                      <Download size={16} />
                      下载图片
                    </motion.button>
                  </motion.div>
                ) : screenshot ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', color: '#6B7280' }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                    <p style={{ fontSize: '14px' }}>点击上方"生成加壳图片"按钮</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', color: '#6B7280' }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>👆</div>
                    <p style={{ fontSize: '14px' }}>上传截图后即可预览</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
