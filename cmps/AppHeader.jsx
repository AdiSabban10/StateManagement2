const { NavLink } = ReactRouterDOM
const { Fragment } = React
const { useSelector } = ReactRedux

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'


export function AppHeader() {
  const todos = useSelector((storeState) => storeState.todoModule.todos)
  const user = useSelector(storeState => storeState.userModule.user)
  const doneTodosPercent = useSelector((storeState) => storeState.todoModule.doneTodosPercent)

  function onLogout() {
    logout()
      .then(() => {
        showSuccessMsg('logout successfully')
      })
      .catch(err => {
        showErrorMsg('OOPs try again')
      })
  }

  // function getDoneTodosPercent() {
  //   const doneTodosCount = todos.reduce((acc, todo) => {
  //     if (todo.isDone) acc++
  //     return acc
  //   }, 0)

  //   return (doneTodosCount / todos.length) * 100 || 0
  // }

  function getStyleByUser() {
    const prefs = {
      color: '',
      backgroundColor: ''
    }

    if (user && user.pref) {
      prefs.color = user.pref.color
      prefs.backgroundColor = user.pref.bgColor
    }

    return prefs
  }

  // const doneTodos = todos ? getDoneTodosPercent().toFixed(2) : null
  const formattedPercent = todos ? doneTodosPercent.toFixed(2) + '%' : null


  return (
    <header style={getStyleByUser()} className="flex space-between align-center container">
    {/* <header style={getStyleByUser()} className="app-header full main-layout"> */}
      <h1>My Todos</h1>

      {user &&
        <Fragment>
          <h2>Hello {user.fullname}</h2>
            <button onClick={onLogout}>Log out</button>
            {todos &&
              <section className="todos-progress">

                <h3>you have finished {formattedPercent}</h3>
                {/* <h3>you have finished {doneTodos}%</h3> */}
                <div className="progress-bar-container" >
                  <span>{formattedPercent}</span>
                  {/* <span>{doneTodos} %</span> */}
                  <div style={{ width: formattedPercent }}></div>
                  {/* <div style={{ width: doneTodos + '%' }}></div> */}
                </div>
              </section>
            }
          </Fragment>
      }
      
      {!user && <LoginSignup />}

      <nav className="main-nav flex space-evenely">
        <NavLink to="/">Home</NavLink> |
        <NavLink to="/about">About</NavLink> |
        <NavLink to="/todo">Todos</NavLink> |
        {user && <NavLink to="/user">user profile</NavLink>}
      </nav>
    </header>
  )
}
