import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/private/Dashboard';
import AdminLayout from './layout/admin/AdminLayout';
import ProductPage from './pages/private/ProductPage';
import CategoryPage from './pages/private/CategoryPage';
import SubcategoryPage from './pages/private/SubcategoryPage';
import CategoryForm from './components/admin/category/AddCategoryModal';
import ClientLayout from './layout/client/ClientLayout';
import Home from './pages/public/Home';
import CategoryDetailPage from './pages/public/CategoryDetailPage';
import CategoryListPage from './pages/public/CategoryListPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import SubcategoryDetailPage from './pages/public/SubcategoryDetailPage';
import ComboPage from './pages/private/ComboPage';
import LoginPage from './pages/public/LoginPage';
import PrivateRoute from './components/admin/auth/PrivateRoute';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/client/cart/Cart'
import { UserProvider } from './contexts/UserContext';
import RegisterPage from './pages/public/RegisterPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="products" element={<ProductPage/>}/>
                <Route path="categories" element={<CategoryPage/>}/>
                <Route path="subcategories" element={<SubcategoryPage/>}/>
                <Route path="add-category" element={<CategoryForm/>}/>
                <Route path="combos" element={<ComboPage/>}/>
              </Route>
              
              <Route path="/" element={<ClientLayout></ClientLayout>}>
                <Route path="home" element={<Home/>}/>
                <Route path="categoria" element={<CategoryListPage/>}/>
                <Route path="categoria/:name" element={<CategoryDetailPage/>}/>
                <Route path="producto/:name" element={<ProductDetailPage/>}/>
                <Route path="categoria/:name/subcategoria/:name" element={<SubcategoryDetailPage/>}/>
                <Route path="cart" element={<Cart/>}/>
              </Route>
            </Routes>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

