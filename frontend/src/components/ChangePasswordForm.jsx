import {Alert, Box, Button, TextField, Typography} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "../lib/axios.js";
import {useAuthStore} from "../store/useAuthStore.js";

const ChangePasswordForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const {authUser} = useAuthStore();
    const [formData, setFormData] = useState({
        CurrentPassword: "",
        NewPassword: "",
        RepeatNewPassword: "",
    });

    const changePassword = async () => {
        try {
            await axiosInstance.post(`/auth/change-password`, {
                IdUser: authUser.IdUser,
                Password: formData.CurrentPassword,
                NewPassword: formData.NewPassword,
            });
            return true;
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
            return false;
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validPassword = () => {
        if (formData.NewPassword !== formData.RepeatNewPassword) {
            setErrorMessage("Your new password must match the repeated password!");
            return false;
        }

        if (formData.NewPassword === formData.CurrentPassword) {
            setErrorMessage("Your new password cannot be identical to your old password!");
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!validPassword()) {
            return;
        }

        if (await changePassword()) {
            setSuccessMessage("Password changed successfully. Redirecting...");
            setTimeout(() => navigate("/see-more-logged"), 1000);
        }
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}>
            <Box id="password-form" component="form" onSubmit={handleSubmit}>
                <Typography variant="h3" sx={{m: 5}}>Maybe your password?</Typography>

                <Box sx={{
                    mt: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
                    <TextField
                        name="CurrentPassword"
                        label="Current password"
                        type="password"
                        color="secondary"
                        required
                        onChange={handleChange}
                    >
                    </TextField>

                    <TextField
                        name="NewPassword"
                        label="Your new password"
                        type="password"
                        color="secondary"
                        required
                        onChange={handleChange}
                    >
                    </TextField>

                    <TextField
                        name="RepeatNewPassword"
                        label="Repeat your new password"
                        type="password"
                        color="secondary"
                        required
                        onChange={handleChange}
                    >
                    </TextField>

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        type="submit"
                        endIcon={<PublishIcon/>}
                    >
                        Submit your new password
                    </Button>

                    {errorMessage && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {errorMessage}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" sx={{m: 2}}>
                            {successMessage}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default ChangePasswordForm;