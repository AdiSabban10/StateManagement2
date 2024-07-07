import { todoService } from "../../services/todo.service.js"
import { ADD_TODO, REMOVE_TODO, SET_DONE_TODOS_PERCENT, SET_IS_LOADING, SET_MAX_PAGE, SET_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js"
import { store } from "../store.js"
import { addActivity } from "./user.actions.js"

export function loadTodos() {
    const filterBy = store.getState().todoModule.filterBy
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(({ todos, maxPage, doneTodosPercent }) => {
            // .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            _setTodosData(doneTodosPercent, maxPage)
            return todos
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}


export function removeTodo(todoId) {
    // return todoService.getById(todoId)
    //     .then(todo => {
    //         if (!todo) throw new Error('Todo not found')
    //         return todoService.remove(todoId)
    //             .then(() => {
    //                 store.dispatch({ type: REMOVE_TODO, todoId })
    //             })
    //     })
    return todoService.remove(todoId)
        .then(({ maxPage, doneTodosPercent }) => {
            store.dispatch({type: REMOVE_TODO, todoId})
            _setTodosData(doneTodosPercent, maxPage)
        })
        .then(() => addActivity('Removed the Todo: ' + todoId))
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        // .then(savedTodo => {
            .then(({ maxPage, doneTodosPercent, savedTodo }) => {
            store.dispatch({ type, todo: savedTodo })
            _setTodosData(doneTodosPercent, maxPage)
            return savedTodo
        })
        .then(res => {
            const actionName = (todo._id) ? 'Updated' : 'Added'
            return addActivity(`${actionName} a Todo: ` + todo.txt).then(() => res)
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function updateTodo(todo) {
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
        })
        .catch(err => {
            console.log('todo action -> Cannot updet todo', err)
            throw err
        })
}

function _setTodosData(doneTodosPercent, maxPage) {
    store.dispatch({
        type: SET_DONE_TODOS_PERCENT,
        doneTodosPercent
    })
    store.dispatch({
        type: SET_MAX_PAGE,
        maxPage
    })
}



