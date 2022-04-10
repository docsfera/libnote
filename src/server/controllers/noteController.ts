const db = require('../db.ts')

class NoteController {
    async createNote(req: any, res: any) {
        const {title, content} = req.body
        const newNote = await db.query('INSERT INTO notes')

    }
    async getNoteByUser(req: any, res: any) {


    }
}

module.exports = new NoteController()