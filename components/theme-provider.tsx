<<<<<<< HEAD
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
=======
version https://git-lfs.github.com/spec/v1
oid sha256:cdf5c70632a61794d02e3080f9084805934e938f2468a6b489dfc80fb1762ca8
size 333
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
