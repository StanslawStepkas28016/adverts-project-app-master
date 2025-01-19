import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute.js";
import advertsRoutes from "./routes/advertsRoute.js";
import usersRoute from "./routes/usersRoute.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/adverts", advertsRoutes);
app.use("/api/users", usersRoute);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});