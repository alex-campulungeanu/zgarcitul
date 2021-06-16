import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/oauth/Login';
// import Logout from './components/oauth/Logout';
// import RenewToken from './components/oauth/RenewToken';
// import ProtectedRoute from './components/ProtectedRoute';
// import NotFound from './views/errors/NotFound';
// import Index from './views/Index';
// import MainContainer from './views/MainContainer';
// import ViewUserProfile from './views/user/profile/ViewUserProfile';
// import CreateUserProfile from './views/user/profile/CreateUserProfile';
// import UpdateUserProfile from './views/user/profile/UpdateUserProfile';
// import PartnerProfile from './views/partner/profile/PartnerProfile';

import MainLayout from '../../layouts/MainLayout'
import LoginView from '../../views/auth/LoginView'
import RegisterView from '../../views/auth/RegisterView'
import DashboardLayout from '../../layouts/DashboardLayout'
import DashboardView from '../../views/reports/DashboardView'
import AccountView from '../../views/account/AccountView'
import ProductListView from '../../views/product/ProductListView'
import ProductDetailsView from '../../views/product/ProductDetailsView'
import ProductCreateView from '../../views/product/ProductCreateView'
// import ProductListView from '../../views/product_old/ProductListView'
import SettingsView from '../../views/settings/SettingsView'
import NotFoundView from '../../views/errors/NotFoundView'
import ProtectedRoute from '../ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* auth pages (important: do not place under /auth path) */}
      {/* <Route path="/login" element={<LoginView />} /> */}
      {/* <Route path="oauth/logout" element={<Logout />} />
      <Route path="oauth/renew" element={<RenewToken />} /> */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/app/products" />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="404" element={<NotFoundView />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <ProtectedRoute path="app" >
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/products" element={<ProductListView />} />
          <Route path="/products/create" element={<ProductCreateView />} />
          <Route path="/products/:productId" element={<ProductDetailsView />} />
          {/* <Route path="/products_old" element={<ProductListView />} /> */}
          <Route path="/account" element={<AccountView />} />
          <Route path="/settings" element={<SettingsView />} />

          {/* <Route path="profile/*" element={<Outlet />}>
            <Route path="/" element={<ViewUserProfile />} />
            <Route path="create" element={<CreateUserProfile />} />
            <Route path="update" element={<UpdateUserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route> */}

          {/* <Route path="*" element={<Navigate to="/404" />} /> */}
        </ProtectedRoute>

        {/* <ProtectedRoute path="partner/*" roles={['partner']} element={<Outlet />}>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="*" element={<NotFound />} />
        </ProtectedRoute> */}

        {/* <Route path="*" element={<NotFoundView />} /> */}
      </Route>
      {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}

    </Routes>
  );
};

export default AppRoutes;