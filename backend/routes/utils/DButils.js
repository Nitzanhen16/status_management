require("dotenv").config();
const Psql = require("./Psql");

exports.execQuery = async function (query) {
    let returnValue = []
    const connection = await Psql.connection();
    try {
        await connection.query("BEGIN;");
        returnValue = await connection.query(query);
        await connection.query("COMMIT;");
    } catch (err) {
        await connection.query("ROLLBACK");
        console.log('ROLLBACK at querySignUp', err);
        throw err;
    } finally {
        await connection.release();
    }
    return returnValue
}

