import {Alert, Box, Button, Typography} from "@mui/material";
import LoggedHeader from "../components/LoggedHeader.jsx";
import {useEffect, useState} from "react";
import {axiosInstance} from "../lib/axios.js";
import {DataGrid} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

const TablesViewNo2 = () => {
    const [setTablesData, setSetTablesData] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const [selectedRecordId, setSelectedRecordId] = useState(null);

    const [sortModel, setSortModel] = useState([
        {field: "IdUser", sort: "asc"},
    ]);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    useEffect(() => {
        getUsers();
    }, [paginationModel]);

    useEffect(() => {
        sortData();
    }, [sortModel]);

    const getUsers = async () => {
        setErrorMessage("");
        try {
            const response = await axiosInstance.get("/users/joined-data/", {
                params: {
                    page: paginationModel.page + 1,
                    pageSize: paginationModel.pageSize,
                },
            });

            setSetTablesData(response.data.data);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to fetch adverts");
        }
    };

    const sortData = () => {
        if (sortModel.length === 0 || setTablesData.length === 0) return;

        const {field, sort} = sortModel[0];

        const sortedData = [...setTablesData].sort((a, b) => {
            if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
            if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
            return 0;
        });

        setSetTablesData(sortedData);
    };

    const handleDeleteRecord = async () => {
        if (!selectedRecordId) {
            return;
        }

        setErrorMessage("");

        try {
            await axiosInstance.delete(`/users/joined-data/${selectedRecordId}`);
            setSuccessMessage("Successfully deleted.");
            setSelectedRecordId(null);
            await getUsers();
            setTimeout(() => setSuccessMessage(""), 1000);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    const columns = [
        {field: "IdUser", headerName: "IdUser", width: 120},
        {field: "FirstName", headerName: "FirstName", width: 120},
        {field: "LastName", headerName: "LastName", width: 150},
        {field: "PhoneNumber", headerName: "PhoneNumber", width: 200},
        {field: "Password", headerName: "Password", width: 450},
        {field: "RoleName", headerName: "RoleName", width: 200},
        {field: "Skills", headerName: "Skills", width: 450},
    ];

    return (
        <Box>
            <LoggedHeader/>
            <Typography variant="h3" sx={{m: 5}}>
                User, Role, UserSkill, Skill - Joined tables with the most important data
            </Typography>
            <Box sx={{height: 500, width: "100%"}}>
                <DataGrid
                    rows={setTablesData}
                    columns={columns}
                    paginationMode="server"
                    rowCount={totalCount}
                    pageSizeOptions={[5, 10, 15, 25, 35]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
                    sortModel={sortModel}
                    onSortModelChange={(newModel) => setSortModel(newModel)}
                    getRowId={(row) => row.IdUser}
                    loading={setTablesData.length === 0}
                    disableMultipleRowSelection={true}
                    onRowSelectionModelChange={(selectionModel) =>
                        setSelectedRecordId(selectionModel[0] || null)
                    }
                />
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 5
            }}>
                <Alert severity="info" sx={{m: 2}}>
                    Important: Deleting a selected row is going to delete all User related data (User, UserAdvert,
                    Advert)
                    data except
                    deleting data from the following tables: Role, Skills, Type, Status (business logic).
                </Alert>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<DeleteIcon/>}
                    onClick={handleDeleteRecord}
                    sx={{
                        width: "200px",
                    }}
                >
                    Delete selected row
                </Button>
                {successMessage && (
                    <Alert severity="success" sx={{m: 2}}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" sx={{m: 2}}>
                        {errorMessage}
                    </Alert>
                )}
            </Box>
        </Box>
    );
}

export default TablesViewNo2;