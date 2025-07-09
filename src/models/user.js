import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constants/index.js";
import { Task } from "./task.js";
import { encriptar } from "../common/bcrypt.js";
import logger from "../logs/logger.js";

export const User= sequelize.define('users',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull:{
                 msg: 'Username is Required',
                },
           },
    },
     password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull:{
                 msg: 'Password is Required'
                },
           },
    },
     status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.Active,
        validate: {
           isIn: {
            args: [(Status.Active,Status.Inactive)],
            msg: ('Status must be '+ Status.Active + ' or '+ Status.Inactive),
           }
           },
    },
});

User.hasMany(Task)
Task.belongsTo(User)

User.beforeCreate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña antes de crear');
    }
});

/*User.beforeUpdate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar la contraseña antes de actualizar');
    }
});*/
