const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
 const url = req.url
 const method = req.method
 if (url === "/") {
   res.write("<html>");
   res.write("<head><title>Home</title></head>");
   res.write(
     "<body><h1>Hello World</h1><form action='/create-user' method='POST'><input type='text' name='info'/><button type='submit'>Send</button></form></body>"
   );
   res.write("</html>");
   return res.end();
 }
 if (url === "/users") {
   res.write("<html>");
   res.write("<head><title>Users</title></head>");
   res.write(
     "<body><ul><li>Pichu</li><li>Pikachu</li><li>Raichu</li></ul></body>"
   );
   res.write("</html>");
   return res.end();
 }
 if (url === "/create-user" && method === "POST") {
   const body = [];
   req.on("data", chunk => {
     body.push(chunk);
   });
   req.on("end", () => {
     const parsedBody = Buffer.concat(body).toString();
     const message = parsedBody.split("=")[1];
     console.log(message);
    });
    res.statusCode = 302;
    res.setHeader("Home", "/");
    res.end();
 }
})

server.listen(9090)