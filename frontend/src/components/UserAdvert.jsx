import {Alert, Box, Button} from "@mui/material";
import Advert from "./Advert.jsx";
import PropTypes from "prop-types";
import {axiosInstance} from "../lib/axios.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertBox from "./AlertBox.jsx";

const UserAdvert = ({advertData}) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleEditAdvert = () => {
        navigate("/edit-advert-logged", {state: {advertData}});
    }

    const handleDeleteAdvert = async () => {
        setErrorMessage("");
        try {
            await axiosInstance.delete(`/adverts/${advertData.IdAdvert}`);
            setSuccessMessage("Successfully deleted your advert, refreshing the window in 1 sec!");
            setTimeout(() => {
                setSuccessMessage("");
                window.location.reload();
            }, 1000);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }

    return (<Box>
        <Advert advertData={advertData}/>
        <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleEditAdvert}
            endIcon={<EditIcon/>}
            sx={{m: 2}}
        >
            Edit advert
        </Button>
        <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleDeleteAdvert}
            endIcon={<DeleteIcon/>}
            sx={{m: 2}}
        >
            Delete advert
        </Button>
        <AlertBox>
            {successMessage && (
                <Alert severity="success" sx={{m: 2}}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{m: 2}}>
                    {errorMessage}
                </Alert>
            )}
        </AlertBox>
    </Box>);
}

UserAdvert.propTypes = {
    advertData: PropTypes.any.isRequired,
};

export default UserAdvert;