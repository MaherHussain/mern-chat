import axios from 'axios'
import  {useState, useContext} from 'react'
import { UserContext } from './UserContext'


export default function Register() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const {setId, setUsername: setliggedInUsername} = useContext(UserContext)

    async function register (e) {
      e.preventDefault()
       const {data} =  await axios.post('/register', { email,  username, password})
       setliggedInUsername(username)
       setId(data.id)
    }
    
  return (
    <div className="bg-blue-50 h-screen flex items-center"> 
      <form className="w-64 mx-auto " onSubmit={register}>
        <input 
          type="email" 
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className='rounded-sm mb-3 block p-2 border w-full'
          placeholder='Email'/>

          <input type="text" 
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
          className='rounded-sm mb-3 block p-2 border w-full'
          placeholder='User name'/>

          <input type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className='rounded-sm mb-3 block p-2 border w-full' 
          placeholder='Password'  />

          <button type="submit"
          className="rounded-sm bg-blue-500 block p-2 text-white w-full">
            sign up 
          </button>

      </form>
    </div>
  )
}
