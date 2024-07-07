import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedInUser'

export const userService = {
    login,
    logout,
    signup,
    query,
    getById,
    getLoggedInUser,
    updateUserPreffs,
    getDefaultPrefs,
    addActivity,
    getEmptyCredentials,
    // update
}

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            // if (user && user.password !== password) return _setLoggedinUser(user)
            if (user) return _setLoggedInUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, balance: 100, pref: getDefaultPrefs() }
    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedInUser)
}



function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function updateUserPreffs(userToUpdate) {
    const loggedInUserId = getLoggedInUser()._id
    return getById(loggedInUserId)
        .then(user => {
            user.fullname = userToUpdate.fullname
            if (!user.pref) {
                user.pref = getDefaultPrefs()
            }
            user.pref.color = userToUpdate.color
            user.pref.bgColor = userToUpdate.bgColor
            return storageService.put(STORAGE_KEY, user)
                .then((savedUser) => {
                    _setLoggedInUser(savedUser)
                    return savedUser
                })
        })
}

function getDefaultPrefs() {
    return { color: '#eeeeee', bgColor: "#191919" }
}

// function addActivity(type, todoId) {
//     const activity = {
//         txt: `${type} a Todo with id : ${todoId}`,
//         at: Date.now()
//     }
//     const loggedInUser = getLoggedInUser()
//     if (!loggedInUser) return Promise.reject('No logged in user')
//     return getById(loggedInUser._id)
//         .then(user => {
//             if (!user.activities) user.activities = []
//             user.activities.unshift(activity)
//             return user
//         })
//         .then(userToUpdate => {
//             return storageService.put(STORAGE_KEY, userToUpdate)
//                 .then(savedUser => {
//                     _setLoggedInUser(savedUser)
//                     return savedUser
//                 })
//         })
// }

function addActivity(txt) {
    const activity = {
        txt,
        at: Date.now()
    }
    const loggedInUser = getLoggedInUser()
    if (!loggedInUser) return Promise.reject('No loggedin user')
    return getById(loggedInUser._id)
        .then(user => {
            if (!user.activities) user.activities = []
            user.activities.unshift(activity)
            return user
        })
        .then(userToUpdate => {
            return storageService.put(STORAGE_KEY, userToUpdate)
                .then((savedUser) => {
                    _setLoggedInUser(savedUser)
                    return savedUser
                })
        })
}

function _setLoggedInUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, pref: user.pref }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}


function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}


// function update(user) {
//     return storageService.put(STORAGE_KEY, user)
//         .then((updatedUser) => {
//             _setLoggedInUser(updatedUser)
//             return updatedUser
//         })
// }


// Test Data
// userService.signup({username: 'bobo', password: 'bobo', fullname: 'Bobo McPopo'})
// userService.login({username: 'bobo', password: 'bobo'})



