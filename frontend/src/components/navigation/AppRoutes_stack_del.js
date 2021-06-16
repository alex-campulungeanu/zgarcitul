import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/oauth/Login';
import Logout from './components/oauth/Logout';
import RenewToken from './components/oauth/RenewToken';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './views/errors/NotFound';
import Index from './views/Index';
import MainContainer from './views/MainContainer';
import ViewUserProfile from './views/user/profile/ViewUserProfile';
import CreateUserProfile from './views/user/profile/CreateUserProfile';
import UpdateUserProfile from './views/user/profile/UpdateUserProfile';
import PartnerProfile from './views/partner/profile/PartnerProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* auth pages (important: do not place under /auth path) */}
      <Route path="oauth/login" element={<Login />} />
      <Route path="oauth/logout" element={<Logout />} />
      <Route path="oauth/renew" element={<RenewToken />} />
      <Route element={<MainContainer />}>
        <Route path="/" element={<Index />} />

        {/* protected routes */}
        <ProtectedRoute path="user/*" element={<Outlet />}>
          <Route path="/" element={<Navigate to="profile" replace />} />

          <Route path="profile/*" element={<Outlet />}>
            <Route path="/" element={<ViewUserProfile />} />
            <Route path="create" element={<CreateUserProfile />} />
            <Route path="update" element={<UpdateUserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </ProtectedRoute>

        <ProtectedRoute path="partner/*" roles={['partner']} element={<Outlet />}>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="*" element={<NotFound />} />
        </ProtectedRoute>

        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;