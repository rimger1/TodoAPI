const express = require('express');
const router = express.Router();
const db = require('../config/db');

//get all tasks
router.get('/', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err});
        }
        res.json(results);
    });
});

//get task by id
router.get('/:id', (req, res) => {  
    const id = req.params.id;
    db.query('SELECT * FROM tasks WHERE ID = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.status(200).json(results[0]);
    })
})

//create new task
router.post('/', (req, res) => {
    const { title, description, deadline } = req.body;
    db.query('INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)', [title, description, deadline], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        return res.status(201).json({ message: 'Task created', taskId: result.insertId });
    })
})


///update task by id
router.patch('/:id', (req, res) => {
    const id = req.params.id;

    let updateFields = Object.keys(req.body).map(field => `${field} = ?`).join(', ');
    let updateValues = Object.values(req.body);

    db.query(`UPDATE tasks SET ${updateFields} WHERE ID = ?`, [...updateValues, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.status(200).json({ message: 'Task updated' });
    })
})


//delete task by id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM tasks WHERE ID = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.status(200).json({ message: 'Task deleted' });
    })
})


//delete all tasks
router.delete('/', (req, res) => {
    db.query('DELETE FROM tasks', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        return res.status(200).json({ message: 'All tasks deleted' });
    })
})

module.exports = router;