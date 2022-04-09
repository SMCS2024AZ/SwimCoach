const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.LOCAL_DB,
  ssl: process.env.DATABASE_URL ? true : false
});

client.connect();

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback)
  },
};
