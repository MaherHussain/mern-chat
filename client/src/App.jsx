import axios from 'axios'
import Routes from './components/Routes'
import { UserContextProvider } from '../src/components/UserContext'


export default function App() {
   
 axios.defaults.baseURL = 'http://localhost:3001'
 axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
     
    
  )
}

