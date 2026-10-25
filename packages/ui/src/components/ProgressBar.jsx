// junospace/packages/ui/src/components/ProgressBar.jsx
import React from 'react'

export function ProgressBar({ value = 0, color = '#6C35DE', height = '6px', showLabel = false, className = '' }) {
  const safeValue = Math.min(Math.max(value, 0), 100)
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
          <span className="text-xs font-black" style={{ color }}>{safeValue}%</span>
        </div>
      )}
      <div 
        className="w-full bg-slate-100 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${safeValue}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
