'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Globe, Link as LinkIcon, Code2, Mail, Heart, ExternalLink } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Explore Startups', href: '/explore' },
    { label: 'Job Board', href: '/jobs' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'City Guide', href: '/city-guide' },
  ],
  Community: [
    { label: 'Submit Startup', href: '/submit-startup' },
    { label: 'Investors', href: '/investors' },
    { label: 'News & Events', href: '/news' },
    { label: 'Compare', href: '/compare' },
  ],
  Resources: [
    { label: 'T-Hub', href: 'https://t-hub.co', external: true },
    { label: 'TASK', href: 'https://task.telangana.gov.in', external: true },
    { label: 'WE Hub', href: 'https://wehub.telangana.gov.in', external: true },
    { label: 'RICH', href: 'https://rich.telangana.gov.in', external: true },
  ],
};

const stats = [
  { value: '9,000+', label: 'Startups' },
  { value: '₹5.8B+', label: 'Funding' },
  { value: '67+', label: 'Unicorns & Soonicorns' },
  { value: '#1', label: 'Liveable City' },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      <div className="absolute inset-0 gradient-mesh opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-6 rounded-2xl glass-card">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-gradient">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                StartupHyd
              </span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">
              The definitive intelligence platform for Hyderabad&apos;s thriving startup ecosystem.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: Globe, href: 'https://twitter.com', label: 'Twitter' },
                { icon: LinkIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Code2, href: 'https://github.com', label: 'GitHub' },
                { icon: Mail, href: 'mailto:hello@startuphyd.com', label: 'Email' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/30 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/30 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} StartupHyd. Built with{' '}
            <Heart className="w-3 h-3 inline text-red-400/50" /> in Hyderabad.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
