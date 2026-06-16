'use client'

import { useRef } from 'react'
import './SpotlightCard.css'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(19,19,186,0.07)' }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = divRef.current!.getBoundingClientRect()
    divRef.current!.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    divRef.current!.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    divRef.current!.style.setProperty('--spotlight-color', spotlightColor)
  }

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  )
}

export default SpotlightCard
