import React from 'react';
import ReactDOM from 'react-dom';
var App = require('./components/App');

require('./index.scss');

ReactDOM.render(
  <App />, document.getElementById('app')
);