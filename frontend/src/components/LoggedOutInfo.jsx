import {Box, Button, Typography} from "@mui/material";
import GuestHeader from "./GuestHeader.jsx";
import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import SendIcon from "@mui/icons-material/Send";

const LoggedOutInfo = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <GuestHeader displayLoginButton={false}/>
            <Box sx={{
                mt: 40
            }}>
                <Typography variant="h3">
                    You are not logged in, choose where you want to go :)
                </Typography>
                <Box sx={{
                    mt: 5
                }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/")}
                        endIcon={<HomeIcon/>}
                        sx={{m: 2}}
                    >
                        Home
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/login")}
                        endIcon={<LoginIcon/>}
                        sx={{m: 2}}
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/register")}
                        endIcon={<SendIcon/>}
                        sx={{m: 2}}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default LoggedOutInfo;