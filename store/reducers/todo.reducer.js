import { todoService } from "../../services/todo.service.js"

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_DONE_TODOS_PERCENT = 'SET_DONE_TODOS_PERCENT'
export const SET_MAX_PAGE = 'SET_MAX_PAGE'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    todos: [],
    filterBy: todoService.getDefaultFilter(),
    doneTodosPercent: 0,
    isLoading: false,
}

export function todoReducer(state = initialState, action = {}) { // {type,  payload}

    switch (action.type) {
        case SET_TODOS:
            return { ...state, todos: action.todos }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== action.todoId)
            }
        case ADD_TODO:
            return {
                ...state,
                todos: [action.todo, ...state.todos]
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === action.todo._id ? action.todo : todo)
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_DONE_TODOS_PERCENT:
            return { ...state, doneTodosPercent: action.doneTodosPercent }
        case SET_MAX_PAGE:
            return { ...state, maxPage: action.maxPage }

        default:
            return state
    }
}
