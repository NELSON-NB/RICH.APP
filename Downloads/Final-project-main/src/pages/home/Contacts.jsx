import React,{useState} from 'react'
import { validateEmail } from '../../utils/helper';
import Navbar from '../../components/navbar/Navbar'

const Contacts = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null)

   const handleLogin = async (e) =>{
      e.preventDefault();
      
  
      if (!validateEmail(email)){
        setError("Please enter a valide email address.");
        return;
      }
  
  
      setError("")


    }
  
  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-20 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg  border-white bg-sky-200' initial={{ opacity: 0, y: 25 }} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}}> 
      <div className='w-96 border rounded-2xl mb-4 mt-2 px-7 py-10 bg-slate-100'>
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl mb-7'>Contacts</h4>
          <input type="text"
          placeholder='Enter your name'
          className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
           />
           <input type="text"
          placeholder='Enter your second name'
          className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
           />
           <input type="text"
          placeholder='Enter your phone number'
          className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
           />
          <input type="text"
          placeholder='Email'
          className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          
           
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p> }
            <button type='submit' className='w-full text-sm text-black border-[1.5px] p-2 rounded my-1 cursor-pointer bg-blue-100 hover:bg-green-200'>
              Submit
            </button>
            

        </form>
        

      </div>
      
    
    </div>
     <div className='flex justify-center items-center mt-28 ' initial={{ opacity: 0, y: 25 }} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}}>
     <div className=' w-96 border-2 rounded-2xl bg-slate-100 px-7 py-10 '>
      <form onSubmit={handleLogin}>
      <h4 className='text-2xl mb-7'>Message</h4>
      <input
       type="text" 
       placeholder='Send your message'
       className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none '

       
        
       
       />
            <button type='submit' className='w-full text-sm text-black border-[1.5px] p-2 rounded my-1 cursor-pointer bg-blue-100 hover:bg-green-200'>
              Submit
            </button>

        </form> 
      </div>
     </div>
     

      
    </>
    
  )
}

export default Contacts