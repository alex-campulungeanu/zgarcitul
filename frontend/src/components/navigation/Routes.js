import React from 'react';
import { Navigate, Switch, Route, Redirect } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/product/ProductListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product_old/ProductListView-old';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView'; 

// import ProtectedRoute from 'src/components/ProtectedRoute'

// const routes = [
//   {
//     path: 'app',
//     element: <DashboardLayout />,
//     children: [
//       { path: 'account', element: <AccountView /> },
//       { path: 'customers', element: <CustomerListView /> },
//       { path: 'dashboard', element: <DashboardView /> },
//       { path: 'products', element: <ProductListView /> },
//       { path: 'products', element: <ProtectedRoute exact path="/" component={ProductListView} /> },
//       { path: 'settings', element: <SettingsView /> },
//       { path: '*', element: <Navigate to="/404" /> }
//     ]
//   },
//   {
//     path: '/',
//     element: <MainLayout />,
//     children: [
//       { path: 'login', element: <LoginView /> },
//       { path: 'register', element: <RegisterView /> },
//       { path: '404', element: <NotFoundView /> },
//       { path: '/', element: <Navigate to="/app/dashboard" /> },
//       { path: '*', element: <Navigate to="/404" /> }
//     ]
//   }
// ];


const routes = () => {
    return (
        <Switch>
            <Redirect exact from="/" to="/posts" />
            {/* <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} /> */}
            <RouteWithLayout
                component={SignInView}
                exact
                layout={MinimalLayout}
                path="/sign-in"
                isAuthenticated={false}
                />
            <RouteWithLayout 
                component={PostListView}
                exact
                layout={MainLayout}
                path='/posts'
                isAuthenticated={true}
                />
            <RouteWithLayout 
                component={PostListView}
                exact
                layout={MainLayout}
                path='/users'
                isAuthenticated={true}
                />
            {/* <Route exact path="/posts" component={PostsList} /> */}
            {/* <Route exact path="/test" component={TestCss} /> */}
            <Route component={PageNotFound}></Route>
        </Switch>
    )
}

export default routes;