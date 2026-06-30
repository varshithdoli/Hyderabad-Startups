'use client';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface VerificationBadgeProps {
  verified?: boolean;
  level?: 'basic' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const config = {
  basic: {
    icon: Shield,
    color: 'text-white/40',
    bg: 'bg-white/5 border-white/10',
    label: 'Basic',
    tooltip: 'Website verified',
  },
  medium: {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'Verified',
    tooltip: 'Website + LinkedIn verified',
  },
  high: {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    label: 'Fully Verified',
    tooltip: 'Documents verified',
  },
};

const sizes = {
  sm: { icon: 'w-3 h-3', text: 'text-[9px]', pad: 'px-1.5 py-0.5 gap-0.5' },
  md: { icon: 'w-3.5 h-3.5', text: 'text-[10px]', pad: 'px-2 py-1 gap-1' },
  lg: { icon: 'w-4 h-4', text: 'text-xs', pad: 'px-2.5 py-1 gap-1.5' },
};

export default function VerificationBadge({ verified, level, size = 'sm', showLabel = true }: VerificationBadgeProps) {
  if (!verified) return null;

  const lv = level || 'basic';
  const c = config[lv];
  const s = sizes[size];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${c.bg} ${c.color} ${s.pad} ${s.text}`}
      title={c.tooltip}
    >
      <Icon className={s.icon} />
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}
