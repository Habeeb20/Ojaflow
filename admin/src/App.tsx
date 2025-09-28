
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Loading from './utils/Loading';
import Error from './utils/ErrorProps';
import { useNotification } from './utils/NotificationSystem';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Login from './pages/auth/Login';

import AdminDashboard from './pages/Dashboard/Dashboard';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
   const { addNotification } = useNotification();
  const [error, setError] = useState<string | null>(null); // Error state
  const location = useLocation();

  // Simulate loading and error for 2 seconds on initial render or route change
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate an API call that might fail
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) { // 30% chance of error for demo
        setError('Failed to load data. Please try again.');
      } else {
        setIsLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Routes where navbar and footer should be hidden
  const hideLayoutRoutes = [
    '/business/dashboard',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/2fa',
    '/account-locked',
  ];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNavigation = (section: string) => {
    console.log(`Navigating to ${section}`);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Simulate retry
    setTimeout(() => {
      if (Math.random() > 0.5) { // 50% chance of success for demo
        setIsLoading(false);
      } else {
        setError('Failed to load data. Please try again.');
      }
    }, 2000);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {!shouldHideLayout && (
        <Navbar
          isAuthenticated={false}
          currentTheme={theme}
          onThemeToggle={handleThemeToggle}
          onLogin={() => console.log('Login clicked')}
          onDashboard={() => console.log('Dashboard clicked')}
        />
      )}
      <main className="flex-1">
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        
          <Route path="/dashboard" element={<AdminDashboard />} />
       
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* {!shouldHideLayout && <Footer onNavigate={handleNavigation} />} */}
    </div>
  );
};

export default App;












































// import React, { useEffect } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNotification } from './components/NotificationContext';
// import Navbar from './components/NavBar';
// import Loading from './components/Loading';
// import Error from './components/Error';
// import { NotificationProvider } from './components/NotificationContext';
// import NotFound from './components/NotFound';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import { RootState } from './store';
// import { setAuth } from './slices/authSlice';
// import { setProducts } from './slices/dataSlice';

// const App: React.FC = () => {
//   const dispatch = useDispatch();
//   const { addNotification } = useNotification();
//   const location = useLocation();
//   const { isAuthenticated, theme } = useSelector((state: RootState) => ({
//     isAuthenticated: state.auth.isAuthenticated,
//     theme: state.auth.theme || 'light',
//   }));
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   // Simulate fetching data and handling network failure
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         // Simulate API call
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//         if (Math.random() > 0.7) {
//           throw new Error('Network error');
//         }
//         // Mock data
//         const products = [
//           { id: '1', name: 'Product A', quantity: 10, price: 99.99 },
//           { id: '2', name: 'Product B', quantity: 5, price: 49.99 },
//         ];
//         dispatch(setProducts(products));
//         // Mock auth
//         if (localStorage.getItem('token')) {
//           dispatch(
//             setAuth({
//               token: localStorage.getItem('token')!,
//               user: { id: '1', name: 'John Doe', role: 'Admin' },
//             }),
//           );
//         }
//         addNotification('Data loaded successfully!', 'success');
//       } catch (err) {
//         setError('Failed to connect to the backend. Using cached data.');
//         addNotification('Network error. Using offline data.', 'warning');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [location.pathname, dispatch, addNotification]);

//   const hideLayoutRoutes = [
//     '/business/dashboard',
//     '/login',
//     '/register',
//     '/forgot-password',
//     '/reset-password',
//     '/verify-email',
//     '/2fa',
//     '/account-locked',
//   ];
//   const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

//   const handleThemeToggle = () => {
//     dispatch(setAuth({ ...store.getState().auth, theme: theme === 'light' ? 'dark' : 'light' }));
//   };

//   const handleNavigation = (section: string) => {
//     console.log(`Navigating to ${section}`);
//   };

//   const handleRetry = () => {
//     setIsLoading(true);
//     setError(null);
//     setTimeout(() => {
//       if (Math.random() > 0.5) {
//         setIsLoading(false);
//         addNotification('Retry successful!', 'success');
//       } else {
//         setError('Failed to connect to the backend. Using cached data.');
//         addNotification('Retry failed. Using offline data.', 'warning');
//       }
//     }, 2000);
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <Error message={error} onRetry={handleRetry} />;
//   }

//   return (
//     <NotificationProvider>
//       <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-background-dark' : 'bg-background'}`}>
//         {!shouldHideLayout && (
//           <Navbar
//             isAuthenticated={isAuthenticated}
//             currentTheme={theme}
//             onThemeToggle={handleThemeToggle}
//             onLogin={() => console.log('Login clicked')}
//             onDashboard={() => console.log('Dashboard clicked')}
//           />
//         )}
//         <main className="flex-1">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>
//         {!shouldHideLayout && <Footer onNavigate={handleNavigation} />}
//       </div>
//     </NotificationProvider>
//   );
// };

// export default App;
