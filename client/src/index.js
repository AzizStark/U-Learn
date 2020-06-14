import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Blog from './views/ulearn/blog';
import View from './views/ulearn/view';
import Contact from './views/ulearn/contact';
import Login from './views/admin/login';
import Signup from './views/admin/signup';
import Editor from './views/admin/editor';
import NotFound from './views/ulearn/404';
import TDashboard from './views/admin/Tdashboard';
import SDashboard from './views/admin/Sdashboard';
import Fileloader from './views/admin/fileloader';
import Chat from './views/admin/chat'
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Blog}/>
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/file" component={Fileloader}/>
      <Route path="/blog/:id" component={View}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/admin/chat" component={Chat}/>
      <Route exact path="/admin/editor" component={Editor}/>
      <Route exact path="/admin/editor/:cid/:id" component={Editor}/>
      <Route path="/admin/login" component={Login}/>
      <Route path="/admin/signup" component={Signup}/>
      <Route path="/404" component={NotFound} />
      <Route path="/admin/Tdashboard" component={TDashboard}/>
      <Route path="/admin/Sdashboard" component={SDashboard}/>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
