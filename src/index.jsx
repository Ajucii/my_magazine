import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import './index.css';
import App from './shared/App';
import store from "./redux/configStore"



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById("root")
);
