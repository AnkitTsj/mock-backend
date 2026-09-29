import {createServer } from 'node:http';
import url from 'node:url';
import path from 'node:path';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));
// const __dirname = path.dirname(__filename);
const PORT = process.env.PORT;
const users = [
    {'id':1,'name':'Ankit'},
    {'id':2,'name':'Pankit'},
    {'id':3,'name':'Akash'}
]
const logger = (req,res,next)=>{
    console.log(req.url);
    next();
}
const getUsersHandler = (req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
}
const getUserHandler = (req,res)=>{
    const match = req.url.match(/\/api\/users\/([0-9]+)/);
    if (!match) {
        res.statusCode = 400; // Bad request if ID is not found in URL
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid user ID format' }));
        return;
    }
    const id = parseInt(match[1]);
    const user = users.find(u => u.id === id);
    if(user){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user));}
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'User not found' }));
    }
}
const createUserHandler = (req,res)=>{
    const body = [];
    req.on('data',(chunk)=>{
        body.push(chunk);
    });
    req.on('end', () => {
        const user = JSON.parse(Buffer.concat(body).toString());
        user.id = users.length + 1; // Simple ID generation
        users.push(user);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user));
    });
}
const notFoundHandler = (req,res)=>{
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'message':"NOT FOUND!"}));
}
const server = createServer((req,res)=>{
    logger(req,res,()=>{
        if(req.url === '/api/users' && req.method === 'GET' ){
            getUsersHandler(req,res);
        }
        else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'GET'){
            getUserHandler(req,res);
        }
        else if(req.url === '/api/users' && req.method === 'POST'){
            createUserHandler(req,res);
        }
        else{
            notFoundHandler(req,res);
        }
    });
});
server.listen(PORT,()=>{console.log(`this is running on ${PORT}`)});