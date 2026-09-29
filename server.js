import http from 'node:http';
import fs from 'node:fs/promises';
import url from 'node:url';
import path from 'node:path';
const PORT = process.env.PORT ;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));
// const __dirname = path.dirname(__filename);
// const temp = import.meta.url;
const server = http.createServer(async (req,res)=>{
    // console.log(__filename);
    // console.log(__dirname);
    // console.log(temp);
    let filePath ;
    try {
        if(req.method === 'GET'){
            if(req.url === '/'){
                filePath = path.join(__dirname, 'public','index.html');
            }
            else if(req.url === '/about'){
                filePath = path.join(__dirname, 'public','about.html');
            }
            else{
                throw new Error("File not Found!");
            }
            const data = await fs.readFile(filePath);
        res.setHeader('content-type','text/html');
        // res.write(data);
        res.end(data);

        }
        else{
            throw new Error('This method is not allowed.');
        }
    }
    catch (error) {
        res.writeHead(404,{'content-type':'text/html'});
        res.end("<h1>This page is not found.</h1>");
    }
});
server.listen(PORT,()=>{console.log(`this is running on ${PORT}`)});
