import LoggedHeader from "../components/LoggedHeader.jsx";
import "../styles/Global.css";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {axiosInstance} from "../lib/axios.js";
import {Alert, Box, Button, FormControlLabel, Radio, RadioGroup, TextField, Typography} from "@mui/material";
import PublishIcon from '@mui/icons-material/Publish';
import AlertBox from "../components/AlertBox.jsx";

const EditAdvert = () => {
    const location = useLocation();
    const passedAdvertData = location.state?.advertData;

    const [userAdvertData] = useState(passedAdvertData);
    const [tempUserAdvertData, setTempUserAdvertData] = useState(passedAdvertData);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // console.log(userAdvertData);
    })

    const patchAdvert = async (fieldsToUpdate) => {
        try {
            await axiosInstance.patch(`/adverts/${userAdvertData.IdAdvert}`, fieldsToUpdate);
            return true;
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
            return false;
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setTempUserAdvertData((prev) => ({
            ...prev, [name]: name === "IdStatus" || name === "IdType" ? Number(value) : value,
        }));
    };

    const getFieldsToUpdate = (original, temp) => {
        const differences = {};

        for (const key in temp) {
            if (temp[key] !== original[key]) {
                differences[key] = temp[key];
            }
        }

        return differences;
    }

    const validFields = (fields) => {
        if (Object.keys(fields).length === 0) {
            setErrorMessage("No fields to update found, please modify something or quit!")
            return false;
        } else {
            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const fieldsToUpdate = getFieldsToUpdate(userAdvertData, tempUserAdvertData);

        if (!validFields(fieldsToUpdate)) {
            return;
        }

        if (await patchAdvert(fieldsToUpdate)) {
            setSuccessMessage("Advert successfully updated successfully! Redirecting...");
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
                    <Typography variant="h3" sx={{m: 5}}>What do you want to change?</Typography>

                    <RadioGroup
                        name="IdType"
                        row
                        sx={{
                            justifyContent: "center",
                        }}
                        value={tempUserAdvertData.IdType}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="1" control={<Radio color="secondary"/>} label="Mixing"/>
                        <FormControlLabel value="2" control={<Radio color="secondary"/>} label="Producing"/>
                        <FormControlLabel value="3" control={<Radio color="secondary"/>} label="Mastering"/>
                    </RadioGroup>

                    <RadioGroup
                        name="IdStatus"
                        row
                        sx={{
                            justifyContent: "center",
                            mt: 5
                        }}
                        value={tempUserAdvertData.IdStatus}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="1" control={<Radio color="secondary"/>} label="Active"/>
                        <FormControlLabel value="2" control={<Radio color="secondary"/>} label="Inactive"/>
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
                            color="secondary"
                            variant="outlined"
                            required
                            multiline
                            minRows={5}
                            defaultValue={tempUserAdvertData.Description}
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
                            defaultValue={tempUserAdvertData.Price}
                            onChange={handleChange}
                        />

                        <TextField
                            name="WaitTime"
                            label="Wait time"
                            type="number"
                            color="secondary"
                            required
                            defaultValue={tempUserAdvertData.WaitTime}
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
                            Submit your changes
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

export default EditAdvert;
