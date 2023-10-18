// User story 1 uses the logDirectory const to get the path to the logs directory, the getLogFileName function to get the log file name that should be written to, and the writeToLogFile function to write to the log file whenever an event is emitted.

// I planned on doing story 2 but ran out of time. I ran into a lot of problems with it too. The files that I had so far are still here to show where I was going with it.

// All the requires.
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
class myEmitter extends EventEmitter {};
const newEmitter = new myEmitter();


// Gets the path to the logs directory.
const logDirectory = path.join(__dirname, 'logs');

// Using the current date and the logs directory, creates a log file name.
function getLogFileName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return path.join(logDirectory, `${year}-${month}-${day}.log`);
}

// Logging a successful HTTP request to the console and to the appropriate log file. When this event is emitted, returns the date, method, and URL of the request, along with the 200 success HTTP status code. This event covers the 1st, 3rd, 4th and 5th suggested scenarios, all at once.
newEmitter.on('request', (req) => {
    const date = new Date().toUTCString();
    const method = req.method;
    const url = req.url;
    var logMsg = `[${date}] ${method} ${url} 200 Success`;
    console.log(logMsg);
    writeToLogFile(logMsg);
});

// Logging a 'not found' HTTP request to the console and to the appropriate log file. When this event is emitted, returns the date, method, and URL of the request, along with the 404 error HTTP status code. This event covers the 1st and 6th suggested scenarios.
newEmitter.on('notFound', (req) => {
    const date = new Date().toUTCString();
    const method = req.method;
    const url = req.url;
    var logMsg = `[${date}] ${method} ${url} 404 Not Found`;
    console.log(logMsg);
    writeToLogFile(logMsg);
});

// Logs an error to the console and to the appropriate log file. This covers the 2nd suggested scenario.
newEmitter.on('error', (err) => {
    // To cover the 2nd scenario, this information is not needed (captures only the errors).
    // const date = new Date().toUTCString();
    // const method = req.method;
    // const url = req.url;
    // console.log(`[${date}] ${method} ${url} 500 Internal Server Error`);
    console.error(err);
    writeToLogFile(err);
})

// Writes a given message to the appropriate log file. If the logs directory does not yet exist, it is created. The appendFile function writes to the specified log file, or creates it if it does not exist.
function writeToLogFile(message) {
    const logName = getLogFileName();
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    // console.log('Log file name: ', logName);
    // console.log('Log message: ', message);
    fs.appendFile(logName, message + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    })
}

// Creating the server
const server = http.createServer((req, res) => {
    // Getting the path
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    // All the available routes
    const routeToFilename = {
        '/': 'index.html',
        '/about': 'about.html',
        '/contact': 'contact.html',
        '/products': 'products.html',
        '/subscribe': 'subscribe.html',
        '/weather': 'weather.html'
    };

    const filename = routeToFilename[pathName];

    // Was going to be used for user story 2. Now not used for anything, but doesn't cause anything to not work either.
    if (pathName === '/weather.js') {
        const filePath = path.join(__dirname, 'weather.js');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Not Found');
            } else {
                res.writeHead(200, {'Content-Type': 'application/javascript'});
                res.end(data);
            }
        });
        // Requesting the appropriate html file. Throwing an error if the file does not exist.
    } else {
        if (filename) {
            const filePath = path.join(__dirname, 'views', filename);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if(err) {
                    newEmitter.emit('notFound', req);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    // newEmitter.emit('request', req);
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if(err) {
                            newEmitter.emit('error', err);
                            res.writeHead(500, {'Content-Type': 'text/html'});
                            res.end('<h1>500 Internal Server Error</h1>');
                        } else {
                            newEmitter.emit('request', req);
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.end(data);
                        }
                    });
                }
            });
        } else {
            newEmitter.emit('notFound', req);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found</h1>');
        }
    }
});

// Port number.
const port = 3000;

// Listening to the specified port
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})