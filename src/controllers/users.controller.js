import { User } from "../models/user.js";
import { Task } from "../models/task.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";
import { encriptar } from "../common/bcrypt.js";




async function getUsers(req, res, next) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'status'],
            order: [['id', 'DESC']],
            where: {   
                status: Status.Active,
            },
        });
        res.json(users);
    } catch (error) {
       next(error);
    }
}

async function createUser(req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await User.create({
            username,
            password,
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username','password', 'status'],
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
        
    } catch (error) {
        next(error);
    }
}



async function updateUser(req, res, next) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
       if(!username && !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const passwordEncriptado= await encriptar(password);

        const user= await User.update({ 
            username, 
            password: passwordEncriptado, 
        }, {
            where: { id },
        });

        res.json(user);

    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    try{
        await User.destroy({
            where: { id }
        });
        res.sendStatus(204).json({ message: 'User deleted successfully' });
    }catch (error) {
        next(error);
    }
}

async function activateInactivateUser(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if(!status) res.status(400).json({ message: 'Status is required' });

        const user= await User.findByPk(id);

        if (!user) res.status(404).json({ message: 'User not found' });

        if(user.status=== status) 
            res.status(409).json({ message: `Same status` });

        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getTask(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include: [{
                model: Task,
                attributes: ['name', 'done'],
                where: {
                    done: false
                }
            }],
            where: { id },
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
}
async function getUsersPagination(req, res, next) {
    try {
        // 1. query params con defaults
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        let orderBy = req.query.orderBy || 'id';
        let orderDir = (req.query.orderDir || 'DESC').toUpperCase();

        // Validar limit
        const allowedLimits = [5, 10, 15, 20];
        if (!allowedLimits.includes(limit)) limit = 10;

        // Validar orderBy
        const allowedOrderBy = ['id', 'username', 'status'];
        if (!allowedOrderBy.includes(orderBy)) orderBy = 'id';

        // Validar orderDir
        if (!['ASC', 'DESC'].includes(orderDir)) orderDir = 'DESC';

        // 2. offset
        const offset = (page - 1) * limit;

        // 3. where dinámico para búsqueda
        let where = {};
        if (search) {
            where.username = { [Op.iLike]: `%${search}%` };
        }

        // 4. query con paginación
        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'username', 'status'],
            where,
            limit,
            offset,
            order: [[orderBy, orderDir]],
        });

        // 5. respuesta
        res.json({
            total: count,
            page,
            limit,
            pages: Math.ceil(count / limit),
            data: rows
        });

    } catch (error) {
        next(error);
    }
}

    export default{
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivateUser,
    getTask,
    getUsersPagination
};