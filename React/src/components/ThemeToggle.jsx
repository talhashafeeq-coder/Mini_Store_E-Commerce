import React, { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

const ThemeToggle = () => {
  // Load theme from localStorage (Persist on reload)
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Admin Panel</h2>
      <DarkModeToggle onChange={setIsDarkMode} checked={isDarkMode} size={80} />
    </div>
  );
};

export default ThemeToggle;
