import LoggedHeader from "../components/LoggedHeader.jsx";
import "../styles/Global.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "../lib/axios.js";
import {useAuthStore} from "../store/useAuthStore.js";
import {Alert, Box, Button, FormControlLabel, Radio, RadioGroup, TextField, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';


const AddAdvert = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const {authUser} = useAuthStore();

    const [formData, setFormData] = useState({
        Type: "",
        Description: "",
        Price: "",
        WaitTime: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addAdvert = async (formData) => {
        try {
            await axiosInstance.post(`/adverts`, {
                IdUser: authUser.IdUser,
                IdType: formData.Type,
                Description: formData.Description,
                Price: parseFloat(formData.Price),
                WaitTime: parseInt(formData.WaitTime, 10),
            });
            return true;
        } catch (error) {
            setErrorMessage(error.response.data.message);
            return false;
        }
    }

    const validDescription = () => {
        if (formData.Description.length >= 500) {
            setErrorMessage("Description cannot exceed 500 characters!");
            return false;
        } else {
            return true;
        }
    }

    const validPrice = () => {
        if (formData.Price <= 0) {
            setErrorMessage("Price cannot be negative!");
            return false;
        } else {
            return true;
        }
    }

    const validWaitTime = () => {
        if (formData.WaitTime <= 0) {
            setErrorMessage("Wait time cannot be negative!");
            return false;
        } else {
            return true;
        }
    }

    const validRadio = () => {
        if (formData.Type <= 0) {
            setErrorMessage("Pick a type!");
            return false;
        } else {
            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!validDescription() || !validPrice() || !validWaitTime() || !validRadio()) {
            return;
        }

        if (await addAdvert(formData)) {
            setSuccessMessage("Successfully added an advert! Redirecting...");
            setTimeout(() => navigate("/see-more-logged"), 1000);
        }
    };

    return (
        <Box>
            <LoggedHeader/>
            <Box sx={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h3" sx={{m: 5}}>What do you want to advertise?</Typography>

                    <RadioGroup
                        defaultValue="Mixing"
                        row
                        name="Type"
                        sx={{
                            justifyContent: "center",
                        }}
                    >
                        <FormControlLabel value="1" control={<Radio color="secondary"/>} label="Mixing"
                                          onChange={handleChange}/>
                        <FormControlLabel value="2" control={<Radio color="secondary"/>} label="Producing"
                                          onChange={handleChange}/>
                        <FormControlLabel value="3" control={<Radio color="secondary"/>} label="Mastering"
                                          onChange={handleChange}/>
                    </RadioGroup>

                    <Box sx={{
                        mt: 5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>
                        <TextField
                            name="Description"
                            type="text"
                            label="Description (max 500 characters)"
                            variant="outlined"
                            color="secondary"
                            required
                            multiline
                            minRows={5}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root textarea": {
                                    boxShadow: "none",
                                    border: "none",
                                },
                            }}
                        />
                        <TextField
                            id="price"
                            name="Price"
                            label="Price"
                            type="number"
                            color="secondary"
                            fullWidth
                            required
                            onChange={handleChange}
                        />
                        <TextField
                            name="WaitTime"
                            label="Wait time"
                            type="number"
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
                            endIcon={<AddIcon/>}
                        >
                            Add your advert
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
        </Box>
    );
};

export default AddAdvert;
