import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // === التقنية السحرية لتبديل فوري بدون glitch ===
    const root = window.document.documentElement;
    
    // 1. تعطيل كل الترانزيشنز مؤقتًا
    root.classList.add("disable-transitions");
    
    // 2. تغيير الثيم
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);

    // 3. إعادة تفعيل الترانزيشن بعد الرسم (مهم جدًا)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("disable-transitions");
      });
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      aria-label="theme toggler"
      onClick={toggleTheme}
      className="flex items-center justify-center text-black rounded-full cursor-pointer bg-gray-2 dark:bg-dark-bg h-9 w-9 dark:text-white md:h-14 md:w-14 theme-transition"
    >
      {/* SVG icons نفسها */}
      <svg
        viewBox="0 0 23 23"
        className="w-5 h-5 stroke-current dark:hidden md:h-6 md:w-6"
        fill="none"
      >
        <path d="M9.55078 1.5C5.80078 1.5 1.30078 5.25 1.30078 11.25C1.30078 17.25 5.80078 21.75 11.8008 21.75C17.8008 21.75 21.5508 17.25 21.5508 13.5C13.3008 18.75 4.30078 9.75 9.55078 1.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden w-5 h-5 dark:block md:h-6 md:w-6"
      >
        {/* ... الـ sun icon */}
      </svg>
    </button>
  );
};

export default ThemeToggler;