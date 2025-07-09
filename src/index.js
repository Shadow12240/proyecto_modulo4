import 'dotenv/config'
import app from "./app.js";
import logger from'./logs/logger.js';
import config from './config/env.js';
import { sequelize } from "./database/database.js";

async function main() {
    await sequelize.sync({force:false})
    console.log('===>', config.PORT)
    const port=config.PORT
    app.listen(port);
    console.log('Server is running on http://localhost:3000');
    logger.info('Server started on port', + process.env.PORT);
    logger.error('this is an error ');
    logger.warn('this is a warning ');
    logger.fatal('this is a fatal message');
}

main();