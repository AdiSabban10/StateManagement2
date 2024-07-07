const { useState, useEffect } = React
const { Link, useNavigate, useParams } = ReactRouterDOM


import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo } from "../store/actions/todo.actions.js"

export function TodoEdit() {
    const navigate = useNavigate()
    const [todoToEdit, setTodoToEdit] = useState({txt: ''})
    const { todoId } = useParams()

    useEffect(() => {
        if (todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.getById(todoId)
            .then(todo => setTodoToEdit(todo))
            .catch(err => {
                console.log('Had issues in todo edit', err)
                navigate('/todo')
            })
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setTodoToEdit((prevTodo) => ({ ...prevTodo, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        if (!todoToEdit.txt) return
        saveTodo(todoToEdit)
            .then(() => {
                showSuccessMsg('Todo Saved!')
                navigate('/todo')
            })
            .catch(err => {
                console.log('Had issues in todo details', err)
                showErrorMsg('Had issues in todo details')
            })
    }

    return (
        <section className="todo-edit">
            <h2>{todoToEdit._id ? 'Edit' : 'Add'} Todo</h2>

            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt"> What Todos? : </label>
                <input type="text"
                    name="txt"
                    id="txt"
                    placeholder="Enter what todo?..."
                    value={todoToEdit.txt}
                    onChange={handleChange}
                />

                <div>
                    <button>{todoToEdit._id ? 'Save' : 'Add'}</button>
                    <Link to="/todo">Cancel</Link>
                </div>
            </form>
        </section>
    )
}