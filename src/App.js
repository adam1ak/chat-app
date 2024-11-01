import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import AuthForm from './compontents/AuthForm';
import Dashboard from './compontents/Dashboard';

import './styles/colors.css'
import './styles/reset.css'

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
