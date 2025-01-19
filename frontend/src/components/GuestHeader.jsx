import {Box, Button, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import LoginIcon from "@mui/icons-material/Login";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

const GuestHeader = ({displayLoginButton}) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    }

    return (<Box>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant="h3" sx={{
                textAlign: "left",
            }}>Engineers Marketplace
            </Typography>
            {displayLoginButton && (
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<LoginIcon/>}
                    sx={{m: 1}} onClick={handleLoginClick}>Log in</Button>
            )}
        </Box>
        <Divider sx={{my: 2, borderBottom: 3, color: "#9c27b0"}}/>
    </Box>);
}

GuestHeader.propTypes = {
    displayLoginButton: PropTypes.bool.isRequired,
};

export default GuestHeader;
