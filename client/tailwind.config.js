const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    content: ['./src/**/**/*.{js,ts,jsx,tsx,html,mdx}', './src/**/*.{js,ts,jsx,tsx,html,mdx}'],
    darkMode: 'class',
    theme: {
        screens: {
            lg: { max: '1500px' },
            wrap: { max: '1260px' },
            md: { max: '1050px' },
            wrapSmall: { max: '950px' },
            smd: { max: '800px' },
            mmd: { max: '700px' },
            sm: { max: '550px' },
            xs: { max: '450px' },

            burger: { min: '550px' }
        },
        extend: {
            colors: {
                black: { 900: '#000000', '900_0c': '#0000000c' },
                yellow: {
                    1000: '#FDF3E2',
                    1100: '#F2AC3C',
                    1200: '#926114'
                },
                gray: {
                    50: '#fafafa',
                    200: '#e9e9e9',
                    400: '#b5b5b5',
                    600: '#717171',
                    700: '#727272',
                    900: '#212121',
                    1000: '#D9D9D9'
                },
                cyan: {
                    1000: '#3BB6AC',
                    1100: '#449891'
                },
                blue: {
                    1000: '#2463BC',
                    1100: '#3B82F6'
                },
                red: {
                    1000: '#D82C0D'
                },
                white: '#ffffff',
                colors: '#edf3faff',
                open_border: '#B6B6B6',
                interactive: '#2463BC',
                selected: '#EDF3FA',
                deep_purple: '#7f61db',
                error: '#e24c4c',
                subdued: '#FAFAFA',
                surface: { 800: '#EDF3FA' },
                indigo: { 400: '#5971cb' },
                teal: { 300: '#5599b7' },
                deep_orange: { 400: '#e58938' },
                base_node_icon: '#5971CB',
                pipeline_diagram_view_button: '#2463BC',
                icon_button_hover: '#F5F4F6',
                sp_green: '#19615B'
            },
            fontFamily: { inter: 'Inter' },
            fontSize: {
                heading4Xl: ['36px', '44px'],
                heading3Xl: ['32px', '40px'],
                heading2Xl: ['28px', '32px'],
                headingXl: ['24px', '28px'],
                headingLg: ['20px', '24px'],
                headingMd: ['16px', '20px'],
                headingSm: ['14px', '16px'],
                headingXs: ['12px', '16px'],
                bodyLg: ['16px', '24px'],
                bodyMd: ['14px', '20px'],
                bodySm: ['12px', '16px'],
                bodyXs: ['11px', '14px']
            },
            boxShadow: {
                card: '0px 2px 1px 0px #0000000d',
                button: '0px 1px 0px 0px rgba(0, 0, 0, 0.05)'
            },
            transitionProperty: {
                ...defaultTheme.transitionProperty,
                width: 'width',
                transition: 'transition'
            },
            borderRadius: { '4xl': '30px', '4.5xl': '32px' },
            minWidth: {
                20: '80px'
            },
            borderWidth: {
                1: '1px',
                1.5: '1.5px'
            },
            spacing: {
                800: '800px',
                50: '196px'
            },
            backgroundImage: {
                'gradient-blue-cyan': 'linear-gradient(to right, #449891, #5CBCB8)'
            },
            keyframes: {
                show: {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                },
                hide: {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '100%': { opacity: 0, transform: 'scale(0.95)' }
                }
            },
            animation: {
                show: 'show 0.3s ease-out forwards',
                hide: 'hide 0.3s ease-in forwards'
            }
        }
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')]
};
