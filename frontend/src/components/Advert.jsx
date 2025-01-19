import {Box, Typography} from "@mui/material";
import PropTypes from "prop-types";

const Advert = ({advertData}) => {
    const typeToInfoText = {
        "mixing": "per mix",
        "producing": "per beat",
        "mastering": "per master",
    };

    const preparePhoneNumber = (phoneNumber) => {
        return ("+ 48 " + phoneNumber.match(/.{1,3}/g).join(" "));
    }

    return (
        <Box className={`advert-card ${advertData.Type.toLowerCase()}`}>
            <Box sx={{padding: "15px", backgroundColor: "#DEE2E6"}}>
                <Typography variant="h3" sx={{fontWeight: 'bold'}}>
                    Name: {advertData.FirstName} {advertData.LastName} →
                    Skills: {advertData.Skills} </Typography>
            </Box>
            <Box sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px"
            }}>
                <Box className="advert-card-details-1st">
                    <p>
                        <strong>Type:</strong> {advertData.Type}
                    </p>
                    <p>
                        <strong>Description:</strong> {advertData.Description}
                    </p>
                    <p>
                        <strong>Price {typeToInfoText[advertData.Type.toLowerCase()]}:</strong> {advertData.Price} PLN
                    </p>
                </Box>
                <Box className="advert-card-details-2nd">
                    <p><strong>Wait time:</strong> {advertData.WaitTime} days</p>
                    <p><strong>Status:</strong> {advertData.Status}</p>
                    <a href={`tel:${advertData.PhoneNumber}`} className="advert-card-phone">
                        <p>
                            <strong>Book me:</strong> {preparePhoneNumber(advertData.PhoneNumber)}
                        </p>
                    </a>
                </Box>
            </Box>
        </Box>
    );
}

Advert.propTypes = {
    advertData: PropTypes.any.isRequired,
};

export default Advert;