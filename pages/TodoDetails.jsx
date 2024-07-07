const { useEffect, useState } = React
const { useParams,Link, useNavigate } = ReactRouterDOM

import { showErrorMsg } from '../services/event-bus.service.js'
import { todoService } from '../services/todo.service.js'

export function TodoDetails() {
    const { todoId } = useParams()
    const navigate = useNavigate()
    const [currTodo, setCurrTodo] = useState(null)

    useEffect(() => {
        if(todoId) loadTodo()
    }, [todoId])

    function loadTodo() {
        todoService.getById(todoId)
            .then(todo => setCurrTodo(todo))
            .catch(() => {
                showErrorMsg('Cannot load todo')
                navigate('/todo')
            })
    }
    

    if (!currTodo) return <h4>loading</h4>

    const { _id, txt, isDone, createdAt, creator } = currTodo
    const formattedDate = new Date(createdAt).toLocaleString('he')

    return (
        <div className="todo-details"> 
            <h1>To do: {txt}</h1>
            <h2>Created at: {formattedDate}</h2>
            <h2>is done? {isDone ? 'yes' : 'no'}</h2>
            <p>Creator: <span>{creator && creator.fullname}</span></p>
            <button><Link to={`/todo/edit/${_id}`}>Edit</Link></button>
            <button><Link to="/todo">Back to todos</Link></button>
        </div>
    )
}