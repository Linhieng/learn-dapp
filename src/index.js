import React from 'react'
import ReactDOM from 'react-dom'
// import { render } from 'react-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css' /* 顺序要在 App 之前, 不然它会覆盖 App.css 样式 */
import App from './components/App'
import configureStore from './store/configureStore'

// const store = configureStore()

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
