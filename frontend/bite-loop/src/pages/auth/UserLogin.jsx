import AuthPage from '../../components/AuthPage.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function UserLogin() {

  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
    try{
      await axios.post(
        'http://localhost:3000/api/auth/user/login',
        data,
        { withCredentials: true }
      )
      navigate('/')
    } catch(error){
      console.error(
        error.response?.data?.message || 'Login failed'
      )
    }
  }

  return <AuthPage role="user" mode="login" onSubmit={onSubmit} />
}
