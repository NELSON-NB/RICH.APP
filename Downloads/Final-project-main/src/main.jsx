import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Login from './pages/home/login/Login.jsx'
import SignUp from './pages/home/login/signup/SignUp.jsx'
import App from './App.jsx'
import Contacts from './pages/home/Contacts.jsx'
import ReadBook from './pages/ReadBook.jsx'
import JointClub from './pages/home/login/JointClub.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import BookList from './pages/BookList.jsx'
import BookDetails from './pages/home/BookDetails.jsx'
import BookClubForum from './components/bookclub/BookClubForum.jsx'
import Disscustion from './components/bookclub/Disscustion.jsx'
import DisscustionAdmin from './components/bookclub/DisscustionAdmin.jsx'
import BookClubEvents from './components/bookclub/BookClubEvents.jsx'
import RSVPApp from './components/bookclub/RSVPApp.jsx'
import BookClubChat from './components/bookclub/BookClubChat.jsx'
import IUCAboutPage from './pages/IUCAboutPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/d" element={<App/>}></Route>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/home" element={<Home/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/contacts" element={<Contacts/>}></Route>
      <Route path="/readbook" element={<ReadBook/>}></Route>
      <Route path="/jointclub" element={<JointClub/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/admin" element={<AdminDashboard/>}></Route>
      <Route path="/booklist" element={<BookList/>}></Route>
      <Route path="/bookdetails" element={<BookDetails/>}></Route>
      <Route path="/bookclubforum" element={<BookClubForum/>}></Route>
      <Route path="/disscustion" element={<Disscustion/>}></Route>
      <Route path="/disscutionadmin" element={<DisscustionAdmin/>}></Route>
      <Route path="/events" element={<BookClubEvents/>}></Route>
      <Route path="/eventsdetails" element={<RSVPApp/>}></Route>
      <Route path="/chats" element={<BookClubChat/>}></Route>
      <Route path="/about" element={<IUCAboutPage/>}></Route>
      

    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
