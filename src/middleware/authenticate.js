import jwt from 'jsonwebtoken';
import config from '../config/env.js';


export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if(token == null) return res.sendStatus(401); // Unauthorized
    //verificamos y codificamos el token
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user;
        next();
    });
}