import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister.jsx'
import UserLogin from '../pages/auth/UserLogin.jsx'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister.jsx'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin.jsx'
import Home from '../pages/general/home.jsx'
import CreateFoodPartner from '../pages/food-partner/CreateFoodPartner.jsx'
import Profile from '../pages/food-partner/Profile.jsx'
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
       

       <Route path="/" element={<Home/>} />
       <Route path="/create-food" element={<CreateFoodPartner/>} />
       <Route path="/food-partner/:partnerId" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
