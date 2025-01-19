import "../styles/Global.css"
import "../styles/SeeMore.css"
import GuestHeader from "../components/GuestHeader.jsx";
import PostedAdvertsView from "../components/PostedAdvertsView.jsx";
import {Box} from "@mui/material";

const SeeMore = () => {

    return (
        <Box>
            <GuestHeader displayLoginButton={true}/>
            <PostedAdvertsView/>
        </Box>
    );
}

export default SeeMore;