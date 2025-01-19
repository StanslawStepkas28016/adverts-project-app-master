import "../styles/Global.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import {axiosInstance} from "../lib/axios.js";
import {Alert, Box, Button, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Loading from "./Loading.jsx";
import UserAdvert from "./UserAdvert.jsx";
import Divider from "@mui/material/Divider";
import AlertBox from "./AlertBox.jsx";

const UserAdvertsView = () => {
    const {authUser} = useAuthStore();
    const navigate = useNavigate();
    const [userAdvertsData, setUserAdvertsData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getUserAdverts();
    }, []);

    const getUserAdverts = async () => {
        try {
            const response = await axiosInstance.get(`/adverts/details/${authUser.IdUser}`);
            setUserAdvertsData(response.data);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    const handleAddAdvert = () => {
        navigate("/add-advert-logged");
    }

    if (!userAdvertsData) {
        return <Loading/>;
    }

    return (
        <div className="see-more">
            <Typography variant="h3" sx={{m: 5}}>Your own adverts</Typography>
            <Box>
                {userAdvertsData.recordset.length !== 0 ? (
                    <Box>
                        {userAdvertsData.recordset.map((advertData) => (
                            <div key={advertData.IdAdvert}>
                                <UserAdvert advertData={advertData}/>
                            </div>
                        ))}
                    </Box>
                ) : (
                    <AlertBox>
                        <Alert severity="warning" sx={{m: 2, maxWidth: "500px"}}>
                            You have not posted any adverts yet!
                        </Alert>
                    </AlertBox>
                )}
                {userAdvertsData.recordset.length === 3 ? (
                        <AlertBox>
                            <Alert severity="warning" sx={{
                                mt: 5,
                                maxWidth: "500px",
                            }}>
                                You cannot add more adverts - maximum per user is 3, <br/>
                                delete one advert, to post more :)
                            </Alert>
                        </AlertBox>
                    ) :
                    (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={handleAddAdvert}
                            endIcon={<AddIcon/>}
                            sx={{m: 2}}
                        >
                            Add advert
                        </Button>
                    )
                }
                {errorMessage && (
                    <AlertBox>
                        <Alert severity="error" sx={{m: 2}}>
                            {errorMessage}
                        </Alert>
                    </AlertBox>
                )}
            </Box>
        </div>
    );
};

export default UserAdvertsView;
