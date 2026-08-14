'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid hydration mismatch

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    return <Laptop className="h-5 w-5" />;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full glass-modern border-none hover:bg-white/10 dark:hover:bg-white/5"
      aria-label="Toggle theme"
    >
      {getIcon()}
    </Button>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import { Moon, Sun } from 'lucide-react';

// export function ThemeToggle() {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();

//   // useEffect only runs on the client, so now we can safely show the UI
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     // Render a placeholder button with same dimensions to avoid layout shift
//     return (
//       <Button variant="outline" size="icon" className="glass border-white/20 dark:border-slate-700/30">
//         <Sun className="h-[1.2rem] w-[1.2rem]" />
//       </Button>
//     );
//   }

//   return (
//     <Button
//       variant="outline"
//       size="icon"
//       className="glass border-white/20 dark:border-slate-700/30"
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//     >
//       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }