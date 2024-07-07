import { TodoPreview } from "./TodoPreview.jsx"


export function TodoList({ todos, onUpdateTodo, onRemoveTodo }) {
    
    return (
        <ul className="todo-list">
            {todos.map(todo => (
                <TodoPreview
                    key={todo._id}
                    todo={todo}
                    onUpdateTodo={onUpdateTodo}
                    onRemoveTodo={onRemoveTodo}
                />
            ))}
        </ul>
    )
}