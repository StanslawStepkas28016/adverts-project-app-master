import {Box} from "@mui/material";
import LoggedHeader from "../components/LoggedHeader.jsx";
import ChangeUserDetailsForm from "../components/ChangeUserDetailsForm.jsx";
import ChangePasswordForm from "../components/ChangePasswordForm.jsx";

const EditAccount = () => {
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
                maxWidth: "500px",
                margin: "0 auto",
            }}>
                <ChangeUserDetailsForm/>
                <ChangePasswordForm/>
            </Box>
        </Box>
    );
};

export default EditAccount;
