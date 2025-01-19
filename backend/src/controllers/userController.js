import {connectionPool} from "../lib/dbUtil.js";
import sql from "mssql";

export const getUserDetails = async (req, res) => {
    const idUserFromParam = Number(req.params.idUser);
    const idUserFromToken = Number(req.user.recordset[0].IdUser);

    if (idUserFromToken !== idUserFromParam) {
        return res.status(401).send("You cannot access data that is not assigned to you!");
    }

    if (isNaN(idUserFromParam) || idUserFromParam <= 0) {
        return res.status(400).json("IdUser cannot be less than or equal to 0!");
    }

    const connection = await connectionPool;

    const result = await connection.request()
        .input("IdUser", idUserFromParam)
        .query("SELECT PhoneNumber FROM [User] WHERE IdUser = @IdUser");

    res.status(200).json(result.recordset[0]);
}

export const modifyUserDetails = async (req, res) => {
    let connection;
    let transaction;

    try {
        const idUser = Number(req.params.idUser);
        const phoneNumber = req.body.PhoneNumber;

        if (Object.keys(phoneNumber).length === 0) {
            return res.status(400).json({message: "No fields to update!"});
        }

        connection = await connectionPool;

        const isPhoneNumberTaken = await connection
            .request()
            .input("PhoneNumber", phoneNumber)
            .query(`SELECT 1
                    FROM [User]
                    WHERE PhoneNumber = @PhoneNumber`);

        if (isPhoneNumberTaken.recordset.length !== 0) {
            return res.status(400).json({message: "Someone already has this phone number!"});
        }

        transaction = new sql.Transaction(connection);

        await transaction.begin();

        await transaction
            .request()
            .input("IdUser", idUser)
            .input("PhoneNumber", phoneNumber)
            .query(`UPDATE [USER]
                    SET PhoneNumber = @PhoneNumber
                    WHERE IdUser = @IdUser`);

        await transaction.commit();
        res.status(201).json({message: "User data updated successfully!"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error updating advert:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const getAllUsersJoinedWithTables = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;

        if (isNaN(page) || page <= 0 || isNaN(pageSize) || pageSize <= 0) {
            return res.status(400).json("Page and pageSize must be positive numbers!");
        }

        const offset = (page - 1) * pageSize;

        const connection = await connectionPool;

        const paginatedUsersWithJoins = await connection
            .request()
            .input("offset", offset)
            .input("pageSize", pageSize)
            .query(`
                WITH PaginatedUsersWithJoins AS (SELECT u.IdUser                              AS IdUser,
                                                        u.FirstName                           AS FirstName,
                                                        u.LastName                            AS LastName,
                                                        u.PhoneNumber                         AS PhoneNumber,
                                                        u.Password                            AS Password,
                                                        r.Name                                AS RoleName,
                                                        STRING_AGG(s.Name, ', ')              AS Skills,
                                                        ROW_NUMBER() OVER (ORDER BY u.IdUser) AS RowNum
                                                 FROM [User] u
                                                          JOIN Role r ON r.IdRole = u.IdRole
                                                          JOIN UserSkill us ON us.IdUser = u.IdUser
                                                          JOIN Skill s ON s.IdSkill = us.IdSkill
                                                 GROUP BY u.IdUser, u.FirstName, u.LastName, u.PhoneNumber,
                                                          u.Password, r.Name)

                SELECT *
                FROM PaginatedUsersWithJoins
                WHERE RowNum BETWEEN @offset + 1 AND @offset + @pageSize
            `);

        const countResult = await connection
            .request()
            .query(`
                SELECT COUNT(*) AS Count
                FROM Advert
            `);

        const totalCount = parseInt(countResult.recordset[0].Count, 10);

        res.json({
            data: paginatedUsersWithJoins.recordset,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    } catch (error) {
        console.error("Error fetching adverts: ", error);
        res.status(500).send("Internal Server Error");
    }

}

export const deleteUserJoinedWithTables = async (req, res) => {
    const idUser = req.params.idUser;

    let connection;
    let transaction;

    try {
        connection = await connectionPool;
        transaction = new sql.Transaction(connection);

        await transaction.begin();

        const result = await transaction.request()
            .input("IdUser", sql.Int, idUser)
            .query(`SELECT IdAdvert
                    FROM UserAdvert
                    WHERE IdUser = @IdUser`);

        if (result.recordset.length > 0) {
            await transaction.request()
                .input("IdUser", sql.Int, idUser)
                .query(`DELETE
                        FROM UserAdvert
                        WHERE IdUser = @IdUser`);

            for (const advert of result.recordset) {
                const idAdvert = Number(advert.IdAdvert);

                await transaction.request()
                    .input("IdAdvert", sql.Int, idAdvert)
                    .query(`DELETE
                            FROM Advert
                            WHERE IdAdvert = @IdAdvert`);
            }
        }

        await transaction.request()
            .input("IdUser", sql.Int, idUser)
            .query(`DELETE
                    FROM UserSkill
                    WHERE IdUser = @IdUser`);

        await transaction.request()
            .input("IdUser", sql.Int, idUser)
            .query(`DELETE
                    FROM [User]
                    WHERE IdUser = @IdUser`);

        await transaction.commit();
        res.status(201).json({message: "User associated data deleted successfully"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error deleting user related data: ", error);
        res.status(500).send("Internal Server Error");
    }
}