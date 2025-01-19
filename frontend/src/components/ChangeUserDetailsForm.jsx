import "../styles/Global.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import {axiosInstance} from "../lib/axios.js";
import {Alert, Box, Button, TextField, Typography} from "@mui/material";
import Loading from "../components/Loading.jsx";
import PublishIcon from '@mui/icons-material/Publish';

const ChangeUserDetailsForm = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [tempUserDetails, setTempUserDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const {authUser} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        getUserDetails();
    }, []);

    const getUserDetails = async () => {
        const idUser = authUser.IdUser;
        try {
            const res = await axiosInstance.get((`/users/${idUser}`));
            setUserDetails(res.data);
            setTempUserDetails(res.data);
        } catch (e) {
            setErrorMessage(e);
        }
    };

    if (!userDetails) {
        return <Loading/>;
    }

    const modifyUserDetails = async () => {
        try {
            await axiosInstance.patch(`/users/${authUser.IdUser}`, tempUserDetails);
            return true;
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
            return false;
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setTempUserDetails((prev) => ({
            ...prev, [name]: value
        }));
    };


    const validPhone = (phone) => {
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            setErrorMessage("Phone number must be 9 digits (polish phone number)!");
            return false;
        }

        if (tempUserDetails.PhoneNumber === userDetails.PhoneNumber) {
            setErrorMessage("You have not updated your phone number!");
            return false;
        }

        setErrorMessage("");
        return true;
    };

    const handleSubmit = async (e) => {
        setErrorMessage("");
        e.preventDefault();

        if (!validPhone(tempUserDetails.PhoneNumber)) {
            return;
        }

        if (await modifyUserDetails(tempUserDetails.PhoneNumber)) {
            setSuccessMessage("User data successfully updated successfully! Redirecting...");
            setTimeout(() => navigate("/see-more-logged"), 1000);
        }
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}>
            <Box id="phone-form" component="form" className="s" onSubmit={handleSubmit}>
                <Typography variant="h3" sx={{m: 5}}>Want to change your phone number?</Typography>

                <Box sx={{
                    mt: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
                    <TextField
                        name="PhoneNumber"
                        label="Current phone number"
                        type="text"
                        color="secondary"
                        required
                        defaultValue={tempUserDetails.PhoneNumber}
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
                        Submit your new phone number
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

export default ChangeUserDetailsForm;