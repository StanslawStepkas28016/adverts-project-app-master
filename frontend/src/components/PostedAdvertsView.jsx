import {useEffect, useState} from "react";
import "../styles/Global.css"
import "../styles/SeeMore.css"
import {useAuthStore} from "../store/useAuthStore.js";
import {axiosInstance} from "../lib/axios.js";
import {Alert, Box, Pagination, Typography} from "@mui/material";
import SortButton from "./SortButton.jsx";
import Advert from "./Advert";
import Loading from "./Loading";
import AlertBox from "./AlertBox.jsx";

const PAGES_TO_FETCH = 1;
const LIMIT_PER_PAGE = 5;

const PostedAdvertsView = () => {
    const [adverts, setAdverts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("WaitTime");
    const [order, setOrder] = useState("ASC");
    const [displayLogInfo, setDisplayLogInfo] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const {authUser} = useAuthStore();

    useEffect(() => {
        getAdverts(PAGES_TO_FETCH, LIMIT_PER_PAGE); // Do tylko jednej strony, podczas ładowania pierwszego komponentu
    }, [sortBy, order]);


    useEffect(() => {
        setDisplayLogInfo(!!authUser);
    }, [authUser])

    const getAdverts = async (page = PAGES_TO_FETCH, limit = LIMIT_PER_PAGE) => {
        setAdverts([]);
        try {
            const res = await axiosInstance.get(`adverts/details?page=${page}&limit=${limit}&sort=${sortBy}&order=${order}`);
            setAdverts(res.data.adverts);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    const handlePageClick = async (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            await getAdverts(page, LIMIT_PER_PAGE);
        }
    };

    const handleSort = (sortBy, sortOrder) => {
        setSortBy(sortBy);
        setOrder(sortOrder);
    }

    if (!adverts) {
        return <Loading/>;
    }

    return (
        <Box>
            {errorMessage ? (
                <AlertBox>
                    <Alert severity="error" sx={{m: 10}}>
                        {errorMessage}
                    </Alert>
                </AlertBox>
            ) : adverts.length === 0 ? (
                <AlertBox>
                    <Alert severity="info" sx={{m: 5}}>
                        No adverts available
                    </Alert>
                </AlertBox>
            ) : (
                <Box>
                    <Typography variant="h3" sx={{m: 5, mb: -3}}>
                        Adverts posted by engineers
                    </Typography>

                    <Box sx={{mt: 5, mb: 2}}>
                        <SortButton onSort={handleSort}/>
                    </Box>

                    <Box>
                        {adverts.map((advert) => (
                            <div key={advert.IdAdvert}>
                                <Advert advertData={advert}/>
                            </div>
                        ))}
                    </Box>

                    {!displayLogInfo && (
                        <Typography variant="h5" sx={{m: 5}}>
                            Want to publish an ad? <br/> Please log in first!
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => handlePageClick(value)}
                            color="secondary"
                            variant="outlined"
                            shape="rounded"
                            size="large"
                            sx={{
                                mb: 2,
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default PostedAdvertsView;