
import { UserMsg } from './UserMsg.jsx'

const { useSelector, useDispatch } = ReactRedux

export function AppFooter() {
    
    const todosLength = useSelector(storeState => storeState.todoModule.todos.length)
    

    return (
        <footer className='app-footer'>
            <h5>Currently {todosLength} todos</h5>
            
            <UserMsg />
        </footer>
    )
}
