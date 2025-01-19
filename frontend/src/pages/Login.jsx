import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GuestHeader from "../components/GuestHeader.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {Alert, Box, Button, Link, TextField, Typography} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
    const [formData, setFormData] = useState({
        Login: "",
        Password: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const {login, authUserError, resetAuthUserError} = useAuthStore();

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegisterClick = () => {
        resetAuthUserError();
        navigate("/register");
    }

    useEffect(() => {
        setErrorMessage(authUserError);
    }, [authUserError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (await login(formData)) {
            setSuccessMessage("Successfully logged in! Redirecting...");
            setTimeout(() => navigate("/see-more-logged"), 1000);
        }
    };

    return (
        <Box>
            <GuestHeader displayLoginButton={false}/>
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Typography variant="h3">
                    Good to see you again!
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        maxWidth: 300,
                        padding: 4,
                    }}
                >
                    <TextField
                        id="login"
                        name="Login"
                        label="Login"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        id="password"
                        name="Password"
                        label="Password"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        required
                        type="password"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        type="submit"
                        endIcon={<LoginIcon/>}
                        sx = {{
                            mt: 2
                        }}
                    >
                        Sign in
                    </Button>
                    {successMessage && (
                        <Alert severity="success" sx={{m: 2}}>
                            {successMessage}
                        </Alert>
                    )}
                    {
                        errorMessage && (
                            <Alert severity="error" sx={{m: 2}}>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </Box>
                <Typography variant="h3" sx={{mt: 3}}>
                    Not a user? <Link onClick={handleRegisterClick} variant="h3" color="secondary">Register</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
