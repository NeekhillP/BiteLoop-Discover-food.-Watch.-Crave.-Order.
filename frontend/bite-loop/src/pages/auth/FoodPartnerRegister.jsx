import AuthPage from '../../components/AuthPage.jsx'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
export default function FoodPartnerRegister() {

  const navigate = useNavigate()

  const handleSubmit = async (event)=>{
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)

    const data ={
      name: formData.get('name'),
      contactName: formData.get('contactName'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      email: formData.get('email'),
      password: formData.get('password')
    }
    try{
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', data, {
        withCredentials: true
      })
      if(response.status === 201){
        navigate('/create-food')
      }
    } catch(error){
      console.error(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
  return <AuthPage role="food-partner" mode="register" onSubmit={handleSubmit} />
}
