const fs = require("fs"); // file system

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Send Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='info'/><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", chunk => {
      // get all data from request
      body.push(chunk);
    });
    // buffer chunks what we got, return will force execution of following code
    return req.on("end", () => {
      // get all chunks and parse them
      const parsedBody = Buffer.concat(body).toString();
      // parsedBody = key=value from the form
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, err => {
        res.statusCode = 302; // redirection code
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<p>Hola</p>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;