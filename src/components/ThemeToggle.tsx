import { useThemeStore } from '../store/themeStore';

export const ThemeToggle = () => {
  const { setTheme } = useThemeStore();

  return (
    <div className="theme-toggle">
      <button onClick={() => setTheme('forest')}>Forest</button>
      <button onClick={() => setTheme('sea')}>Sea</button>
      <button onClick={() => setTheme('warm')}>Warm</button>
    </div>
  );
}; 