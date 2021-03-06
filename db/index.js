const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

/* Dev database connection obj
const client = new Client({
    connectionString: process.env.LOCAL_DB,
    ssl: false
});*/

client.connect();

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
};
