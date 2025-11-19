import './App.css'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Flash from './components/Flash/Flash';
import Detail from './components/Flash/Detail';
import Form from './components/Flash/Form';
import PrivateRoute from './middleware/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EditForm from './components/Flash/EditForm';

function App() {
  const user = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        {
          !user &&
          <>
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/' element={<Login />} />
            <Route path='/auth/register' element={<Register />} />       
          </>
        }
        <Route path='/carte/:id' index element={<Detail />} />
        <Route element={<PrivateRoute />} >
          <Route path='*' element={<Navigate to='/dashboard' />} />
          <Route path='/dashboard' index element={<Flash />} />
          <Route path='/form' index element={<Form />} />
          <Route path='/form/edit/:id' index element={<EditForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
