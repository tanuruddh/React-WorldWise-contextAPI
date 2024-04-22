import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { CitiesProvider } from './contexts/CitiesContext'
import { AuthProvider } from './contexts/fakeAuthContext'

import CityList from './components/CityList'
import CountryList from './components/Countrylist'
import SpinnerFullPage from './components/SpinnerFullPage'
import City from './components/City'
import Form from './components/Form'
import ProtectedRoute from './pages/ProtectedRoute'
import { Suspense, lazy } from 'react'

const Homepage = lazy(() => import('./pages/Homepage'));
const Product = lazy(() => import('./pages/Product'));
const Login = lazy(() => import('./pages/Login'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const AppLayout = lazy(() => import('./pages/AppLayout'));
const Pricing = lazy(() => import('./pages/Pricing'));

function App() {

  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='product' element={<Product />} />
              <Route path='pricing' element={<Pricing />} />
              <Route path='login' element={<Login />} />
              <Route path='app' element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path='cities' element={<CityList />} />
                <Route path='cities/:id' element={<City />} />
                <Route path='form' element={<Form />} />
                <Route path='countries' element={<CountryList />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  )
}

export default App
