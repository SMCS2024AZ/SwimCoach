const { Client } = require("pg");

const client = new Client(() => {
  if (process.env.NODE_ENV != "production") {
    return {
      connectionString: process.env.LOCAL_DB,
      ssl: false
    };
  } else {
    return  {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
  }
});

client.connect();

module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
};
