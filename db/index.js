const { Client } = require("pg");

/*-----Only for prod-----
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
*/

const client = new Client({
    connectionString: process.env.LOCAL_DB,
    ssl: false
});


client.connect();

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
};
