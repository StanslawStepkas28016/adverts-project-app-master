import {Box, Button, Typography} from "@mui/material";
import LoggedHeader from "../components/LoggedHeader.jsx";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const {authUser} = useAuthStore();

    return (
        <Box>
            <LoggedHeader/>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: "10vh"
            }}>

                <Typography variant="h2" sx={{
                    mb: 5
                }}>
                    Hi {authUser.FirstName} {authUser.LastName}!
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate("/dashboard-view-1st")}
                    endIcon={<RemoveRedEyeIcon/>}
                    sx={{
                        m: 2,
                        width: "500px"
                    }}
                >
                    Type-Advert-UserAdvert-Status-User Tables
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate("/dashboard-view-2nd")}
                    endIcon={<RemoveRedEyeIcon/>}
                    sx={{
                        m: 2,
                        width: "500px"
                    }}
                >
                    User-Role-UserSkill-Skill Tables
                </Button>

            </Box>
        </Box>
    );
}

export default AdminDashboard;