<<<<<<< HEAD
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Zap, LogOut, User, Shield, Plus, ChevronDown, Scale, Newspaper, DollarSign } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/city-guide', label: 'City Guide' },
];

const moreLinks = [
  { href: '/investors', label: 'Investors', icon: DollarSign },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/news', label: 'News & Events', icon: Newspaper },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isMoreActive = moreLinks.some(l => pathname === l.href);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">StartupHyd</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                pathname === l.href
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isMoreActive
                  ? 'text-white bg-white/10 border border-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-full right-0 mt-2 w-52 glass-strong rounded-xl border border-white/10 shadow-2xl p-2"
                >
                  {moreLinks.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        pathname === l.href
                          ? 'text-white bg-violet-500/15'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <l.icon className="w-4 h-4" />
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Submit Startup Button */}
              <Link href="/submit-startup"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === '/submit-startup'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    : 'text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/10'
                }`}>
                <Plus className="w-3.5 h-3.5" /> Submit
              </Link>

              {/* Admin Button */}
              {isAdmin && (
                <Link href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    pathname === '/admin'
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                      : 'text-violet-400/70 hover:text-violet-300 hover:bg-violet-500/10'
                  }`}>
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Link>
              )}

              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.displayName || user.email}</span>
              </Link>
              <button onClick={logout} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">Log in</Link>
              <Link href="/signup" className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white/70 hover:text-white">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-6 py-4 space-y-1">
              {[...links, ...moreLinks.map(l => ({ href: l.href, label: l.label }))].map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className={`block px-4 py-3 rounded-lg text-sm transition-all ${pathname === l.href ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link href="/submit-startup" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-emerald-400/80 hover:bg-emerald-500/10">
                    <Plus className="w-4 h-4" /> Submit Startup
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-violet-400/80 hover:bg-violet-500/10">
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </>
              )}
              <div className="pt-3 border-t border-white/5 space-y-1">
                {user ? (
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5">Log out</button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-white/60">Log in</Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-center bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:f88840de4d84b5deb17f7d77e618bbcf65b1eaa9d2d79166109b33efe8bebf9d
size 10051
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
