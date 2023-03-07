
import style from "@/styles/HomePage.module.css"
import { THEME } from "@/types/Theme"
import { useState } from "react"

const ThemeToggle = () =>
{
  const [theme, setTheme] = useState(THEME.LIGHT)
  const handleThemeToggle = () => {
    if (theme === THEME.LIGHT) setTheme(THEME.DARK)
    else setTheme(THEME.LIGHT)
  }

  return (
    <div className={`${style.themebutta}`} onClick={handleThemeToggle}>
      {(theme === THEME.LIGHT) ? `☀️` : `🌕`}
    </div>
  );
}

export default ThemeToggle;