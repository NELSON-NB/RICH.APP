import React from 'react'

const UserToogleSwitch = ({Label, isOn, onToggle }) => {
  return (
    <div className='flex items-center justify-between py-3'>
         <span className='text-gray-900'>
            {Label}

        </span>
        <button className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isOn ? "bg-sky-700" : "bg-gray-600"}`} onClick={onToggle}>
            <span className={`inline-block size-4 -translate-y-0 transform-transition bg-white rounded-full ${isOn ? "translate-x-6" : "translate-x-1"}`}>

            </span>
            

        </button>
    </div>
  )
}

export default UserToogleSwitch