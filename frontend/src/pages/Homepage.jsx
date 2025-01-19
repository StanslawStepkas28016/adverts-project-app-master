import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GuestHeader from "../components/GuestHeader.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {Alert, Box, Button, Card, CardContent, Typography} from "@mui/material";
import {axiosInstance} from "../lib/axios.js";
import ReadMoreIcon from '@mui/icons-material/ReadMore';

const Homepage = () => {
    const [adverts, setAdverts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const {authUser} = useAuthStore();
    const navigate = useNavigate();
    const ADVERT_LIMIT = 25;

    const getAdverts = async (limit = 10) => {
        try {
            const res = await axiosInstance.get(`/adverts/summary?limit=${limit}`);
            setAdverts(res.data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        if (authUser) {
            navigate("/see-more-logged");
        }
    });

    useEffect(() => {
        getAdverts(ADVERT_LIMIT);
    }, []);

    const handleSeeMoreClick = () => {
        navigate("/see-more");
    }

    return (
        <Box>
            <GuestHeader displayLoginButton={true}/>
            <Box>
                {errorMessage ? (
                    <Alert severity="error" sx={{m: 10, padding: 10}}>
                        {errorMessage}
                    </Alert>
                ) : (
                    <Box>
                        <Typography variant="h3" sx={{mt: 10, mb: 5}}> Discover people with us!</Typography>
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                        }}>
                            {
                                adverts.map((advert) => (
                                    <Box key={advert.IdUser} className={`advert-card ${advert.Type.toLowerCase()}`}>
                                        <Card sx={{boxShadow: "none"}}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {advert.FirstName} {advert.LastName}
                                                </Typography>
                                                <Typography gutterBottom variant="h7" component="div">
                                                    {advert.Type}
                                                </Typography>
                                                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                    {advert.Description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                ))}
                        </Box>
                        <div>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                endIcon={<ReadMoreIcon/>}
                                sx={{mt: 5}} onClick={handleSeeMoreClick}>See more</Button>
                        </div>
                    </Box>)
                }
            </Box>
        </Box>
    );
}

export default Homepage;