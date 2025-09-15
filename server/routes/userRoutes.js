import express from 'express'
import { deleteUser, getAllUsers, getUserProfile, loginUser, logoutUser, registerUser, updateProfilePic, updateUserProfile } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/me',protect, getUserProfile)
router.get('/me/profile',protect, updateProfilePic)
router.put('/me',protect, updateUserProfile)
 router.get('/',protect,admin, getAllUsers)
 router.delete('/:id',protect,admin, deleteUser)
export default router