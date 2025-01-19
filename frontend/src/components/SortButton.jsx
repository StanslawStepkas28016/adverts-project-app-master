import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {MenuBase} from "./MenuBase.jsx";
import {useState} from "react";
import PropTypes from "prop-types";

const SortButton = ({ onSort }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSortOption = (sortBy, order) => {
        onSort(sortBy, order);
        handleClose();
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ m: 2 }}
            >
                Sort options
            </Button>
            <MenuBase
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleSortOption("Price", "DESC")}>
                    <ArrowDownwardIcon />
                    Sort by price descending
                </MenuItem>

                <MenuItem onClick={() => handleSortOption("Price", "ASC")}>
                    <ArrowUpwardIcon />
                    Sort by price ascending
                </MenuItem>

                <MenuItem onClick={() => handleSortOption("WaitTime", "DESC")}>
                    <ArrowDownwardIcon />
                    Sort by wait time descending
                </MenuItem>

                <MenuItem onClick={() => handleSortOption("WaitTime", "ASC")}>
                    <ArrowUpwardIcon />
                    Sort by wait time ascending
                </MenuItem>
            </MenuBase>
        </div>
    );
};

SortButton.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default SortButton;