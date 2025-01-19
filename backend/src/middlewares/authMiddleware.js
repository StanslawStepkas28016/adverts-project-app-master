import jwt from "jsonwebtoken";
import {connectionPool} from "../lib/dbUtil.js";

export const protectRouteForAnyUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        }

        const connection = await connectionPool;

        const user = await connection.request()
            .input("IdUser", decoded.userId)
            .query(`SELECT IdUser, FirstName, LastName, IdRole
                    FROM [User]
                    WHERE IdUser = @IdUser`);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRouteForAnyUser middleware: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const protectRouteForAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        }

        if (decoded.roleId !== 1) {
            return res.status(401).json({message: "You are not an admin, you are unauthorized!"});
        }

        const connection = await connectionPool;

        const user = await connection.request()
            .input("IdUser", decoded.userId)
            .query(`SELECT IdUser, FirstName, LastName, IdRole
                    FROM [User]
                    WHERE IdUser = @IdUser`);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRouteForAdmin middleware: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
