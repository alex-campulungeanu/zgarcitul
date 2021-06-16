import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { bindActionCreators } from 'redux'
import { ThemeProvider } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Routes from './components/navigation/Routes'
// import ProtectedRoute from './components/ProtectedRoute'
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
// import routes from 'src/routes';
// import setupAxiosInterceptors from './config/axios-interceptors'

import AppRoutes from './components/navigation/AppRoutes'
import Auth from 'src/components/auth/Auth'

// const actions = bindActionCreators()
// setupAxiosInterceptors()

const App = () => {
  // const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer
        pauseOnHover
        draggablePercent={20}
        bodyClassName="default-toast-body"
        progressClassName="default-toast-progress"
        toastClassName="default-toast"
        autoClose={5000}
      />
      {/* {routing} */}
      <Auth>
        < AppRoutes />
      </Auth>
        {/* <Routes>
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignUpPage} />
            <ProtectedRoute exact path="/" component={ProductListView} />
            <ProtectedRoute path="/settings" component={SettingsPage} />
            <ProtectedRoute path="/activity" component={ActivityPage} />
            <ProtectedRoute path="/new" component={NewPostPage} />
            <ProtectedRoute path="/explore" component={ExplorePage} />
            <Route exact path="/:username" component={ProfilePage} />
            <Route path="/post/:postId" component={PostPage} />
            <ProtectedRoute path="/confirm/:token" component={ConfirmationPage} />
            <Route component={NotFoundPage} />
          </Routes> */}
    </ThemeProvider>
  );
};

export default hot(App);
