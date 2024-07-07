const { useState } = React

export function TodoAdd({ onAddTodo }) {
    const [todo, setTodo] = useState({ txt: '' })

    function onChange(ev) {
        setTodo({ txt: ev.target.value })
    }

    function onSubmitTodo(ev) {
        ev.preventDefault()
        onAddTodo(todo)
        setTodo({ txt: '' })
    }

    return (
        <form className="flex justify-center align-center" onSubmit={onSubmitTodo}>
            <h3>Add todo: </h3>
            <input type="text" onChange={onChange} value={todo.txt} />
            <button>save</button>
        </form>
    )
}
