const http = require('http');
const url = require('url');

const routes = {
    '/': (req, res) => {
        logRequest(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Hello World! This is the home page!</h1>');
    },
    '/about': (req, res) => {
        logRequest(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>About page.</h1>');
    },
    '/contact': (req, res) => {
        logRequest(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Contact page.</h1>');
    },
    '/products': (req, res) => {
        logRequest(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Products page.</h1>');
    },
    '/subscribe': (req, res) => {
        logRequest(req);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Subscribe page.</h1>');
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if(routes[path]) {
        routes[path](req, res);
    } else {
        logRequest(req, true);
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>Page not found.</h1>');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

function logRequest(req, isError=false) {
    const date = new Date().toUTCString();
    const method = req.method;
    const url = req.url;
    const status = isError ? 404 : 200;
    console.log(`${date} ${method} ${url} ${status}`);
}