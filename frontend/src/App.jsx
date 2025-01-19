import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import SeeMore from "./pages/SeeMore.jsx";
import SeeMoreForLoggedUser from "./pages/SeeMoreForLoggedUser.jsx";
import AddAdvert from "./pages/AddAdvert.jsx";
import EditAdvert from "./pages/EditAdvert.jsx";
import {useAuthStore} from "./store/useAuthStore.js";
import {useEffect} from "react";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Loading from "./components/Loading.jsx";
import LoggedOutInfo from "./components/LoggedOutInfo.jsx";
import EditAccount from "./pages/EditAccount.jsx";
import TablesViewNo1 from "./pages/TablesViewNo1.jsx";
import TablesViewNo2 from "./pages/TablesViewNo2.jsx";

const App = () => {
    const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <Loading/>;
    }

    return (<Router>
        <Routes>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/see-more" element={<SeeMore/>}/>

            <Route path="/see-more-logged"
                   element={authUser ? <SeeMoreForLoggedUser/> : <LoggedOutInfo/>}/>
            <Route path="/add-advert-logged"
                   element={authUser ? <AddAdvert/> : <LoggedOutInfo/>}/>
            <Route path="/edit-advert-logged"
                   element={authUser ? <EditAdvert/> : <LoggedOutInfo/>}/>
            <Route path="/edit-account-logged"
                   element={authUser ? <EditAccount/> : <LoggedOutInfo/>}/>
            <Route path="/dashboard"
                   element={(authUser) && (authUser.IdRole === 1) ? <AdminDashboard/> : <LoggedOutInfo/>}/>
            <Route path="/dashboard-view-1st"
                   element={(authUser) && (authUser.IdRole === 1) ? <TablesViewNo1/> : <LoggedOutInfo/>}/>
            <Route path="/dashboard-view-2nd"
                   element={(authUser) && (authUser.IdRole === 1) ? <TablesViewNo2/> : <LoggedOutInfo/>}/>
        </Routes>
    </Router>);
};

export default App;
