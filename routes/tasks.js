const express = require('express');
const { encrypt, decrypt } = require('../utils');
const { validateAndSanitizeTask, authenticateToken } = require('../middleware/validationMiddleware');

const router = express.Router();
let tasks = {}; // In-memory db

router.get('/', authenticateToken, (req, res) => {
  
  const userTasks = tasks[req.user.username] || [];
  res.json(userTasks.map(task => ({
    ...task,
    description: decrypt(task.description)
  })));
});

router.post('/', authenticateToken, validateAndSanitizeTask, (req, res) => {
  const { title, description } = req.body;
  const date = Date.now().toString(); // Time stamp is used as the task's id
  const task = { id: date, title, description: description };
  const encryptedTask = {
    ...task,
    description: encrypt(description)
  }
  if (!tasks[req.user.username]) {
    tasks[req.user.username] = [];
  }
  
  tasks[req.user.username].push(encryptedTask);
  res.status(201).json(task);
});

router.put('/:id', authenticateToken, validateAndSanitizeTask, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userTasks = tasks[req.user.username] || [];
  const task = userTasks.find(task => task.id === id);
  if (task) {
    task.title = title;
    task.description = encrypt(description);
    res.json({
      ...task,
      description: description
    });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  tasks[req.user.username] = tasks[req.user.username].filter(task => task.id !== id);
  res.status(204).send();
});

module.exports = router;
