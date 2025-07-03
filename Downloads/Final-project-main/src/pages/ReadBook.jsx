import React from 'react'
import Fire2 from '../assets/fire2.jpg'
import Fire3 from '../assets/fire3.jpg'
import Fire5 from '../assets/fire5.jpg'
import Navbar from '../components/navbar/Navbar'
import Footer from './Footer'
import { Link } from 'react-router'

const ReadBook = () => {
    

  return (
    
   <>
   <Navbar/>
   <div className='w-full py-[10rem] px-4 bg-white'>
        <div className='max-w[1240px] mx-auto grid md:grid-cols-3 gap-8'>
            <div className='w-full shadow-xl  bg-gray-100  flex flex-col p-4 my-4 rounded-lg  hover:scale-105 duration-300'>
                <img className='w-20 mx-auto mt-[-3rem] bg-white' src={Fire2} alt="/" />
                <h2 className='text-2xl font-bold text-center py-8'>Single User</h2>
                <p className='text-center text-4xl font-bold'>$149</p>
                <div className='text-center font-medium '>
                    <p className='py-2 border-b mx-8 mt-8'>500 gb storage</p>
                    <p className='py-2 border-b mx-8'>1 granted user</p>
                    <p className='py-2 border-b mx-8'>send up to 2 gb</p>
                </div>
                <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 cursor-pointer mx-auto py-3 text-black"'>Read Book</button>
                <button className='bg-black text-[#00df9a] w-[200px] rounded-md cursor-pointer font-medium my-6 mx-auto py-3 text-black"'><Link to={'/jointclub'}>Joint A Club</Link></button>
            </div>
            <div className='w-full shadow-xl  bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300'>
                <img className='w-20 mx-auto mt-[-3rem] bg-transparent' src={Fire3} alt="/" />
                <h2 className='text-2xl font-bold text-center py-8'>Single User</h2>
                <p className='text-center text-4xl font-bold'>$149</p>
                <div className='text-center font-medium '>
                    <p className='py-2 border-b mx-8 mt-8'>500 gb storage</p>
                    <p className='py-2 border-b mx-8'>1 granted user</p>
                    <p className='py-2 border-b mx-8'>send up to 2 gb</p>
                </div>
                <button className='bg-black text-[#00df9a] w-[200px] rounded-md cursor-pointer font-medium my-6 mx-auto py-3 text-black"'>Read Book</button>
                <button className='bg-[#00df9a] w-[200px] rounded-md cursor-pointer font-medium my-6 mx-auto py-3 text-black"'><Link to={'/jointclub'}>Joint A Club</Link></button>
            </div>
            <div className='w-full shadow-xl  bg-gray-100  flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
                <img className='w-20 mx-auto mt-[-3rem] bg-white' src={Fire5} alt="/" />
                <h2 className='text-2xl font-bold text-center py-8'>Single User</h2>
                <p className='text-center text-4xl font-bold'>$149</p>
                <div className='text-center font-medium '>
                    <p className='py-2 border-b mx-8 mt-8'>500 gb storage</p>
                    <p className='py-2 border-b mx-8'>1 granted user</p>
                    <p className='py-2 border-b mx-8'>send up to 2 gb</p>
                </div>
                <button className='bg-[#00df9a] w-[200px] rounded-md font-medium cursor-pointer my-6 mx-auto py-3 text-black"'>Read Book</button>
                <button className='bg-black text-[#00df9a] w-[200px] rounded-md cursor-pointer font-medium my-6 mx-auto py-3 text-black"'><Link to={'/jointclub'}>Joint A Club</Link></button>
            </div>
    </div>

</div>

   </>
  )
}

export default ReadBook