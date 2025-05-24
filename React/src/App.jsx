// Desc: Main App file
import { Routes, Route } from 'react-router-dom'
import IndexUrl from './hooks/IndexUrl'

// import AddsubCategories from './pages/AddsubCategories'
function App() {
  return (
    <Routes>
    <Route path='/' element={<IndexUrl.Products />} />
    <Route path='/card' element={<IndexUrl.Card />} />
    <Route path='/show' element ={<IndexUrl.DisplayProject />} />
    <Route path='/productDetails/:id' element ={<IndexUrl.ProductDetails />} />
    <Route path='/addproduct' element={<IndexUrl.Addproduct />} />
    <Route path='/addcategories' element={<IndexUrl.Addcategories />} />
    <Route path='/orderList' element={<IndexUrl.OrderList />} />
    <Route path='/CreateOrder' element={<IndexUrl.CreateOrder />} />
    <Route path='/login' element={<IndexUrl.Login />} />
    <Route path='/register' element={<IndexUrl.Register />} />
    <Route path='/profile' element={<IndexUrl.Profile />} />
    <Route path='/ShoppingCard' element={<IndexUrl.ShoppingCard_Getdata />} />
    <Route path="/subcategory/:id" element={<IndexUrl.SubcategoryPage />} />
    <Route path='/dashboard' element={<IndexUrl.Dashboard />} />
    <Route path='/userget' element={<IndexUrl.User_Get />} />
    <Route path='/logout' element={<IndexUrl.Logout />} />
    <Route path='/productshow' element={<IndexUrl.ProductShow />} />
    <Route path='/orderget' element={<IndexUrl.Order_Get />} />
    <Route path='/theme' element={<IndexUrl.ThemeToggle />} />
    <Route path='/return' element={<IndexUrl.ReturnOrder />} />
    <Route path='/order' element={<IndexUrl.OrderGet />} />
    </Routes>
  )
}

export default App
