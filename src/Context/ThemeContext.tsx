import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState<string>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme)
        }
    }, [])

    const toggleTheme = () => {
        setTheme((preValue) => {
            const newValue = preValue === "light" ? "dark" : "light";
            document.documentElement.classList.remove(preValue);
            document.documentElement.classList.add(newValue);
            localStorage.setItem('theme', newValue);
            return newValue;
        });
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext)