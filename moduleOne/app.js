const http = require("http");
const routes = require("./routes");

// this createServer will create a server that will be stored in a constant
const server = http.createServer(routes);

// this will make the server run in localhost:3000
server.listen(3000);
