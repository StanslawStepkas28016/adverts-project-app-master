import express from "express";
import bcrypt from "bcrypt";
import {connectionPool} from "../lib/dbUtil.js";
import {generateToken} from "../lib/tokenUtil.js";
import {protectRouteForLoggedUser} from "../middlewares/authMiddleware.js";
import sql from "mssql";
import {changePassword, checkAuthSuccess, login, logout, register, registerAdmin} from "../controllers/authController.js";

const router = express.Router();

// Rejestracja użytkownika
router.post("/register", register);

// Rejestracja administratora
router.post("/register-admin", registerAdmin);

// Logowanie
router.post("/login", login);

// Wylogowanie
router.post("/logout", protectRouteForLoggedUser, logout);

// Zmiana hasła
router.post("/change-password", protectRouteForLoggedUser, changePassword);

// Zwrócenie wiadomości potwierdzającej zalogowanie użytkownika (korzysta z middleware'u),
// jeśli middleware nie zwróci kodu 401, oznacza to, że użytkownik posiada ważny token,
// wówczas zwracany jest kod 200
router.get("/check", protectRouteForLoggedUser, checkAuthSuccess);

export default router;