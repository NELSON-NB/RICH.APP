import React, {useState} from 'react'
import Navbar from '../../../../components/navbar/Navbar'
import Passwordinput from '../../../../components/input/Passwordinput';
import { Link } from 'react-router';
import { validateEmail } from '../../../../utils/helper';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('Signing up', { email, password, confirmPassword });

    if (!name){
      setError("Please enter your name");
      return;
    };
    if (!validateEmail(email)){
      setError("Please enter your email");
      return;
    };
    if (!password){
      setError("Please enter your password");
      return;
    };
    setError("")

  };
  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-28 bg-sky-200 py-4'> 
        <div className='w-96 border rounded-2xl bg-sky-100 px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>
              SignUp
            </h4>
            <div className='mb-4'>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
             type="text"
              placeholder='Name' 
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            </div>
            <div className='mb-4'>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
             type="text"
              placeholder='Email' 
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none mt-1 block' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
          
            <div className='mb-4'>
            <label className="block text-sm font-medium text-gray-700"> Password</label>
            <Passwordinput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </div>
                   <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border-[1.5px] rounded mb-4"
            required
            placeholder='Confirm password'
          />
        </div>
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p> }
            <button type='submit' className='w-full text-sm text-black border-[1.5px] p-2 rounded my-1 bg-sky-200 cursor-pointer hover:bg-green-200'>
            
              Create Account
            </button>
            <p className='text-sm text-center mt-4'>
              Already have and account? {" "}
              <Link to="/login" className='font-medium text-primary underline'>Login</Link>
            </p>
          </form>
        </div>


      </div>
    </>
  )
}

export default SignUp