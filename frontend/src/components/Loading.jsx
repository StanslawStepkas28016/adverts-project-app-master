import {Box, CircularProgress} from "@mui/material";

const Loading = () => {
    return (
        <Box>
            <CircularProgress color="secondary" size={50} sx={{
                m: 55
            }}/>
        </Box>
    );
}

export default Loading;