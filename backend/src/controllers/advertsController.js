import {connectionPool} from "../lib/dbUtil.js";
import sql from "mssql";

export const getAllAdvertsSummary = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 6;

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json("Limit cannot be less than or equal to 0!");
        }

        const connection = await connectionPool;

        const result = await connection
            .request()
            .input("limit", limit)
            .query(`SELECT TOP (@limit) u.IdUser as IdUser, u.FirstName, u.LastName, t.Name as Type, a.Description
                    FROM [User] u
                             JOIN UserAdvert ua ON u.IdUser = ua.IdUser
                             JOIN Advert a ON ua.IdAdvert = a.IdAdvert
                             JOIN Type t ON a.IdType = t.IdType`);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error fetching adverts summary: ", err);
        res.status(500).send("Internal Server Error");
    }
}

export const getAllAdvertsDetailsPaginated = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1; // Obecna strona
        const pageSize = parseInt(req.query.limit) || 3; // Ilość ogłoszeń na jedną stronę
        const sort = req.query.sort;
        const order = req.query.order;

        const connection = await connectionPool;

        const advertsCount = await connection
            .request()
            .query(`SELECT COUNT(*) AS Count
                    FROM Advert`);

        const totalAdverts = parseInt(advertsCount.recordset[0].Count); // Łączna liczba ogłoszeń
        const pageOffset = (currentPage - 1) * pageSize; // Offset strony, do "fetchowania" danych na kolejnych stronach

        // Przykładowe dane, do tłumaczenia tej zawiłej paginacji:
        // currentPage = 2
        // pageSize = 5
        // pageOffset = (2 - 1) * 5 = 5
        // BETWEEN 6 AND 10
        const paginatedAdverts = await connection
            .request()
            .query(`
                WITH PaginatedResult AS (SELECT a.IdAdvert                                    AS IdAdvert,
                                                FirstName,
                                                LastName,
                                                STRING_AGG(s.Name, ', ')                      AS Skills,
                                                t.Name                                        AS Type,
                                                a.Description,
                                                a.Price,
                                                a.WaitTime,
                                                PhoneNumber,
                                                stat.Name                                     AS Status,
                                                ROW_NUMBER() OVER (ORDER BY ${sort} ${order}) AS RowNum
                                         FROM [User] u
                                                  JOIN UserSkill us
                                                       ON u.IdUser = us.IdUser
                                                  JOIN Skill s ON s.IdSkill = us.IdSkill
                                                  JOIN UserAdvert ua ON ua.IdUser = u.IdUser
                                                  JOIN Status stat ON ua.IdStatus = stat.IdStatus
                                                  JOIN Advert a ON ua.IdAdvert = a.IdAdvert
                                                  JOIN Type t ON a.IdType = t.IdType
                                         GROUP BY u.FirstName, u.LastName, t.Name, a.Description, a.Price, a.WaitTime,
                                                  u.PhoneNumber, stat.Name, a.IdAdvert)

                SELECT *
                FROM PaginatedResult
                WHERE RowNum BETWEEN ${pageOffset + 1} AND ${pageOffset + pageSize}`);

        const totalPages = Math.ceil(totalAdverts / pageSize); // Łączna ilość stron

        res.status(200).json({
            adverts: paginatedAdverts.recordset,
            currentPage: currentPage,
            totalPages: totalPages,
            totalAdverts: totalAdverts,
            pageSize: pageSize
        });
    } catch (err) {
        console.error("Error fetching adverts details: ", err);
        res.status(500).send("Internal Server Error");
    }
}

export const addSingleAdvert = async (req, res) => {
    let connection;
    let transaction;

    try {
        const {IdUser, IdType, Description, Price, WaitTime} = req.body;

        if (!IdType || !Description || !Price || !WaitTime) {
            return res.status(400).json({message: "All fields are required!"});
        }

        connection = await connectionPool;

        const hasAdvertOfSpecifiedType = await connection
            .request()
            .input("IdUser", sql.Int, IdUser)
            .input("IdType", sql.Int, IdType)
            .query(`SELECT 1
                    FROM UserAdvert ua
                             JOIN Advert a ON ua.IdAdvert = a.IdAdvert
                    WHERE ua.IdUser = @IdUser
                      AND a.IdType = @IdType`);

        if (hasAdvertOfSpecifiedType.recordset.length !== 0) {
            return res.status(400).json({message: "You already have the advert of this type, choose another type!"});
        }

        transaction = new sql.Transaction(connection);
        await transaction.begin();

        const result = await transaction
            .request()
            .input("IdType", sql.Int, IdType)
            .input("Description", sql.VarChar(500), Description)
            .input("Price", sql.Money, Price)
            .input("WaitTime", sql.Int, WaitTime)
            .query(`
                INSERT INTO Advert (IdType, Description, Price, WaitTime)
                OUTPUT INSERTED.IdAdvert
                VALUES (@IdType, @Description, @Price, @WaitTime)
            `);

        const IdAdvert = result.recordset[0].IdAdvert;

        await transaction
            .request()
            .input("IdUser", sql.Int, IdUser)
            .input("IdAdvert", sql.Int, IdAdvert)
            .query(`
                INSERT INTO UserAdvert (IdUser, IdAdvert, IdStatus)
                VALUES (@IdUser, @IdAdvert, 1)
            `);

        await transaction.commit();
        res.status(201).json({message: "Advert created successfully", IdAdvert});
    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error("Error adding advert:", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteSingleAdvert = async (req, res) => {
    const idAdvert = req.params.idAdvert;

    if (!idAdvert) {
        return res.status(400).json({message: "No idAdvert provided!"});
    }

    let connection;
    let transaction;

    try {
        connection = await connectionPool;
        transaction = new sql.Transaction(connection);

        await transaction.begin();

        await transaction.request()
            .input("IdAdvert", idAdvert)
            .query(`DELETE
                    FROM UserAdvert
                    WHERE IdAdvert = @IdAdvert`);

        await transaction.request()
            .input("IdAdvert", idAdvert)
            .query(`DELETE
                    FROM Advert
                    WHERE IdAdvert = @IdAdvert`);

        await transaction.commit();
        res.status(201).json({message: "Advert deleted successfully!"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error deleting advert:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getUserAdvertsDetails = async (req, res) => {
    try {
        const id = req.params.idUser;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json("IdUser is NaN or below 0!");
        }

        const connection = await connectionPool;
        const result = await connection
            .request()
            .input("IdUser", sql.Int, id)
            .query(`SELECT a.IdAdvert               AS IdAdvert,
                           FirstName,
                           LastName,
                           STRING_AGG(s.Name, ', ') AS Skills,
                           t.IdType,
                           t.Name                   AS Type,
                           a.Description,
                           a.Price,
                           a.WaitTime,
                           PhoneNumber,
                           stat.IdStatus,
                           stat.Name                AS Status
                    FROM [User] u
                             JOIN UserSkill us
                                  ON u.IdUser = us.IdUser
                             JOIN Skill s ON s.IdSkill = us.IdSkill
                             JOIN UserAdvert ua ON ua.IdUser = u.IdUser
                             JOIN Status stat ON ua.IdStatus = stat.IdStatus
                             JOIN Advert a ON ua.IdAdvert = a.IdAdvert
                             JOIN Type t ON a.IdType = t.IdType
                    WHERE u.IdUser = (@IdUser)
                    GROUP BY a.IdAdvert, FirstName, LastName, t.Name, a.Description, a.Price, a.WaitTime, PhoneNumber,
                             stat.Name, stat.IdStatus, t.IdType`);

        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching advert assigned to the user with the Id!", err);
        res.status(500).send("Internal Server Error");
    }
}

export const modifySingleAdvert = async (req, res) => {
    let connection;
    let transaction;

    try {
        const idAdvertFromParams = req.params.idAdvert;
        const updates = req.body;

        if (!idAdvertFromParams) {
            return res.status(400).json({message: "Missing advert ID"});
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({message: "No fields to update"});
        }

        connection = await connectionPool;
        transaction = new sql.Transaction(connection);
        await transaction.begin();

        // Dla innej tabeli UserAdvert, dlatego if, jeśli w requescie się znajdzie
        if ("IdStatus" in updates) {
            const userAdvertRequest = transaction.request();

            userAdvertRequest.input("IdStatus", sql.Int, updates.IdStatus);
            userAdvertRequest.input("IdAdvert", sql.Int, idAdvertFromParams);

            await userAdvertRequest.query(`
                UPDATE UserAdvert
                SET IdStatus = @IdStatus
                WHERE IdAdvert = @IdAdvert
            `);

            delete updates.IdStatus;
        }

        if (Object.keys(updates).length > 0) {
            const updateFields = Object.keys(updates)
                .map((key) => `${key} = @${key}`)
                .join(", ");

            const advertRequest = transaction.request();

            Object.entries(updates).forEach(([key, value]) => {
                advertRequest.input(key, value);
            });

            advertRequest.input("IdAdvert", sql.Int, idAdvertFromParams);

            await advertRequest.query(`
                UPDATE Advert
                SET ${updateFields}
                WHERE IdAdvert = @IdAdvert
            `);
        }

        await transaction.commit();
        res.status(201).json({message: "Advert updated successfully", idAdvert: idAdvertFromParams});
    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error("Error updating advert:", err);
        res.status(500).send("Internal Server Error");
    }
}

export const getAllAdvertsJoinedWithTables = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;

        if (isNaN(page) || page <= 0 || isNaN(pageSize) || pageSize <= 0) {
            return res.status(400).json("Page and pageSize must be positive numbers!");
        }

        const offset = (page - 1) * pageSize;

        const connection = await connectionPool;

        const paginatedAdverts = await connection
            .request()
            .input("offset", offset)
            .input("pageSize", pageSize)
            .query(`
                WITH PaginatedAdverts AS (SELECT a.IdAdvert                              AS IdAdvert,
                                                 a.Description                           AS Description,
                                                 a.WaitTime                              AS WaitTime,
                                                 a.Price                                 AS Price,
                                                 t.Name                                  AS TypeName,
                                                 ua.IdUser                               AS IdUser,
                                                 s.Name                                  AS StatusName,
                                                 ROW_NUMBER() OVER (ORDER BY a.IdAdvert) AS RowNum
                                          FROM Advert a
                                                   JOIN Type t ON a.IdType = t.IdType
                                                   JOIN UserAdvert ua ON a.IdAdvert = ua.IdAdvert
                                                   JOIN Status s ON ua.IdStatus = s.IdStatus)

                SELECT *
                FROM PaginatedAdverts
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
            data: paginatedAdverts.recordset,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
        });
    } catch (err) {
        console.error("Error fetching adverts: ", err);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteAdvertJoinedWithTables = async (req, res) => {
    let connection;
    let transaction;

    try {
        const idAdvert = req.params.idAdvert;

        if (!idAdvert) {
            return res.status(400).json({message: "Missing advert ID"});
        }

        connection = await connectionPool;
        transaction = new sql.Transaction(connection);
        await transaction.begin();

        await transaction
            .request()
            .input("IdAdvert", sql.Int, idAdvert)
            .query(`DELETE
                    FROM UserAdvert
                    WHERE IdAdvert = @IdAdvert`);

        await transaction
            .request()
            .input("IdAdvert", sql.Int, idAdvert)
            .query(`DELETE
                    FROM Advert
                    WHERE IdAdvert = @IdAdvert`);

        await transaction.commit();
        res.status(201).json({message: "Advert associated data deleted successfully", idAdvert});
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error deleting advert:", error);
        res.status(500).send("Internal Server Error");
    }
}