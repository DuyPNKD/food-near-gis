import type {Config} from "tailwindcss";
import flowbite from "flowbite/plugin";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {},
        fontFamily: {
            sans: ["Verdana", "sans-serif"],
        },
    },
    plugins: [flowbite, scrollbar],
};

export default config;
