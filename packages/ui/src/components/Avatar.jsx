// junospace/packages/ui/src/components/Avatar.jsx
import React from 'react'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase()
}

function stringToColor(str) {
  if (!str) return '#6C35DE'
  const palette = [
    '#6C35DE', '#0EA5E9', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

export function Avatar({ name, imageUrl, size = 'md', className = '' }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl"
  }
  
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name || 'Avatar'} 
        className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
      />
    )
  }
  
  const bg = stringToColor(name)
  const initials = getInitials(name)
  
  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-black border-2 border-white shadow-sm ${className}`}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {initials}
    </div>
  )
}
