import React from 'react';
// import 'react-hot-loader'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import App from './App'
import setupAxiosInterceptors from 'src/config/axios-interceptors'
import { store } from 'src/config/store'
import { clearAuthentication } from 'src/reducers/authentication.reducer'

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication());

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
