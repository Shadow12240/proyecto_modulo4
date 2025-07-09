import e from "express";
import logger from "../logs/logger.js";

export default function errorHandler(err, req, res, next) {
    console.log('error nombre', err.name);
    logger.error(err);
    

    if (err.name === 'ValidationError') {
        res.status(400).json({message: err.message,});
    }else if (err.name === 'JsonwebtokenError') {
        res.status(401).json({message: err.message});
    }else if (err.name === 'Token ExpiredError') {
        res.status(401).json({message: err.message});
    } else if (
        err.name ==='sequelizeValidationError'|| 
        err.name === 'SequelizeUniqueConstraintError'||
        err.name === 'SequelizeForeignKeyConstraintError'
    ) {
        res.status(400).json({message: err.message});
    }else{
        res.status(500).json({message: err.message });
    }
}
