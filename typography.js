import Typography from "typography";

const typography = new Typography({
    baseFontSize: "18px",
    baseLineHeight: 1.666,
    googleFonts: [
        {
            name: "Monserrat",
            styles: ["700"],      
        },
        {
            name: "Open Sans",
            styles: ["400"]
        }
    ],
    headerFontFamily: [ "Monserrat", "Helvetica Neue", "sans-serif"],
    bodyFontFamily: [ "Open Sans", "sans-serif"]
})

typography.injectStyles();

export default typography;