import React, { useState, useEffect } from 'react';
import { supabase, JobPosting, checkSupabaseHealth } from './lib/supabase';
import LoadingScreen from './components/LoadingScreen';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Hero from './components/Hero';
import Vacancies from './components/Vacancies';
import Footer from './components/Footer';
import Contact from './pages/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'website' | 'contact' | 'admin-login' | 'admin-dashboard'>('website');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    // Check Supabase auth status
    checkAuthStatus();

    // Dev-only: quick health check for anon key/URL combo
    checkSupabaseHealth();

    // Check URL for routes (support path and hash)
    const adminStatus = localStorage.getItem('airkings_admin');
    const isContactHash = window.location.hash === '#/contact';
    if (window.location.pathname === '/admin') {
      setCurrentView(adminStatus === 'true' ? 'admin-dashboard' : 'admin-login');
    } else if (window.location.pathname === '/contact' || isContactHash) {
      setCurrentView('contact');
    } else {
      setCurrentView('website');
    }

    // Fetch jobs from Supabase
    fetchJobs();

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('airkings_admin', 'true');
    } else {
      // Ensure logged out state is consistent
      setIsAdminLoggedIn(false);
      localStorage.removeItem('airkings_admin');
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        return;
      }
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      setJobs([]);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin-dashboard');
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('airkings_admin');
    setIsAdminLoggedIn(false);
    setCurrentView('admin-login');
    window.history.pushState({}, '', '/admin');
  };

  const handleViewWebsite = () => {
    setCurrentView('website');
    window.history.pushState({}, '', '/');
    fetchJobs(); // Refresh jobs when returning to website
  };

  const handleAdminAccess = () => {
    // Always check current auth status before deciding
    checkAuthStatus().then(() => {
      setCurrentView(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
    });
    window.history.pushState({}, '', '/admin');
  };

  // Handle browser back/forward and hash navigation
  useEffect(() => {
    const syncViewFromLocation = () => {
      if (window.location.pathname === '/admin') {
        // Always check current auth status
        checkAuthStatus().then(() => {
          setCurrentView(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
        });
      } else if (window.location.pathname === '/contact' || window.location.hash === '#/contact') {
        setCurrentView('contact');
      } else {
        setCurrentView('website');
      }
    };

    window.addEventListener('popstate', syncViewFromLocation);
    window.addEventListener('hashchange', syncViewFromLocation);
    return () => {
      window.removeEventListener('popstate', syncViewFromLocation);
      window.removeEventListener('hashchange', syncViewFromLocation);
    };
  }, [isAdminLoggedIn]);

  // After switching to website view, scroll to hash section if present
  useEffect(() => {
    if (currentView !== 'website') return;
    if (isLoading) return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    // Delay to ensure sections are rendered
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    return () => clearTimeout(t);
  }, [currentView, isLoading]);

  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={handleViewWebsite}
      />
    );
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onViewWebsite={handleViewWebsite}
      />
    );
  }

  if (currentView === 'contact') {
    return (
      <div className="App">
        <LoadingScreen isLoading={isLoading} />
        {!isLoading && (
          <>
            <Header />
            <Contact />
            <Footer onAdminAccess={() => {
              // route to admin
              setCurrentView(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
              window.history.pushState({}, '', '/admin');
            }} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && (
        <>
          <Header />
          <Hero />
          <Vacancies jobs={jobs} onRefresh={fetchJobs} />
          <Footer onAdminAccess={() => {
            // Always check current auth status before deciding
            checkAuthStatus().then(() => {
              setCurrentView(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
            });
            window.history.pushState({}, '', '/admin');
          }} />
        </>
      )}
    </div>
  );
}

export default App;