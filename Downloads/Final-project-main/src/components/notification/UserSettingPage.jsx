import React from 'react'
import UserNotification from './UserNotification';

const UserSettingPage = () => {
  return (
    <div className='flex-1 overflow-auto relative shadow-md bg-blue-50 mt-17'>
        <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
        <UserNotification/>
        

      </main>
    </div>
  )
}

export default UserSettingPage