import {useEffect, useState} from "react";
import "../styles/Global.css";
import {useNavigate} from "react-router-dom";
import GuestHeader from "../components/GuestHeader.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {Alert, Box, Button, Checkbox, FormControlLabel, TextField, Typography} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const skillMap = {
    "Audio restoration": 1,
    "Vocal tuning": 2,
    "Arrangement": 3,
    "Critical hearing": 4,
};

const Register = () => {
    const [formData, setFormData] = useState({
        Login: "",
        Password: "",
        FirstName: "",
        LastName: "",
        PhoneNumber: "",
        Skills: [],
    });

    const [phoneError, setPhoneError] = useState("");
    const [skillsError, setSkillsError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const {register, authUserError} = useAuthStore();

    useEffect(() => {
        setErrorMessage(authUserError);
    }, [authUserError]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSkillChange = (e) => {
        const skillId = parseInt(e.target.value);
        const {checked} = e.target;

        setFormData((prev) => ({
            ...prev,
            Skills: checked
                ? [...prev.Skills, skillId]
                : prev.Skills.filter((id) => id !== skillId),
        }));
    };

    const validPhone = (phone) => {
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            setPhoneError("Phone number must be 9 digits (polish phone number)!");
            return false;
        } else {
            setPhoneError("");
            return true;
        }
    };

    const validSkills = () => {
        if (formData.Skills.length === 0) {
            setSkillsError("Please select at least one skill!");
            return false;
        } else {
            setSkillsError("");
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validPhone(formData.PhoneNumber) || !validSkills(formData.Skills)) {
            return;
        }

        if (await register(formData)) {
            setSuccessMessage("Successfully registered! Redirecting...");
            setTimeout(() => navigate("/login"), 1000);
        }
    };

    return (
        <Box>
            <GuestHeader displayLoginButton={true}/>
            <Box
                sx={{
                    minHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Typography variant="h3">Please fill in your data</Typography>

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
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        id="password"
                        name="Password"
                        label="Password"
                        variant="outlined"
                        color="secondary"
                        required
                        type="password"
                        onChange={handleChange}
                    />
                    <TextField
                        id="firstName"
                        name="FirstName"
                        label="First name"
                        variant="outlined"
                        color="secondary"
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        id="lastName"
                        name="LastName"
                        label="Last name"
                        variant="outlined"
                        color="secondary"
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        id="phoneNumber"
                        name="PhoneNumber"
                        label="Phone number"
                        type="tel"
                        variant="outlined"
                        color="secondary"
                        required
                        onChange={handleChange}
                    />

                    {phoneError && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {phoneError}
                        </Alert>
                    )}

                    <Typography variant="h6" sx={{mt: 5}}>
                        What are your skills?
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: 650,
                        }}
                    >
                        {Object.keys(skillMap).map((skill) => (
                            <FormControlLabel
                                key={skill}
                                control={
                                    <Checkbox
                                        color="secondary"
                                        value={skillMap[skill]}
                                        onChange={handleSkillChange}
                                    />
                                }
                                label={skill}
                            />
                        ))}
                    </Box>

                    {skillsError && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {skillsError}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        type="submit"
                        endIcon={<SendIcon/>}
                        sx={{mt: 2}}
                    >
                        Sign up
                    </Button>

                    {successMessage && (
                        <Alert severity="success" sx={{width: "100%", mt: 2}}>
                            {successMessage}
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert severity="error" sx={{width: "100%", mt: 2}}>
                            {errorMessage}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
