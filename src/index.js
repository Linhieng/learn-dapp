import React from 'react'
import ReactDOM from 'react-dom'
// import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import configureStore from './store/configureStore'
import 'bootstrap/dist/css/bootstrap.css'

// const store = configureStore()

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
