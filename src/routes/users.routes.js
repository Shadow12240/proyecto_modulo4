import { Router } from "express";
import userController from '../controllers/users.controller.js';
import validate from "../validator/validate.js";
import { createUserSchema } from "../validator/user.validate.js";    
import { authenticateToken } from "../middleware/authenticate.js";  


const router= Router();

//Routes
router
.route('/')
.get(userController.getUsers)
.post(validate(createUserSchema, 'body'), userController.createUser);

router
.route('/:id')
.get(authenticateToken, userController.getUser)
.put(authenticateToken, userController.updateUser)
.delete(authenticateToken, userController.deleteUser)
.patch(authenticateToken, userController.activateInactivateUser)

router
.route('/:id/tasks')
.get(authenticateToken, userController.getTask);

router.get('/list/pagination',userController.getUsersPagination);

export default router;