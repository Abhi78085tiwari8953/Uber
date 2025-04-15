require('dotenv').config();
const http = require('http');
const app = require('./app'); // your Express app
const connectToDb = require('./db/db'); // <- make sure this path is correct

const port = process.env.PORT || 3000;

connectToDb().then(() => {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});

