// junospace/packages/ui/src/components/SkeletonBlock.jsx
import React from 'react'

export function SkeletonBlock({ width, height, rounded = 'rounded-xl', className = '' }) {
  const style = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div 
      className={`bg-slate-200 animate-pulse ${rounded} ${className}`}
      style={style}
    />
  )
}
