<<<<<<< HEAD
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const ADMIN_EMAIL = 'varshithd22@gmail.com';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  savedStartups: string[];
  toggleSaveStartup: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedStartups, setSavedStartups] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setIsAdmin(u.email === ADMIN_EMAIL);
        try {
          const d = await getDoc(doc(db, 'users', u.uid));
          if (d.exists()) {
            setSavedStartups(d.data().savedStartups || []);
            if (u.email === ADMIN_EMAIL && d.data().role !== 'admin') {
              await setDoc(doc(db, 'users', u.uid), { role: 'admin' }, { merge: true });
            }
          }
        } catch (e) {
          console.warn('Could not fetch user data:', e);
        }
      } else {
        setSavedStartups([]);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const r = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(r.user, { displayName: name });
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    await setDoc(doc(db, 'users', r.user.uid), {
      uid: r.user.uid, name, email, role, savedStartups: [],
      createdAt: new Date().toISOString()
    });
  };

  const loginWithGoogle = async () => {
    const r = await signInWithPopup(auth, new GoogleAuthProvider());
    const d = await getDoc(doc(db, 'users', r.user.uid));
    if (!d.exists()) {
      const role = r.user.email === ADMIN_EMAIL ? 'admin' : 'user';
      await setDoc(doc(db, 'users', r.user.uid), {
        uid: r.user.uid, name: r.user.displayName, email: r.user.email,
        role, savedStartups: [], createdAt: new Date().toISOString()
      });
    }
  };

  const logout = async () => { await signOut(auth); };

  const toggleSaveStartup = async (id: string) => {
    if (!user) return;
    const ns = savedStartups.includes(id) ? savedStartups.filter(s => s !== id) : [...savedStartups, id];
    setSavedStartups(ns);
    await setDoc(doc(db, 'users', user.uid), { savedStartups: ns }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, loginWithGoogle, logout, savedStartups, toggleSaveStartup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
=======
version https://git-lfs.github.com/spec/v1
oid sha256:a97d0f17eb99054f2bd70b340d66fb230807b425a20db95d35cb59ceece609ed
size 3542
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
