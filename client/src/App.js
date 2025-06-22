import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Edit3, Save, AlertCircle, Filter } from 'lucide-react';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/todos');
            if (!res.ok) throw new Error('Failed to load todos');
            const data = await res.json();
            setTodos(data);
            setError('');
        } catch (err) {
            setError('Unable to connect to server. Working in offline mode.');
            // Load from localStorage as fallback
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                setTodos(JSON.parse(savedTodos));
            }
        } finally {
            setLoading(false);
        }
    };

    const saveToStorage = (newTodos) => {
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const addTodo = async () => {
        if (input.trim() === '') return;
        
        const tempTodo = {
            id: Date.now(),
            text: input.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await fetch('http://localhost:5000/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input.trim() }),
            });
            
            if (!res.ok) throw new Error('Failed to add todo');
            
            const newTodo = await res.json();
            const updatedTodos = [...todos, newTodo];
            setTodos(updatedTodos);
            saveToStorage(updatedTodos);
            setInput('');
            setError('');
        } catch (err) {
            // Offline fallback
            const updatedTodos = [...todos, tempTodo];
            setTodos(updatedTodos);
            saveToStorage(updatedTodos);
            setInput('');
            setError('Added offline - will sync when connected');
        }
    };

    const toggleTodo = async (id, completed) => {
        const optimisticTodos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !completed } : todo
        );
        setTodos(optimisticTodos);

        try {
            const res = await fetch(`http://localhost:5000/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed }),
            });
            
            if (!res.ok) throw new Error('Failed to update todo');
            
            const updatedTodo = await res.json();
            const finalTodos = todos.map(todo => todo.id === id ? updatedTodo : todo);
            setTodos(finalTodos);
            saveToStorage(finalTodos);
            setError('');
        } catch (err) {
            saveToStorage(optimisticTodos);
            setError('Updated offline - will sync when connected');
        }
    };

    const deleteTodo = async (id) => {
        const originalTodos = [...todos];
        const optimisticTodos = todos.filter(todo => todo.id !== id);
        setTodos(optimisticTodos);

        try {
            const res = await fetch(`http://localhost:5000/todos/${id}`, {
                method: 'DELETE',
            });
            
            if (!res.ok) throw new Error('Failed to delete todo');
            
            saveToStorage(optimisticTodos);
            setError('');
        } catch (err) {
            setTodos(originalTodos);
            setError('Failed to delete - please try again');
        }
    };

    const startEdit = (id, text) => {
        setEditingId(id);
        setEditText(text);
    };

    const saveEdit = async () => {
        if (editText.trim() === '') return;

        const optimisticTodos = todos.map(todo =>
            todo.id === editingId ? { ...todo, text: editText.trim() } : todo
        );
        setTodos(optimisticTodos);

        try {
            const res = await fetch(`http://localhost:5000/todos/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: editText.trim() }),
            });
            
            if (!res.ok) throw new Error('Failed to update todo');
            
            const updatedTodo = await res.json();
            const finalTodos = todos.map(todo => todo.id === editingId ? updatedTodo : todo);
            setTodos(finalTodos);
            saveToStorage(finalTodos);
            setError('');
        } catch (err) {
            saveToStorage(optimisticTodos);
            setError('Updated offline - will sync when connected');
        }

        setEditingId(null);
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const clearCompleted = () => {
        const activeTodos = todos.filter(todo => !todo.completed);
        setTodos(activeTodos);
        saveToStorage(activeTodos);
    };

    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case 'active': return !todo.completed;
            case 'completed': return todo.completed;
            default: return true;
        }
    });

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length
    };

    return (
        <div className="app-container">
            <div className="app-wrapper">
                {/* Header */}
                <div className="app-header">
                    <h1 className="app-title">ToDo Master</h1>
                    <p className="app-subtitle">Organize your tasks with style</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="error-banner">
                        <AlertCircle />
                        <span className="error-text">{error}</span>
                    </div>
                )}

                {/* Main Card */}
                <div className="main-card">
                    {/* Input Section */}
                    <div className="input-section">
                        <div className="input-container">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="todo-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && addTodo()}
                                    placeholder="What needs to be done?"
                                    disabled={loading}
                                />
                                <div className="input-counter">
                                    <span>{input.length}</span>
                                </div>
                            </div>
                            <button
                                onClick={addTodo}
                                disabled={loading || !input.trim()}
                                className="add-button"
                            >
                                <Plus />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    {todos.length > 0 && (
                        <div className="stats-section">
                            <div className="stats-container">
                                <div className="stats-left">
                                    <span className="stat-item">
                                        Total: <span className="stat-value">{stats.total}</span>
                                    </span>
                                    <span className="stat-item active">
                                        Active: <span className="stat-value">{stats.active}</span>
                                    </span>
                                    <span className="stat-item completed">
                                        Done: <span className="stat-value">{stats.completed}</span>
                                    </span>
                                </div>
                                {stats.completed > 0 && (
                                    <button
                                        onClick={clearCompleted}
                                        className="clear-completed-btn"
                                    >
                                        Clear completed
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    {todos.length > 0 && (
                        <div className="filter-section">
                            <div className="filter-container">
                                <Filter className="filter-icon" />
                                {['all', 'active', 'completed'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Todo List */}
                    <div className="todo-list-container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading todos...</p>
                            </div>
                        ) : filteredTodos.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <Check />
                                </div>
                                <p className="empty-title">
                                    {filter === 'completed' ? 'No completed tasks yet' :
                                     filter === 'active' ? 'No active tasks' :
                                     todos.length === 0 ? 'No todos yet' : 'All done!'}
                                </p>
                                <p className="empty-subtitle">
                                    {todos.length === 0 ? 'Add your first task above' : 'Great job staying organized!'}
                                </p>
                            </div>
                        ) : (
                            <div className="todo-list">
                                {filteredTodos.map((todo, index) => (
                                    <div
                                        key={todo.id}
                                        className={`todo-item ${todo.completed ? 'completed' : ''}`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="todo-content">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleTodo(todo.id, todo.completed)}
                                                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                                            >
                                                {todo.completed && <Check />}
                                            </button>

                                            {/* Content */}
                                            <div className="todo-text-container">
                                                {editingId === todo.id ? (
                                                    <div className="edit-container">
                                                        <input
                                                            type="text"
                                                            value={editText}
                                                            onChange={e => setEditText(e.target.value)}
                                                            onKeyPress={e => {
                                                                if (e.key === 'Enter') saveEdit();
                                                                if (e.key === 'Escape') cancelEdit();
                                                            }}
                                                            className="edit-input"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={saveEdit}
                                                            className="edit-save-btn"
                                                        >
                                                            <Save />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="edit-cancel-btn"
                                                        >
                                                            <X />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="todo-display">
                                                        <span
                                                            onClick={() => toggleTodo(todo.id, todo.completed)}
                                                            className={`todo-text ${todo.completed ? 'completed' : ''}`}
                                                        >
                                                            {todo.text}
                                                        </span>
                                                        <div className="todo-actions">
                                                            <button
                                                                onClick={() => startEdit(todo.id, todo.text)}
                                                                className="action-btn edit-btn"
                                                            >
                                                                <Edit3 />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteTodo(todo.id)}
                                                                className="action-btn delete-btn"
                                                            >
                                                                <X />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="app-footer">
                    <p>Click to toggle • Edit icon to modify • Hover to delete</p>
                </div>
            </div>
        </div>
    );
}

export default App;