import {useAuthStore} from "../store/useAuthStore.js";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SummarizeIcon from "@mui/icons-material/Summarize";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import {MenuBase} from "./MenuBase.jsx";
import {useState} from "react";

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const {authUser, logout} = useAuthStore();
    const navigate = useNavigate();

    return (<div>
        <Button
            variant="contained"
            color="secondary"
            size="large"
            disableElevation
            onClick={handleClick}
            endIcon={<MenuIcon/>}
            sx={{
                mb: -5
            }}
        >
            Menu
        </Button>
        <MenuBase
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >

            <MenuItem>
                Logged in as {authUser.FirstName} {authUser.LastName}
            </MenuItem>

            <Divider/>
            {/*Dla administratora*/}
            {authUser.IdRole === 1 && (
                <MenuItem onClick={() => navigate("/dashboard")}>
                    <SpaceDashboardIcon/>
                    Dashboard
                </MenuItem>
            )}

            <MenuItem onClick={() => navigate("/")}>
                <SummarizeIcon/>
                Adverts
            </MenuItem>

            <MenuItem onClick={() => navigate("/edit-account-logged")}>
                <EditIcon/>
                Edit your account
            </MenuItem>

            <MenuItem onClick={logout}>
                <LogoutIcon/>
                Logout
            </MenuItem>

        </MenuBase>
    </div>);
}

export default UserMenu;