import express from 'express'

const router = express.Router();
router.post('/register', registerUser)
router.post('/login', loginUser)
// router.get('/:id',protect, getUserProfile)
// router.put('/:id',protect, updateUserProfile)
// router.get('/',protect,admin, getUsers)
// router.delete('/:id',protect,admin, deleteUser)
export default router