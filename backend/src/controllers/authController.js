import {connectionPool} from "../lib/dbUtil.js";
import bcrypt from "bcrypt";
import sql from "mssql";
import {generateToken} from "../lib/tokenUtil.js";

export const register = async (req, res) => {
    const {Login, Password, FirstName, LastName, PhoneNumber, Skills} = req.body;

    let connection;
    let transaction;

    try {
        connection = await connectionPool;

        const doesUserAlreadyExist = await connection
            .request()
            .input("Login", Login)
            .query(`SELECT 1
                    FROM [User]
                    WHERE Login = @login`);

        if (doesUserAlreadyExist.recordset.length !== 0) {
            return res.status(400).json({message: "User with the specified login already exists!"});
        }

        const isPhoneNumberTaken = await connection
            .request()
            .input("PhoneNumber", PhoneNumber)
            .query(`SELECT 1
                    FROM [User]
                    WHERE PhoneNumber = @PhoneNumber`);

        if (isPhoneNumberTaken.recordset.length !== 0) {
            return res.status(400).json({message: "Someone already has this phone number!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        transaction = new sql.Transaction(connection);

        await transaction.begin();
        const newUser = await
            transaction.request()
                .input("FirstName", FirstName)
                .input("LastName", LastName)
                .input("PhoneNumber", PhoneNumber)
                .input("Login", Login)
                .input("Password", hashedPassword)
                .input("IdRole", 2)
                .query(`INSERT INTO [User] (FirstName, LastName, PhoneNumber, Login, Password, IdRole)
                        OUTPUT INSERTED.IdUser
                        VALUES (@FirstName, @LastName, @PhoneNumber, @Login, @Password, @IdRole)`);

        const newUserId = newUser.recordset[0].IdUser;

        for (const IdSkill of Skills) {
            await transaction.request()
                .input("IdSkill", IdSkill)
                .input("IdUser", newUserId)
                .query(`INSERT INTO UserSkill (IdUser, IdSkill)
                        VALUES (@IdUser, @IdSkill)`);
        }

        await transaction.commit();
        res.status(200).json(newUserId);
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

export const registerAdmin = async (req, res) => {
    const {Login, Password, FirstName, LastName, PhoneNumber, Skills, SecretForAdmin} = req.body;

    if (SecretForAdmin !== process.env.ADMIN_SECRET) {
        res.status(401).json({message: "Invalid Credentials"});
    }

    let connection;
    let transaction;

    try {
        connection = await connectionPool;

        // Sprawdzenie, czy użytkownik o podanym loginie już istnieje.
        const doesUserAlreadyExist = await
            connection.request()
                .input("Login", Login)
                .query(`SELECT 1
                        FROM [User]
                        WHERE Login = @Login`);

        if (doesUserAlreadyExist.recordset.length !== 0) {
            return res.status(400).json({message: "User already exists!"});
        }

        transaction = new sql.Transaction(connection);
        await transaction.begin();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await
            transaction.request()
                .input("FirstName", FirstName)
                .input("LastName", LastName)
                .input("PhoneNumber", PhoneNumber)
                .input("Login", Login)
                .input("Password", hashedPassword)
                .input("IdRole", 1)
                .query(`INSERT INTO [User] (FirstName, LastName, PhoneNumber, Login, Password, IdRole)
                        OUTPUT INSERTED.IdUser
                        VALUES (@FirstName, @LastName, @PhoneNumber, @Login, @Password, @IdRole)`);

        const newUserId = newUser.recordset[0].IdUser;

        for (const IdSkill of Skills) {
            await transaction.request()
                .input("IdSkill", IdSkill)
                .input("IdUser", newUserId)
                .query(`INSERT INTO UserSkill (IdUser, IdSkill)
                        VALUES (@IdUser, @IdSkill)`);
        }

        await transaction.commit();

        res.status(200).json(newUserId);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({message: "Internal server error! " + error.message});
    }
}

export const login = async (req, res) => {
    const {Login, Password} = req.body;

    try {
        const connection = await connectionPool;

        // Sprawdzenie, czy użytkownik o podanym loginie w ogóle istnieje.
        const userResult = await
            connection.request()
                .input("Login", Login)
                .query(`SELECT IdUser, Password, IdRole, FirstName, LastName
                        FROM [User]
                        WHERE Login = @Login`);

        if (userResult.recordset.length === 0) {
            return res.status(400).json({message: "User with the specified login does not exist!"});
        }

        let user = userResult.recordset[0];

        // Sprawdzenie, czy hasło jest poprawne.
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid password!"});
        }

        generateToken(user.IdUser, user.IdRole, res); // Stworzenie tokenu i zwrócenie go w postaci pliku cookie

        res.status(200).json(
            {
                IdUser: user.IdUser,
                FirstName: user.FirstName,
                LastName: user.LastName,
                IdRole: user.IdRole,
            }
        );
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({message: "Internal server error! " + error.message});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuthSuccess = async (req, res) => {
    try {
        res.status(200).json(req.user.recordset[0]);
    } catch (error) {
        console.log("Error in check", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const changePassword = async (req, res) => {
    const {IdUser, Password, NewPassword} = req.body;

    // Sprawdzenie, czy użytkownik nie wykradł pliku cookie i modyfikuje nie swój zasób
    const idUserFromBody = Number(IdUser);
    const idUserFromToken = Number(req.user.recordset[0].IdUser);

    if (idUserFromBody !== idUserFromToken) {
        return res.status(401).json({message: "You cannot modify data that is not assigned to you!"});
    }

    let connection;
    let transaction;

    try {
        connection = await connectionPool;
        transaction = new sql.Transaction(connection);

        const userResult = await
            connection.request()
                .input("IdUser", IdUser)
                .query(`SELECT Password
                        FROM [User]
                        WHERE IdUser = @IdUser`);


        let user = userResult.recordset[0];

        // Sprawdzenie, czy hasło jest poprawne.
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (!isPasswordValid) {
            return res.status(400).json({message: "The current password you provided is invalid!"});
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(NewPassword, salt);

        await transaction.begin();

        await transaction.request()
            .input("Password", newPassword)
            .input("IdUser", IdUser)
            .query(`UPDATE [User]
                    SET Password = @Password
                    WHERE IdUser = @IdUser`);

        await transaction.commit();

        res.status(200).json(
            {
                message: "Password changed successfully!"
            }
        );
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.log(error);
        console.log(error.message);
        res.status(500).json({message: "Internal server error! " + error.message});
    }
}