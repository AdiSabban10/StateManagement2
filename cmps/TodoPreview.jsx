const { Link } = ReactRouterDOM

export function TodoPreview({ todo, onUpdateTodo, onRemoveTodo }) {
    
    function onToggleDone() {
        const newTodo = { ...todo, isDone: !todo.isDone }
        onUpdateTodo(newTodo)
    }

    return (
        <li className={`todo-preview ${todo.isDone ? 'done' : ''}`}>
            <h4 className="todo-text" onClick={onToggleDone} title="Done/Undone">
                {todo.txt}
            </h4>
        
            <div>
                <button onClick={() => onRemoveTodo(todo._id)}>x</button>
                <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
            </div>
        </li>
    )
}