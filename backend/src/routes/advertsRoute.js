import express from "express";
import sql from "mssql"
import {connectionPool} from "../lib/dbUtil.js";
import {protectRouteForAdmin, protectRouteForLoggedUser} from "../middlewares/authMiddleware.js";
import {
    addSingleAdvert, deleteAdvertJoinedWithTables, deleteSingleAdvert,
    getAllAdvertsDetailsPaginated, getAllAdvertsJoinedWithTables,
    getAllAdvertsSummary,
    getUserAdvertsDetails, modifySingleAdvert
} from "../controllers/advertsController.js";

const router = express.Router();

// Dodanie ogłoszenia
router.post("/", protectRouteForLoggedUser, addSingleAdvert);

// Podsumowanie wszystkich ogłoszeń (z możliwością ustalenia ilości pobieranych rekordów)
router.get("/summary", getAllAdvertsSummary);

// Detale wszystkich ogłoszeń, dodatkowo paginowane
router.get("/details", getAllAdvertsDetailsPaginated);

// Detale jednego ogłoszenia, po id użytkownika
router.get("/details/:idUser", protectRouteForLoggedUser, getUserAdvertsDetails);

// Połączenie tabel (Advert, Type, UserAdvert, Status)
router.get("/joined-data", protectRouteForAdmin, getAllAdvertsJoinedWithTables);

// Edycja danych w pojedynczym ogłoszeniu
router.patch("/:idAdvert", protectRouteForLoggedUser, modifySingleAdvert);

// Usunięcie danych pojedynczego ogłoszenia
router.delete("/:idAdvert", protectRouteForLoggedUser, deleteSingleAdvert);

// Usunięcie danych z połączeń tabel (Advert, Type, UserAdvert, Status) - ze względu na logikę biznesową,
// usuwane są dane z tabel Advert oraz UserAdvert
router.delete("/joined-data/:idAdvert", protectRouteForLoggedUser, deleteAdvertJoinedWithTables);

export default router;