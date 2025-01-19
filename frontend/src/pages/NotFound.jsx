import GuestHeader from "../components/GuestHeader.jsx";
import {Box, Button, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <GuestHeader displayLoginButton={true}/>
            <Typography variant="h1" sx = {{mt:45}}>Page not found - 404!</Typography>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<HomeIcon/>}
                onClick={() => navigate("/")}
                sx={{mt: 10}}
            >
                Take me home
            </Button>
        </Box>
    );
}

export default NotFound