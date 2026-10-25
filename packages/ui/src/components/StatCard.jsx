// junospace/packages/ui/src/components/StatCard.jsx
import React from 'react'
import { SkeletonBlock } from './SkeletonBlock'

export function StatCard({ 
  label, 
  value, 
  subtext, 
  icon: Icon, 
  borderColor = 'border-slate-100', 
  iconBg = 'bg-slate-50', 
  iconColor = 'text-slate-500', 
  badge, 
  loading,
  className = '' 
}) {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-5 border-4 border-slate-100 flex flex-col justify-between gap-3 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <SkeletonBlock width="36px" height="36px" rounded="rounded-full" />
          <SkeletonBlock width="80px" height="20px" rounded="rounded-full" />
        </div>
        <div>
          <SkeletonBlock width="60px" height="32px" rounded="rounded-lg" className="mb-2" />
          <SkeletonBlock width="100px" height="12px" rounded="rounded-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl p-5 border-4 ${borderColor} flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
            <Icon size={20} />
          </div>
        )}
        {badge && (
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${badge.cls || badge.className || 'bg-slate-100 text-slate-500'}`}>
            {badge.label || badge.text || badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{value}</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5">{label}</p>
        {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  )
}
