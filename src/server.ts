// HTTP module to create a server
import http, { IncomingMessage, ServerResponse } from "node:http";
import fs from "fs/promises";

const PORT = 8001;
// create a local server to receive data from
const server: any = http.createServer((request: IncomingMessage, response: ServerResponse): void => {
    const { url, method } = request;
    if (url === "/video" && method === 'GET') {
        // handle video stream request
    } else {
        // send the index file
        (async(response) => {
            const data = await fs.readFile(__dirname + '/index.html', { encoding: 'utf8' });
            response.writeHead(200, {
                'Content-Length': Buffer.byteLength(data),
                'Content-Type': 'text/html'
            }).end(data);
        })(response)
    }
});

server.listen(PORT, (): void => {
    console.log(`Server listening on port : ${PORT}`);
});