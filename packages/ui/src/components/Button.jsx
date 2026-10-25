// junospace/packages/ui/src/components/Button.jsx
import React from 'react'
import { Loader2 } from 'lucide-react'

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled, 
  loading,
  className = '',
  ...props
}) {
  const base = "inline-flex items-center justify-center font-bold transition-all duration-150 active:scale-95 disabled:opacity-70 disabled:pointer-events-none rounded-xl"
  
  const variants = {
    primary: "bg-[#6C35DE] text-white hover:bg-[#5929C4] shadow-lg shadow-[#6C35DE]/20",
    outline: "border-2 border-[#6C35DE] text-[#6C35DE] hover:bg-[#6C35DE]/5",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin mr-2" />}
      {children}
    </button>
  )
}
