'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scene, setScene] = useState(0)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Rain drops
    const raindrops: { x: number; y: number; speed: number; length: number }[] = []
    for (let i = 0; i < 200; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        length: Math.random() * 20 + 10
      })
    }

    // Animation timeline
    const timeline = [
      { time: 0, scene: 0 }, // Kitten alone
      { time: 3000, scene: 1 }, // Mother approaching
      { time: 6000, scene: 2 }, // Mother protecting
      { time: 9000, scene: 3 }, // Warmth and comfort
    ]

    let startTime = Date.now()
    let currentScene = 0

    function drawKitten(x: number, y: number, scale: number, wet: boolean) {
      if (!ctx) return

      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // Body (wet or dry)
      ctx.fillStyle = wet ? '#4a5568' : '#718096'
      ctx.beginPath()
      ctx.ellipse(0, 0, 30, 25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.fillStyle = wet ? '#4a5568' : '#718096'
      ctx.beginPath()
      ctx.arc(-15, -20, 20, 0, Math.PI * 2)
      ctx.fill()

      // Ears
      ctx.fillStyle = wet ? '#3a4558' : '#5a6878'
      ctx.beginPath()
      ctx.moveTo(-25, -30)
      ctx.lineTo(-20, -40)
      ctx.lineTo(-15, -30)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(-15, -30)
      ctx.lineTo(-10, -40)
      ctx.lineTo(-5, -30)
      ctx.fill()

      // Eyes (sad or comforted)
      ctx.fillStyle = '#2d3748'
      ctx.beginPath()
      ctx.arc(-20, -22, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(-10, -22, 3, 0, Math.PI * 2)
      ctx.fill()

      // Shivering effect when wet
      if (wet) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(0, 0, 35 + i * 5, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    function drawMotherCat(x: number, y: number, scale: number, protective: boolean) {
      if (!ctx) return

      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // Warm glow around mother
      if (protective) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100)
        gradient.addColorStop(0, 'rgba(255, 200, 150, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 200, 150, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      // Body
      ctx.fillStyle = '#8b7355'
      ctx.beginPath()
      ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.fillStyle = '#8b7355'
      ctx.beginPath()
      ctx.arc(-25, -30, 30, 0, Math.PI * 2)
      ctx.fill()

      // Ears
      ctx.fillStyle = '#6b5545'
      ctx.beginPath()
      ctx.moveTo(-40, -45)
      ctx.lineTo(-32, -60)
      ctx.lineTo(-25, -45)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(-25, -45)
      ctx.lineTo(-18, -60)
      ctx.lineTo(-10, -45)
      ctx.fill()

      // Eyes (loving expression)
      ctx.fillStyle = '#2d3748'
      ctx.beginPath()
      ctx.arc(-32, -32, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(-18, -32, 4, 0, Math.PI * 2)
      ctx.fill()

      // Gentle smile
      ctx.strokeStyle = '#2d3748'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(-25, -25, 8, 0.2, Math.PI - 0.2)
      ctx.stroke()

      ctx.restore()
    }

    function animate() {
      if (!ctx || !canvas) return

      const elapsed = Date.now() - startTime

      // Update scene
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (elapsed >= timeline[i].time) {
          if (currentScene !== timeline[i].scene) {
            currentScene = timeline[i].scene
            setScene(currentScene)
          }
          break
        }
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(20, 30, 48, 0.95)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rain
      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)'
      ctx.lineWidth = 1
      raindrops.forEach(drop => {
        ctx!.beginPath()
        ctx!.moveTo(drop.x, drop.y)
        ctx!.lineTo(drop.x, drop.y + drop.length)
        ctx!.stroke()

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Scene transitions
      switch (currentScene) {
        case 0: // Kitten alone
          drawKitten(centerX, centerY, 1.5, true)
          break

        case 1: // Mother approaching
          drawKitten(centerX + 30, centerY + 20, 1.3, true)
          drawMotherCat(centerX - 80, centerY - 20, 0.8, false)
          break

        case 2: // Mother protecting
          drawKitten(centerX + 20, centerY + 30, 1.2, true)
          drawMotherCat(centerX, centerY, 1.2, true)
          break

        case 3: // Warmth and comfort
          drawKitten(centerX + 15, centerY + 25, 1.1, false)
          drawMotherCat(centerX, centerY, 1.3, true)

          // Reduce rain intensity
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.2)'
          break
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Show text overlays
    const textTimer = setInterval(() => {
      setShowText(true)
      setTimeout(() => setShowText(false), 2000)
    }, 4000)

    return () => {
      clearInterval(textTimer)
    }
  }, [])

  const sceneTexts = [
    "Di bawah hujan deras...",
    "Sang induk menghampiri...",
    "Melindungi dengan kasih sayang...",
    "Kehangatan di tengah badai..."
  ]

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {showText && (
        <div className={styles.textOverlay}>
          <p className={styles.sceneText}>{sceneTexts[scene]}</p>
        </div>
      )}
      <div className={styles.title}>
        <h1>Kasih Sayang Sang Ibu</h1>
        <p>A Mother's Love</p>
      </div>
    </main>
  )
}
