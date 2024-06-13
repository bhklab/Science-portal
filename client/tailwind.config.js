const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    content: ['./src/**/**/*.{js,ts,jsx,tsx,html,mdx}', './src/**/*.{js,ts,jsx,tsx,html,mdx}'],
    darkMode: 'class',
    theme: {
        screens: { md: { max: '1050px' }, smd: { max: '800px' }, mmd: { max: '700px' }, sm: { max: '550px' } },
        extend: {
            colors: {
                black: { 900: '#000000', '900_0c': '#0000000c' },
                gray: {
                    50: '#fafafa',
                    200: '#e9e9e9',
                    400: '#b5b5b5',
                    600: '#717171',
                    700: '#727272',
                    900: '#212121'
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
                icon_button_hover: '#F5F4F6'
            },
            fontFamily: { inter: 'Inter' },
            fontSize: {
                heading2Xl: ['28px', '32px'],
                headingXl: ['24px', '28px'],
                headingLg: ['20px', '24px'],
                headingMd: ['16px', '20px'],
                headingSm: ['14px', '16px'],
                bodyMd: ['14px', '20px'],
                bodySm: ['12px', '16px']
            },
            boxShadow: {
                card: '0px 2px 1px 0px #0000000d',
                button: '0px 1px 0px 0px #0000000d'
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
                1: '1px'
            },
            spacing: {
                800: '800px',
                50: '196px'
            }
        }
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')]
};
