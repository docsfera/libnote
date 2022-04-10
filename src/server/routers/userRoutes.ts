const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/user', userController.createUser)
router.get('/user/:id', userController.getUserById)
router.put('/user/:id', userController.updateUserById)
router.delete('/user/:id', userController.deleteUserById)


module.exports = router