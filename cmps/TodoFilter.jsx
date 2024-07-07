const { useState, useEffect, useRef } = React

import { utilService } from "../services/util.service.js"


export function TodoFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(utilService.debounce(onSetFilter, 300))

    useEffect(() => {
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])


    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }


    return (
        <section className="todo-filter flex space-evenely">
            <h2>Todos Filter</h2>
            <form onSubmit={onSubmit}>
            <div className="radio-sort flex justify-center align-center">
                    <label htmlFor="all">

                        <input defaultChecked type="radio" name="isDone" value="all" id="all" onChange={handleChange} />
                        All
                    </label>
                    <label htmlFor="done">

                        <input type="radio" name="isDone" value="done" id="done" onChange={handleChange} />
                        Done
                    </label>
                    <label htmlFor="undone">
                        <input type="radio" name="isDone" value="undone" id="undone" onChange={handleChange} />
                        Active
                    </label>
                </div>
                <div className="search-inputs">
                    <input
                        className="filter-input"
                        placeholder="Search todo..."
                        name="txt"
                        value={filterByToEdit.txt}
                        onChange={handleChange}
                    />
                </div>
                <button>Submit</button>

            </form>

        </section>
    )
}