import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import appReducer from '../reducers'
import { ENABLE_REDUX_LOGGER } from 'src/config/constants'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger()

const middlewares = [thunkMiddleware]

if (ENABLE_REDUX_LOGGER) {
    middlewares.push(loggerMiddleware);
}


export const store = createStore(
    appReducer,
    composeEnhancers(applyMiddleware(...middlewares,))
)

// const composedMiddlewares = middlewares =>
//   process.env.NODE_ENV === 'development'
//     ? compose(applyMiddleware(...defaultMiddlewares, ...middlewares), DevTools.instrument())
//     : // compose(
//       //   applyMiddleware(...defaultMiddlewares, ...middlewares),
//       //   (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
//       // )
//       compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

// const initialize = (initialState?: IRootState, middlewares = []) => createStore(reducer, initialState, composedMiddlewares(middlewares));

// export default initialize;