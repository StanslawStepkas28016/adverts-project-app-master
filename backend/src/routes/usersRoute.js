import express from "express";
import {connectionPool} from "../lib/dbUtil.js";
import {protectRouteForAdmin, protectRouteForLoggedUser} from "../middlewares/authMiddleware.js";
import sql from "mssql";
import {
    deleteUserJoinedWithTables,
    getAllUsersJoinedWithTables, getUserDetails,
    modifyUserDetails
} from "../controllers/userController.js";

const router = express.Router();

// Pozyskanie danych do modyfikacji (w tym przypadku numer telefonu użytkownika)
router.get("/:idUser(\\d+)", protectRouteForLoggedUser, getUserDetails);

// Modyfikacja danych użytkownika (numer telefonu).
router.patch("/:idUser", protectRouteForLoggedUser, modifyUserDetails);

// Połączenie tabel User, Role, UserSkill, Skill
router.get("/joined-data", protectRouteForAdmin, getAllUsersJoinedWithTables);

// Usuniecie danych użytkownika razem z powiązanymi tabelami
router.delete("/joined-data/:idUser", protectRouteForAdmin, deleteUserJoinedWithTables);

export default router;