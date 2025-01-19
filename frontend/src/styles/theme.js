import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Inter', sans-serif",
        allVariants: {
            fontWeight: 200,
        },
        button: {
            textTransform: 'none'
        }
    },
});

export default theme;
