import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import SigninSignup from './components/signin-signup'
import UserProfile from './components/userProfile'
import AppHeader from './components/AppHeader'
import CreateGroup from './components/CreateGroup'
import MyGroups from './components/myGroups'
import RideGroupsList from './components/rideGroupList2'
import DashboardPage from './components/DashboardPage2'
import UserBookings from './components/JoinRequest'
import VerifyEmail from './components/VerifyEmail'
import PendingRequestsPage from './components/pendingRequest'
import MyBookings from './components/myBoookings2'
import AllGroupsOverview from './components/DashboardHome'
import MyJoinedGroups from './components/myJoinedGroups'
import Basket from './components/Basket'
import AdminManagementDashboard from './components/AdminManagementDashboard'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'


function App() {

  return (
    <>
      <BrowserRouter>
        <AppHeader />
        <div style={{ height: 64 }} />
        <Basket />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="//signin-signup" element={<LoginPage />} />
          <Route path="/signin" element={<SigninSignup />} />
          <Route path="/register" element={<SigninSignup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboardPage" element={<DashboardPage />}>
            <Route index element={<AllGroupsOverview />} />
            <Route path="create" element={<CreateGroup />} />
            <Route path="all" element={<RideGroupsList />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="my-joined-groups" element={<MyJoinedGroups />} />
            <Route path="requests" element={<PendingRequestsPage />} />
            <Route path="my" element={<MyGroups />} />
            <Route path="requests" element={<UserBookings />} />
          </Route>
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/admin" element={<AdminManagementDashboard />} />
        </Routes>
      </BrowserRouter >
    </>
  )
};

export default App;
