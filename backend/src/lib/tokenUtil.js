import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, roleId, res) => {
    const token = jwt.sign({userId, roleId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni (w ms)
        httpOnly: true, // Przeciwko XSS (cross-site scripting attacks)
        sameSite: "strict", // Przeciwko CSRF (cross-site request forgery attacks)
        secure: false, // Na produkcji by było true, bo https, ale na local hoście jest http
    });

    return token;
};
