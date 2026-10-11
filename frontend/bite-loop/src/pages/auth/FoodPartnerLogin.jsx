import AuthPage from '../../components/AuthPage.jsx'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
export default function FoodPartnerLogin() {
  const navigate = useNavigate()

  const handleSubmit = async (event)=>{
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data ={
      email: formData.get('email'),
      password: formData.get('password')
    }

    try{
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/login', data, {
        withCredentials: true
      })
      if(response.status === 200){
        navigate('/create-food')
      }
    } catch(error){
      console.error(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
  return <AuthPage role="food-partner" mode="login" onSubmit={handleSubmit} />
}
