/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                molt: {
                    50: '#fff1f1',
                    100: '#ffdfdf',
                    200: '#ffc5c5',
                    300: '#ff9d9d',
                    400: '#ff6464',
                    500: '#ff2929',
                    600: '#ed1c24', // Moltbook Brand Red (Approx)
                    700: '#c80d15',
                    800: '#a50f16',
                    900: '#881418',
                }
            }
        },
    },
    plugins: [],
}
