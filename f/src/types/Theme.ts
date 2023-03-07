import { createContext } from "react"

export type ThemeType = {
  className: "light" | "dark",
  navbar: string,
  background: string,
  light_background: string,
  textColor: string,
  footer: string,
}

export const THEME:{LIGHT: ThemeType, DARK: ThemeType} = {
  LIGHT : {
    className: "light",
    navbar: "white",
    background: "white",
    light_background: "whitesmoke",
    textColor: "#212121",
    footer: "#0a185c",
  },
  DARK : {
    className: "dark",
    navbar: "#050c2e",
    background: "#121212",
    light_background: "#262626",
    textColor:"#ffffff",
    footer: "#121212",
  }
}

export const ThemeContext = createContext(THEME.LIGHT)