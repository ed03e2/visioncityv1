'use client';
import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const backgroundImage = 'https://assets.api.uizard.io/api/cdn/stream/ea931fde-9114-4bda-ba9a-11bda37f757f.png';


function Login() {
  const router = useRouter();

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/auth/forgotpassword');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
  };

  return (
    <div className="relative w-full h-screen"style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>
      <div className="absolute inset-0">
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl text-[#030303] font-roboto text-center mb-8">
            VisionCity
          </h1>
          
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="p-3 rounded-md shadow-sm border-none outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="p-3 rounded-md shadow-sm border-none outline-none transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>
              <a 
                href="#" 
                onClick={handleForgotPassword}
                className="text-sm text-[#030303] no-underline transition-colors hover:text-blue-600"
              >
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className="p-3 rounded-md bg-white text-[#030303] font-medium transition-all duration-300 hover:bg-blue-600 hover:text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;