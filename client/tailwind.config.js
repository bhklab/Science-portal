const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    mode: "jit",
    content: [
        "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
    ],
    darkMode: "class",
    theme: {
        screens: { md: { max: "1050px" }, sm: { max: "550px" } },
        extend: {
            colors: {
                black: { 900: "#000000", "900_0c": "#0000000c" },
                gray: {
                    50: "#fafafa",
                    100: "#edf3fa",
                    200: "#e9e9e9",
                    400: "#b5b5b5",
                    600: "#717171",
                    700: "#727272",
                    900: "#212121",
                },
                white: "#ffffff",
                colors: "#edf3faff",
                checkbox_border: "#B6B6B6",
                interactive: "#2463BC",
                selected: "#EDF3FA",
                deep_purple: "#7f61db",
                error: "#e24c4c",
                subdued: "#FAFAFA",
                surface: { 800: "#EDF3FA" },
                indigo: { 400: "#5971cb" },
                teal: { 300: "#5599b7" },
                deep_orange: { 400: "#e58938" },
                base_node_icon: "#5971CB",
                pipeline_diagram_view_button: "#2463BC",
                icon_button_hover: "#F5F4F6",
                accent_red: "#CB5D38",
                accent_yellow: "#F2AC3C",
                accent_olive: "#88B772",
                accent_green: "#59AA6A",
                accent_teal: "#449891",
                accent_blue: "#5599B7",
                accent_purple: "#7F61DB",
            },
            fontFamily: { inter: "Inter" },
            fontSize: {
              pp_name: ["20px", "24px"],
              sign_in: ["24px", "28px"],
              social_sign_in: ["14px", "16px"],
            },
            boxShadow: { bs: "0px 1px  1px 0px #0000000c" },
            transitionProperty: {
                ...defaultTheme.transitionProperty,
                width: "width",
                transition: "transition",
            },
            borderRadius: { "4xl": "30px", "4.5xl": "32px" },
            minWidth: {
                "20": "80px"
            },
			borderWidth: {
				"1": "1px" 
			}
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
