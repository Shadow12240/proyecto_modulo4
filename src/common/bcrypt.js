import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../logs/logger.js';



export const encriptar= async (texto) => {
    try {
        const salt = config.BCRYPT_SALT_ROUNDS; // Genera un salt con 10 rondas
        const hash = await bcrypt.hash(texto, salt); // Encripta el texto con el salt
        return hash; // Devuelve el hash encriptado
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña');
    }

}

export const comparar= async (texto, hash) => {
    try {
        return await bcrypt.compare(texto, hash); // Compara el texto con el hash
    } catch (error) {
        logger.error(error);
        throw new Error('Error al comparar la contraseña');   
    }
}

