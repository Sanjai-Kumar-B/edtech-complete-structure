// junospace/packages/ui/src/components/Badge.jsx
import React from 'react'

export function Badge({ label, variant = 'purple', className = '' }) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border border-amber-200',
    danger:  'bg-red-50 text-red-600 border border-red-200',
    info:    'bg-blue-50 text-blue-600 border border-blue-200',
    purple:  'bg-[#6C35DE]/10 text-[#6C35DE] border border-[#6C35DE]/20',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {label}
    </span>
  )
}
