import sql from "mssql";
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false, // Ma być false, jeśli korzystam z dockera
        enableArithAbort: true, // Chodzi o kontrolowanie błędów arytmetycznych typu dzielenie przez zero itd.
    }
};

export const connectionPool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to the database");
        return pool;
    })
    .catch(err => console.error("Database Connection Failed: ", err));