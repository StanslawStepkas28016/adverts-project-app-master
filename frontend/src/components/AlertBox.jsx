import {Box} from "@mui/material";
import PropTypes from "prop-types";

const AlertBox = ({children}) => {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {children}
        </Box>
    );
}

AlertBox.propTypes = {
    children: PropTypes.any.isRequired,
}

export default AlertBox;