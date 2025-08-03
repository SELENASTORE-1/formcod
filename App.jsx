import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from './contexts/ThemeContext'
import { useAuth } from './contexts/AuthContext'
import { useSettings } from './contexts/SettingsContext'

// Pages
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'
import AdminDesign from './pages/admin/AdminDesign'
import NotFound from './pages/NotFound'

// Services
import { initializePixels, trackPageView } from './services/pixelService'

function App() {
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()
  const { settings } = useSettings()
  const { i18n } = useTranslation()
  const location = useLocation()

  // Initialize language based on browser or settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    const browserLanguage = navigator.language.split('-')[0]
    const defaultLanguage = settings.defaultLanguage || 'en'
    
    const languageToUse = savedLanguage || browserLanguage || defaultLanguage
    i18n.changeLanguage(languageToUse)
    
    document.documentElement.dir = ['ar'].includes(languageToUse) ? 'rtl' : 'ltr'
    document.documentElement.lang = languageToUse
  }, [i18n, settings.defaultLanguage])

  // Initialize tracking pixels
  useEffect(() => {
    if (settings.pixels) {
      initializePixels(settings.pixels)
    }
  }, [settings.pixels])

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className={`app ${theme}`}>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <AdminLogin />} />
        <Route path="/admin/orders" element={isAuthenticated ? <AdminOrders /> : <AdminLogin />} />
        <Route path="/admin/settings" element={isAuthenticated ? <AdminSettings /> : <AdminLogin />} />
        <Route path="/admin/design" element={isAuthenticated ? <AdminDesign /> : <AdminLogin />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App