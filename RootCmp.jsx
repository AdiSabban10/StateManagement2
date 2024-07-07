const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM
const { Provider } = ReactRedux


import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'

import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { TodoApp } from './pages/TodoIndex.jsx'
import { TodoDetails } from './pages/TodoDetails.jsx'
import { UserProfile } from './pages/UserProfile.jsx'
import { TodoEdit } from './pages/TodoEdit.jsx'
import { store } from './store/store.js'


export class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <section className="app">
                        <AppHeader />
                        <main className='main-layout'>
                            <Routes>
                                <Route element={<HomePage />} path="/" />
                                <Route element={<AboutUs />} path="/about" />
                                <Route element={<TodoApp />} path="/todo" />

                                <Route element={<TodoEdit />} path="/todo/edit" />
                                <Route element={<TodoEdit />} path="/todo/edit/:todoId" />
                                <Route element={<TodoDetails />} path="/todo/:todoId" />
                                <Route element={<UserProfile />} path="/user"  />
                            </Routes>
                        </main>
                        <AppFooter />
                    </section>
                </Router>
            </Provider>

        )
    }
}


