const Router = require('express')
const router = new Router()
const noteController = require('../controllers/noteController')

router.post('/note', noteController.createNote)
router.get('/note', noteController.getNoteByUser)


module.exports = router