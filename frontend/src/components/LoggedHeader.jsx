import "../styles/Global.css"
import {Box, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import UserMenu from "./UserMenu.jsx";

const LoggedHeader = () => {
    return (<Box>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant="h3" sx={{
                textAlign: "left",
            }}>Engineers Marketplace
            </Typography>
            <UserMenu></UserMenu>
        </Box>
        <Divider sx={{my: 2, borderBottom: 3, color: "#9c27b0"}}/>
    </Box>);
}

export default LoggedHeader;
