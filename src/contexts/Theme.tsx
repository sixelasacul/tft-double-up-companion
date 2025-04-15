import { createContext, PropsWithChildren, useContext, useState } from "react";
import { parse, serialize } from "cookie-es";
import { getHeader } from "@tanstack/react-start/server";
import { createIsomorphicFn } from "@tanstack/react-start";

export type Theme = "system" | "dark" | "light";
type ThemeState = [Theme, (newTheme: Theme) => void];

const ThemeContext = createContext<ThemeState | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme should not be called outside ThemeContext");
  }
  return ctx;
}

const THEME_STORAGE_KEY = "theme";

const getCookies = createIsomorphicFn()
  .server(() => {
    return getHeader("Cookie") ?? "";
  })
  .client(() => document.cookie);

function getTheme(): Theme {
  const cookieString = getCookies();
  const cookies = parse(cookieString);
  return (cookies[THEME_STORAGE_KEY] as Theme) ?? "system";
}

function saveTheme(theme: Theme) {
  document.cookie = serialize(THEME_STORAGE_KEY, theme);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getTheme());

  function updateTheme(newTheme: Theme) {
    saveTheme(newTheme);
    setTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={[theme, updateTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}
