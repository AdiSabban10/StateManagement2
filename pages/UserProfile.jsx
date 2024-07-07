const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useParams } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { updateUser } from '../store/actions/user.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserProfile() {
   const loggedInUser = useSelector(storeState => storeState.userModule.user)
   const [userDetails, setUserDetails] = useState(null)

   useEffect(() => {
      if (loggedInUser) loadUser()
   }, [])
   
   function loadUser() {
      userService.getById(loggedInUser._id)
         .then(user => {
            console.log('user:', user)
            setUserDetails({
               fullname: user.fullname || '',
               color: (user.pref && user.pref.color) || '#eeeeee',
               bgColor: (user.pref && user.pref.bgColor) || '#191919',
               activities: user.activities || []
            })
         })
         .catch(err => {
            console.error('Failed to load user', err)
            showErrorMsg('Failed to load user')
         })
   }
  
   function getActivityTime(activity) {
      const { at } = activity
      const now = Date.now()
      const timeDiff = now - new Date(at).getTime()
   
      const minutes = Math.floor(timeDiff / (1000 * 60))
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
   
      if (minutes < 60) return `${minutes} minutes ago:`
      if (hours < 24) return `${hours} hours ago:`
      return `${days} days ago:`
   }

   function onEditUser(ev) {
      ev.preventDefault()
      updateUser(userDetails)
   }

   function handleChange(ev) {
      setUserDetails((prevUser) => ({ ...prevUser, [ev.target.name]: ev.target.value }))
   }

   if (!loggedInUser || !userDetails) return <div>No user</div>

   return (
      <div className='container'>
         <h1>Profile</h1>
         <form className='activities-form' onSubmit={(ev) => onEditUser(ev)}>
            <label htmlFor="fullname">Name:</label>
            <input type="text" id="fullname" name="fullname" value={userDetails.fullname} onChange={handleChange} />
            <label htmlFor="name">Color:</label>
            <input type="color" name="color" value={userDetails.color} onChange={handleChange} />
            <label htmlFor="name">BG Color:</label>
            <input type="color" name="bgColor" value={userDetails.bgColor} onChange={handleChange} />
            <button type="submit">save</button>
         </form>

         {userDetails.activities &&
            <ul className='activities-list clean-list'>
               {userDetails.activities.map((activity, idx) => (
                  <li key={activity.at}>
                     {getActivityTime(activity)}
                     {activity.txt}
                  </li>
               ))}
            </ul>
         }
      </div>
   )
   
}
