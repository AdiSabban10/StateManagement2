const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { TodoList } from '../cmps/TodoList.jsx'
import { TodoFilter } from '../cmps/TodoFilter.jsx'
import { TodoSort } from '../cmps/TodoSort.jsx'
import { PaginationBtns } from '../cmps/PaginationBtns.jsx'
import { loadTodos, removeTodo, saveTodo, updateTodo } from '../store/actions/todo.actions.js'
import { SET_FILTER_BY } from '../store/reducers/todo.reducer.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { todoService } from '../services/todo.service.js'


export function TodoApp() {
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
    const maxPage = useSelector((storeState) => storeState.todoModule.maxPage)
    const dispatch = useDispatch()

    useEffect(() => {
        setFilter({ ...defaultFilter })
    }, [])

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos()
            .catch(() => {
                showErrorMsg('Cannot load todos!')
            })
    }, [filterBy])

    
    function onRemoveTodo(todoId) {
        removeTodo(todoId)
        .then(() => {
            console.log('removed todo ' + todoId)
            showSuccessMsg('Todo removed')
        })
        .catch(() => {
            showErrorMsg('Cannot remove todo')
        })
    }
    
    function onUpdateTodo(todo) {
        updateTodo(todo)
            .then(() => {
                showSuccessMsg(`Todo updated`)
            })
            .catch(() => showErrorMsg('Cannot update todo'))
    }
    
    function setFilter(filterBy) {
        const action = {type: SET_FILTER_BY, filterBy}
        dispatch(action)
    }
    
    // function onToggleTodo(todo) {
    //     toggleTodoStatus(todo)
    //         .then(() => {
    //             showSuccessMsg('Todo status updated')
    //         })
    //         .catch(err => {
    //             showErrorMsg('Cannot update todo status')
    //         })
    // }
    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        if (newPageIdx < 0) newPageIdx = maxPage - 1
        if (newPageIdx >= maxPage) newPageIdx = 0
        setFilter({ ...filterBy, pageIdx: newPageIdx, })
    }
    
    if (!todos) return <div>Loading..</div>
    return (
        <section>
                <TodoFilter filterBy={defaultFilter} onSetFilter={setFilter} />
                <TodoSort filterBy={defaultFilter} onSetFilter={setFilter} />
                <PaginationBtns filterBy={filterBy} onChangePageIdx={onChangePageIdx} />
                <button><Link to="/todo/edit">Add Todo</Link></button>
                <TodoList todos={todos} onUpdateTodo={onUpdateTodo} onRemoveTodo={onRemoveTodo} />
                {(!todos.length) && <div>No todos to show...</div>}
        </section>
    )

}