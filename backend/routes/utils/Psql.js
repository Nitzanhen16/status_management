const { Pool } = require('pg');
require("dotenv").config();


const config={
    connectionLimit: 4,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}
const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const connection = () => {
    return new Promise((resolve, reject) => {
        pool.connect((err, client) => {
            if (err) {
                reject(err);
            }
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    client.query(sql, binding, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(`Released connection: processID ${client.processID}`);
                    resolve(client.release());
                });
            };
            resolve({ query, release });
        });
    });
};

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = { pool, connection, query };







