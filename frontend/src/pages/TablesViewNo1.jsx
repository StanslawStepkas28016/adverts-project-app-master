import { useEffect, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { axiosInstance } from "../lib/axios.js";
import DeleteIcon from "@mui/icons-material/Delete";
import LoggedHeader from "../components/LoggedHeader.jsx";

const TablesViewNo1 = () => {
    const [adverts, setAdverts] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [sortModel, setSortModel] = useState([{ field: "IdAdvert", sort: "asc" }]);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 });

    useEffect(() => {
        getAdverts();
    }, [paginationModel]);

    useEffect(() => {
        sortData();
    }, [sortModel]);

    const getAdverts = async () => {
        setErrorMessage("");
        try {
            const response = await axiosInstance.get("/adverts/joined-data", {
                params: {
                    page: paginationModel.page + 1,
                    pageSize: paginationModel.pageSize,
                },
            });

            setAdverts(response.data.data);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            setErrorMessage("Failed to fetch adverts");
        }
    };

    const sortData = () => {
        if (sortModel.length === 0 || adverts.length === 0) return;

        const { field, sort } = sortModel[0];
        const sortedData = [...adverts].sort((a, b) => {
            if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
            if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
            return 0;
        });

        setAdverts(sortedData);
    };

    const handleDeleteRecord = async () => {
        setErrorMessage("");
        try {
            await axiosInstance.delete(`adverts/joined-data/${selectedRecordId}`);
            setSuccessMessage("Successfully deleted.");
            setSelectedRecordId(null);
            await getAdverts();
            setTimeout(() => setSuccessMessage(""), 1000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to delete the record");
        }
    };

    const columns = [
        { field: "IdAdvert", headerName: "IdAdvert", width: 120 },
        { field: "Description", headerName: "Description", width: 500 },
        { field: "WaitTime", headerName: "Wait Time", width: 150 },
        { field: "Price", headerName: "Price", width: 100 },
        { field: "TypeName", headerName: "Type", width: 120 },
        { field: "IdUser", headerName: "IdUser", width: 200 },
        { field: "StatusName", headerName: "Status", width: 500 },
    ];

    return (
        <Box>
            <LoggedHeader />
            <Typography variant="h3" sx={{ m: 5 }}>
                Advert, Type, Status, UserAdvert - Joined tables with the most important data
            </Typography>
            <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={adverts}
                    columns={columns}
                    paginationMode="server"
                    rowCount={totalCount}
                    pageSizeOptions={[5, 10, 15, 25, 35]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
                    sortModel={sortModel}
                    onSortModelChange={(newModel) => setSortModel(newModel)}
                    getRowId={(row) => row.IdAdvert}
                    loading={adverts.length === 0}
                    disableMultipleRowSelection={true}
                    onRowSelectionModelChange={(selectionModel) =>
                        setSelectedRecordId(selectionModel[0] || null)
                    }
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    mt: 5,
                }}
            >
                <Alert severity="info" sx={{ m: 2 }}>
                    Important: Deleting a selected row is going to delete data from Advert, UserAdvert not affecting the
                    Type and Status Table (business logic).
                </Alert>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<DeleteIcon />}
                    onClick={handleDeleteRecord}
                    sx={{
                        width: "200px",
                    }}
                >
                    Delete selected row
                </Button>
                {successMessage && (
                    <Alert severity="success" sx={{ m: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default TablesViewNo1;
