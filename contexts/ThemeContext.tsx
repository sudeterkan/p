import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@theme_preference";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeType>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  const loadTheme = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
      } else {
        const colorScheme = Appearance.getColorScheme();
        setThemeState(colorScheme === "light" ? "light" : "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      const colorScheme = Appearance.getColorScheme();
      setThemeState(colorScheme === "light" ? "light" : "dark");
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const setTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
