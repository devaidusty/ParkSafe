import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from '../components/ui/AuthGuard'
import RoleSelectScreen from '../screens/RoleSelectScreen'
import MapScreen from '../screens/driver/MapScreen'
import BookingScreen from '../screens/driver/BookingScreen'
import PaymentScreen from '../screens/driver/PaymentScreen'
import ConfirmedScreen from '../screens/driver/ConfirmedScreen'
import OwnerDashboard from '../screens/owner/OwnerDashboard'
import ListSpotScreen from '../screens/owner/ListSpotScreen'
import BookingsScreen from '../screens/owner/BookingsScreen'
import PlateCheckScreen from '../screens/enforcer/PlateCheckScreen'
import PhoneScreen from '../screens/onboarding/PhoneScreen'
import OTPScreen from '../screens/onboarding/OTPScreen'
import ProfileScreen from '../screens/onboarding/ProfileScreen'

const guard = (el: React.ReactNode) => <AuthGuard>{el}</AuthGuard>

export const router = createBrowserRouter([
  // Onboarding — public
  { path: '/onboarding/phone', element: <PhoneScreen /> },
  { path: '/onboarding/otp', element: <OTPScreen /> },
  { path: '/onboarding/profile', element: <ProfileScreen /> },

  // App — protected
  { path: '/', element: guard(<RoleSelectScreen />) },
  { path: '/driver/map', element: guard(<MapScreen />) },
  { path: '/driver/spot', element: guard(<BookingScreen />) },
  { path: '/driver/payment', element: guard(<PaymentScreen />) },
  { path: '/driver/confirmed', element: guard(<ConfirmedScreen />) },
  { path: '/owner', element: guard(<OwnerDashboard />) },
  { path: '/owner/list', element: guard(<ListSpotScreen />) },
  { path: '/owner/bookings', element: guard(<BookingsScreen />) },
  { path: '/enforcer', element: guard(<PlateCheckScreen />) },
])
