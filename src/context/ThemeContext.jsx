import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [sweeping, setSweeping] = useState(false);
  const [sweepDirection, setSweepDirection] = useState('to-light'); // 'to-light' | 'to-dark'
  const timerRef = useRef(null);

  const toggleTheme = useCallback(() => {
    if (sweeping) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    setSweepDirection(next === 'light' ? 'to-light' : 'to-dark');
    setSweeping(true);

    // At halfway through sweep, actually flip the theme
    timerRef.current = setTimeout(() => {
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
    }, 400);

    // Remove sweep overlay after animation completes
    setTimeout(() => {
      setSweeping(false);
    }, 800);
  }, [theme, sweeping]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {/* Sweep transition overlay */}
      {sweeping && (
        <div
          className={`theme-sweep ${sweepDirection}`}
          aria-hidden="true"
        />
      )}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
