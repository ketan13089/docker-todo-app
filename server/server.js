const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let todos = [];
let id = 1;

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = { id: id++, text: req.body.text, completed: false };
    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todo = todos.find(t => t.id == id);
    if (todo) {
        if (text !== undefined) todo.text = text;
        if (completed !== undefined) todo.completed = completed;
        res.json(todo);
    } else {
        res.status(404).send('Todo not found');
    }
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id != id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 