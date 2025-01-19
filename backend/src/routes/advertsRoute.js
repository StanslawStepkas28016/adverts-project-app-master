import express from "express";
import sql from "mssql"
import {connectionPool} from "../lib/dbUtil.js";
import {protectRouteForAdmin, protectRouteForAnyUser} from "../middlewares/authMiddleware.js";
import {
    addSingleAdvert, deleteAdvertJoinedWithTables, deleteSingleAdvert,
    getAllAdvertsDetailsPaginated, getAllAdvertsJoinedWithTables,
    getAllAdvertsSummary,
    getUserAdvertsDetails, modifySingleAdvert
} from "../controllers/advertsController.js";

const router = express.Router();

// Dodanie ogłoszenia
router.post("/", protectRouteForAnyUser, addSingleAdvert);

// Podsumowanie wszystkich ogłoszeń (z możliwością ustalenia ilości pobieranych rekordów)
router.get("/summary", getAllAdvertsSummary);

// Detale wszystkich ogłoszeń, dodatkowo paginowane
router.get("/details", getAllAdvertsDetailsPaginated);

// Detale jednego ogłoszenia, po id użytkownika
router.get("/details/:idUser", protectRouteForAnyUser, getUserAdvertsDetails);

// Połączenie tabel (Advert, Type, UserAdvert, Status)
router.get("/joined-data", protectRouteForAdmin, getAllAdvertsJoinedWithTables);

// Edycja danych w pojedynczym ogłoszeniu
router.patch("/:idAdvert", protectRouteForAnyUser, modifySingleAdvert);

// Usunięcie danych pojedynczego ogłoszenia
router.delete("/:idAdvert", protectRouteForAnyUser, deleteSingleAdvert);

// Usunięcie danych z połączeń tabel (Advert, Type, UserAdvert, Status) - ze względu na logikę biznesową,
// usuwane są dane z tabel Advert oraz UserAdvert
router.delete("/joined-data/:idAdvert", protectRouteForAnyUser, deleteAdvertJoinedWithTables);

export default router;