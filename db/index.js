const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

<<<<<<< HEAD
/*
=======
/*-----Only for local-----
>>>>>>> ff6c3484a17e391c8863db286d99178cbdf901f1
const client = new Client({
    connectionString: process.env.LOCAL_DB,
    ssl: false
});
*/

client.connect();

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
};
