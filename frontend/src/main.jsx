
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../store.js'
import ReactDOM from 'react-dom/client'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
  </Provider>,
)
