import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'todoDB'
const PAGE_SIZE = 5

export const todoService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getFilterFromSearchParams,
    
}

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(todos => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regex.test(todo.txt))
            }
            if (filterBy.isDone !== 'all') {
                todos = todos.filter((todo) => (filterBy.isDone === 'done' ? todo.isDone : !todo.isDone))
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'txt') {
                    todos = todos.sort((a, b) => a.txt.localeCompare(b.txt));
                } else {
                    todos = todos.sort((a, b) => a.createdAt - b.createdAt);
                }
            }

            const filteredTodosLength = todos.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                todos = todos.slice(startIdx, PAGE_SIZE + startIdx)
            }
            // return todos
            return Promise.all([getDoneTodosPercent(), getMaxPage(filteredTodosLength)])
                .then(([doneTodosPercent, maxPage]) => {
                    return { todos, maxPage, doneTodosPercent }
                })
        })
}

function getById(todoId) {
    return storageService.get(STORAGE_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
        .catch(err => {
            console.error('Cannot get todo:', err)
            throw err
        })
}

function remove(todoId) {
    return storageService.remove(STORAGE_KEY, todoId)
        // .then(() => {
        //     userService.addActivity('Removed', todoId)
        // })
        .then(() => {
            return Promise.all([getDoneTodosPercent(), getMaxPage()])
                .then(([doneTodosPercent, maxPage]) => {
                    return { maxPage, doneTodosPercent }
                })
        })
        .catch(err => {
            console.error('Cannot remove todo:', err)
            throw err
        })
}

function save(todo) {
    if (!userService.getLoggedInUser()) return Promise.reject('User is not logged in')
    return ((todo._id) ? _edit(todo) : _add(todo))
        .then((savedTodo) => {
            return Promise.all([getDoneTodosPercent(), getMaxPage()])
                .then(([doneTodosPercent, maxPage]) =>
                    ({ maxPage, doneTodosPercent, savedTodo })
                )
        })
}

function _add(todo) {
    todo = { ...todo }
    todo.isDone = false
    todo.createdAt = todo.updatedAt = Date.now()
    todo.creator = userService.getLoggedInUser()
    return storageService.post(STORAGE_KEY, todo)
        .catch(err => {
            console.error('Cannot add todo:', err)
            throw err
        })


}

function _edit(todo) {
    todo = { ...todo }
    todo.updatedAt = Date.now()
    return storageService.put(STORAGE_KEY, todo)
        .catch(err => {
            console.error('Cannot update todo:', err)
            throw err
        })
}

// function save(todo) {
//     if (todo._id) {
//         return storageService.put(STORAGE_KEY, todo)
//             .then((savedTodo) => {
//                 userService.addActivity('Updated', savedTodo._id)
//                 return savedTodo
//             })
//     } else {
//         todo.isDone = false
//         todo.createdAt = Date.now()
//         todo.creator = userService.getLoggedInUser()
//         return storageService.post(STORAGE_KEY, todo)
//             .then((savedTodo) => {
//                 userService.addActivity('Added', savedTodo._id)
//                 return savedTodo
//             })
//     }
// }

function getDefaultFilter() {
    return { txt: '', isDone: 'all', pageIdx: 0, sort: '' }
}

function getFilterFromSearchParams(searchParams) {
    const filterBy = {
        txt: searchParams.get('txt') || '',
        isDone: searchParams.get('isDone') || 'all',
        pageIdx: +searchParams.get('pageIdx') || 0,
        sort: searchParams.get('sort') || ''
    }

    return filterBy
}


function getDoneTodosPercent() {
    return storageService.query(STORAGE_KEY)
        .then(todos => {
            const doneTodosCount = todos.reduce((acc, todo) => {
                if (todo.isDone) acc++
                return acc
            }, 0)

            return (doneTodosCount / todos.length) * 100 || 0
        })
        .catch(err => {
            console.error('Cannot get done todos percent:', err)
            throw err
        })
}

function getMaxPage(filteredTodosLength) {
    if (filteredTodosLength) return Promise.resolve(Math.ceil(filteredTodosLength / PAGE_SIZE))
    return storageService.query(STORAGE_KEY)
        .then(todos => Math.ceil(todos.length / PAGE_SIZE))
        .catch(err => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function _setNextPrevTodoId(todo) {
    return storageService.query(STORAGE_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

