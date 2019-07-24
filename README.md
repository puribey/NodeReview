# Node js
The following are the notes I am taking while taking the course so please bear that in mind when reading through them.

[Udemy Node Course](https://www.udemy.com/nodejs-the-complete-guide)  
JavaScript Runtime that allows javascript to be executed outside the browser and inside the server. It uses V8 engine (C++) to compile it to machine code.

## JavaScript on the Server

- Request/Response
- Auth
- Databases
- Input validation
- Business Logic
- Run servers (create server and listen to incoming requests)

## Non-server side usage

- Utility scripts
- Build tools

## 2 ways of executing node

1. REPL

- **R**ead
- **E**val
- **P**rint
- **L**oop

2. Execute files

- Used for real apps
- Predictable sequence of steps

## Some important node core modules
- http
- fs
- path

## Nodejs Program Lifecycle

- Event Loop: loop process as long as there are event listeners to listen.
- Single threaded javascript with a worker pool that handles everything and sends call backs to the event loop.
- None blocking code, asynchronous methods

## Req & Res

On both requests and responses, Http headers are added to transport metadata from A to B. [More info.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

### createServer request

Some of the most important parts of this obj:

- headers -> metadata added to request that will give you info about the request
- url
- method

### createServer response

Data we want to send back

- setHeader(name, value) // Ex. setHeader('Content Type', 'text/html')
- write() // Write data to the response
- end() // End the process of writing

```
const server = http.createServer((req,res) => {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<p>Hello World</p>')
    res.write('</html>')
    res.end()
})
```

### Type of Requests

- every action clicking links/buttons or changing urls will create a **GET** this means that we will receive information
- when trying to send a form or anything to the server it will be done by using **POST**
- there are other important methods but these two are the most important ones.

```
const url = req.url;
if (url === "/") {
res.write("<html>");
res.write("<head><title>Send Message</title></head>");
res.write(
    "<body><form action='/message' method='POST'><input type='text' name='info'/><button type='submit'>Send</button></form></body>"
);
res.write("</html>");
return res.end();
}
```

- Creations of files and redirections are also a possibility when posting req

```
if (url === "/message" && method === "POST") {
    fs.writeFileSync("message.txt", "dummy");
    res.statusCode = 302; // redirection
    res.setHeader("Location", "/");
    return res.end();
}
```

## Streams and Buffers

- Stream is an ongoing process, request is being read in chunks
- Node doesn't know in advance how complex data is
- Buffers are like bus stops where you can interact with the chunks before they are released
- on() method allows us to listen to certain events for the request we choose.

```
    const body = [];
    req.on("data", chunk => {
      // get all data from request
      body.push(chunk);
    });
    // buffer chunks what we got
    return req.on("end", () => {
      // get all chunks and parse them
      const parsedBody = Buffer.concat(body).toString();
      // parsedBody = key=value from the form
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });
```

- IMPORTANT: when there are handlers in the code, node will register them but NOT execute their code. This means that all code outside these handlers will execute first.

### writeFileSync vs writeFile

- writeFileSync: is used when we want the process to stop execution until this is done. This method is ok when the file we need to create or upload is small and quick.
- writeFile: is always a better option since it doesn't stop everything until is done and it receives a third parameter as a callback functions with possible errors.

```
fs.writeFile("message.txt", message, err => {
    res.statusCode = 302; // redirection code
    res.setHeader("Location", "/");
    return res.end();
})
```

## exporting files in Node

1. module.exports at the end of your file
```
module.exports = requestHandler;
or
module.exports = {handler: requestHandler};
or
exports.handler = requestHandler;
```

## NPM 
- node comes with npm (node package manager) in it
- this means that we can install as many packages we want into our project
- we will use `npm init` to initialize our project with a `package.json` file
- any scripts that doesn't use reserve word such as `start` will need a `run` to be executed. For example, `npm run dev`
- when installing a package we can install it with `npm install --save` which will install it as a production dependency or `npm install --save-dev` which will install it as a development dependency

## Types of Error
- syntax errors
- runtime errors
- logical errors (no error message)
- debugging with VS Code: when using nodemon the best idea is to add a configuration that will use nodemon. Go to `Debug > Add Configuration...`
```
restart: true,
runtimeExecutable: "nodemon",
console: "integratedTerminal"
```
- Then by just doing `Debug > Start Debugging`

## Express.js
- Framework installed as a third party library (helpers, tools and rules)
- Others: Adonis, Koa, Sails
- But express has many useful packages made for it or around it
- Simplify server side logic
- Lets focus on Business Logic
- Middleware: incoming request is funneled through a bunch of functions by express. Instead of having one request handler we will have the possibility of hooking into multiple functions until we get the response.
```
// use allows to use a new middleware function
app.use((req, res, next)=> {
    next(); // need next to go to the next middleware
})
```
- Parsing incoming requests: install `body-parser`
```
const bodyParser = require("body-parser");
// this will do the body parse and call next()
app.use(bodyParser.urlencoded());
```
- to differ POST from GET we should use `app.get()` or `app.post()` instead of `app.use()`


## Routes
We can create routes out of express js using `Router`
**Best practice** is to create a `routes` folder and add there the main paths to use inside the app.
Inside those files we need to create our `router`
```
const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("<h1>Hello world</h1>"); // sending a response
});

module.exports = router;
```
Then in `app.js` we can import those routes and use them:
```
const shopRoutes = require("./routes/shop");

app.use(shopRoutes);
```
- If the routes have a parent common route we should specify that when using them. So `app.use("/shop", shopRoutes)` in this case only subroutes of **/shop** will enter **shopRoutes** 

## Show Errors
Every time the path doesn't match any path on my router it should show this message
```
app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found</h1>')
})
```
## Templating
Res will only allow us to use absolute paths in our code, this means we can connect a file inside a response using `res.sendFile("../../views")`
In order to show html content in the different routes we can make use of node js internal `path`
This will allow us to "attach" different html files to different routes
1. Add a `views` folder and put some html pages inside
2. Make use of path to join our path to our folder with `__dirname`. **Dirname** indicates the path to where we are using it. If we are in app.js then dirname will be that. 
```
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})
```
If we don't want to use paths we can also create a helper to give us the root directory where we are standing and replace __dirname with it. 
```
router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});
```
## Templating engines
`npm install --save ejs pug express-handlebars`  

In order to use any of these we need to use `app.set()` (sets a global configuration value) and `app.get()` (gets these values). The most important keys to use to **set** engines are `view engine` (allows us to specify the engine we want to use for templating) and `views` (tell express where to find these dynamic views).
1. **Pug(Jade):**
- app.js = `app.set('view engine', 'pug')`
- views > `shop.pug`
- views > shop.pug = `header.main_header SHOP`
- routes > shop.js = `res.render('shop')`
- routes > shop.js = `res.render('shop', {products: products, header: Shop page})`
- views > shop.pug = `link(rel="stylesheet", href="/css/main.css)`
- views > shop.pug = `header.main_header #{header}`
- views > shop.pug = `each product in products`
- `views > layouts > main-layout.pug`
- views > layouts > main-layout = `block content`
- views > shop.pug = `extends layouts/main-layout.pug`
- views > shop.pug = `block content header.main_header #{header}`
- To render conditionally => routes > shop.js = `res.render('shop', {products: products, header: Shop page, path: 'shop'})`
- views > layouts > main-layout = `if path === 'shop' block content`

2. **Handlebars:**
- app.js = `const handlebars = require('express-handlebars')`
- app.js = `app.engine('hbs', handlebars())`
- app.js = `app.set('view engine', 'hbs')`
- shop.hbs = `<header class="main_header">Shop</header>`
- routes > shop.js = `res.render('shop', {products: products, header: Shop page})`
- views > shop.hbs = `<header class="main_header">{{ header }}</header>`
- routes > shop.js = `res.render('shop', {products: products, header: Shop page, hasProducts: products.length > 0})`
- views > shop.hbs = `{{#if hasProducts}}<header class="main_header">{{ header }}</header>{{/if}}`
- views > shop.hbs = `{{#each products}}<div>{{ this.title }}</div>{{/each}}`
- app.js = 
```
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs"
  })
);
```
- views > layouts > main-layout = `{{{ body }}}`

3. **EJS:**
- no layout but partials may be used
- app.js = `app.set('view engine', 'ejs')`
- syntax = `<% header %>`
- if statement = `<% if products.length > 0 { %> <div></div> <% } %>`
- for statement = `<% for (let product in products) { %> <div> <% product.title %> </div> <% } %>`
