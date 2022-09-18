// HTTP module to create a server
import http, { IncomingMessage, ServerResponse } from "node:http";
import fs from "fs/promises";
import { statSync, createReadStream } from "node:fs";

const PORT = 8001;
// create a local server to receive data from
const server: any = http.createServer((request: IncomingMessage, response: ServerResponse): void => {
    const { url, method } = request;
    if (url === "/video" && method === 'GET') {
        // handle video stream request
        const range = request.headers.range;
        if (!range) {
            const headerAbsentError = "Range header is missing";
            response.writeHead(400, {
                'Content-Length': Buffer.byteLength(headerAbsentError),
                'Content-Type': 'text/html'
            }).end(headerAbsentError)
        }

        // Get video file size
        const videoPath = "index.mp4";
        const videoSize = statSync(videoPath).size;

        // calculate chunk size to be sent to the client - here 1 MB
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range?.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // response headers for video
        const vHeaders = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "video/mp4",
        }

        // set the headers for chunk data
        response.writeHead(206, vHeaders);

        // create a stream to get chunk of video
        const videoStream = createReadStream(videoPath, { start, end });

        // pipe the chunk into the output stream
        videoStream.pipe(response);
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