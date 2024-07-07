import { userService } from "../../services/user.service.js";

export const SET_USER = 'SET_USER'

const initialState = {
    user: userService.getLoggedInUser()
}
userService
export function userReducer(state = initialState, action = {}) { // {type,  payload}

    switch (action.type) {
        case SET_USER:
            return {...state, user: action.user}

        default:
            return state
    }
}