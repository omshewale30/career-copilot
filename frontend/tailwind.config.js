/** @type {import('tailwindcss').Config} */

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                // Base colors
                background: "#0d1117",
                foreground: "#e5e7eb",
                
                // Primary colors
                primary: {
                    DEFAULT: "#6366f1",
                    foreground: "#e5e7eb",
                },
                
                // Secondary colors
                secondary: {
                    DEFAULT: "#7c3aed",
                    foreground: "#e5e7eb",
                },
                
                // Accent colors
                accent: {
                    DEFAULT: "#2dd4bf",
                    foreground: "#e5e7eb",
                },
                
                // Card and surface colors
                card: {
                    DEFAULT: "#161b22",
                    foreground: "#e5e7eb",
                },
                
                // Border colors
                border: {
                    DEFAULT: "rgba(229, 231, 235, 0.1)",
                    hover: "rgba(229, 231, 235, 0.2)",
                },
                
                // Input colors
                input: {
                    DEFAULT: "#161b22",
                    foreground: "#e5e7eb",
                },
                
                // Ring colors (for focus states)
                ring: {
                    DEFAULT: "#6366f1",
                    hover: "#7c3aed",
                },
                
                // Muted colors
                muted: {
                    DEFAULT: "rgba(229, 231, 235, 0.6)",
                    foreground: "rgba(229, 231, 235, 0.8)",
                },
                
                // Destructive colors (for errors, warnings)
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#e5e7eb",
                },
                
                // Popover colors
                popover: {
                    DEFAULT: "#161b22",
                    foreground: "#e5e7eb",
                },
            },
            borderRadius: {
                lg: "1rem",
                md: "0.75rem",
                sm: "0.5rem",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "blob": "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [],
}
