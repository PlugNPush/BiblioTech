
import React, { createContext, useState } from 'react';

// Définir les types pour les thèmes
type Theme = 'light' | 'dark';

// Définir le type pour le contexte
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Créer le contexte du thème
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Créer le fournisseur du thème
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
