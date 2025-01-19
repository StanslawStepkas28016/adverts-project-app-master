import LoggedHeader from "../components/LoggedHeader.jsx";
import UserAdvertsView from "../components/UserAdvertsView.jsx";
import PostedAdvertsView from "../components/PostedAdvertsView.jsx";
import Divider from "@mui/material/Divider";

const SeeMoreForLoggedUser = () => {
    return (<div>
        <LoggedHeader/>
        <UserAdvertsView/>
        <Divider sx={{m: 4}}/>
        <PostedAdvertsView/>
    </div>);
}

export default SeeMoreForLoggedUser;