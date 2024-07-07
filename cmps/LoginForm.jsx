import { userService } from "../services/user.service.js"

const { useState } = React

export function LoginForm({ onLogin, isSignup }) {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    // function handleChange({ target }) {
    //     const { name: field, value } = target
    //     setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    // }

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleCredentialsChange}
                required
                autoFocus
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleCredentialsChange}
                required
                autoComplete="off"
            />
            {isSignup && <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Full name"
                onChange={handleCredentialsChange}
                required
            />}
            <button>{isSignup ? 'Signup' : 'Login'}</button>
        </form>
    )
}