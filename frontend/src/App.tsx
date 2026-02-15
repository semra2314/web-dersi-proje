// App bileşeni: rota yapısını ve üst seviye layout'u tanımlar
// İçeride: Login, Register, BookList, AdminBookForm, Categories, BorrowHistory
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getUser, clearAuth } from './utils/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import Admin from './pages/Admin';
import Borrowings from './pages/Borrowings';
import CategoryList from './pages/CategoryList';



export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearAuth();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div className="app-container">
      <div className="content">
        <nav>
          <Link to="/">Books</Link> |{' '}
          {!user && <><Link to="/login">Login</Link> | <Link to="/register">Register</Link> | </>}
          {user && user.role === 'admin' && <><Link to="/admin">Admin</Link> | </>}
          {user && <Link to="/borrowing">My Borrows</Link>}
          {user && (
            <span style={{ marginLeft: 10 }}>
              Hoşgeldiniz, <strong>{user.name}</strong> • <button onClick={logout}>Logout</button>
            </span>
          )}
        </nav>

        <main style={{ marginTop: 10 }}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/borrowing" element={<Borrowings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
