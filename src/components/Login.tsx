"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import  Link from 'next/link';
const Login: React.FC = () => {

     const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', formData);

  };
     const {data: session, status} = useSession();
    if (status === "loading") {
     return (
        <div className="flex items-center justify-center h-full min-h-50">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="ml-4 text-lg">
                Checking authentication status...
            </p>
        </div>
        );
    }
    if (session) {
        return(
            <fieldset className="fieldset flex flex-col gap-4 bg-base-200 border-base-300 rounded-box w-xs border p-4 text-center shadow-lg mx-auto">
                <legend className="fieldset-legend text-2xl font-semibold mb-4">
                    Welcome Back!
                </legend>
                <p className="mb-4 text-lg text-gray-700">
                    Signed in as {""}                    
                    <span className="font-medium text-primary">
                        {session.user?.email || "User"}
                    </span>
                </p>
                <button className="btn btn-neutral btn-sm px-6 py-2 " onClick={() => signOut()}>
                    Sign out
                </button>
            </fieldset>
        )
    }

  return (
    <div className="flex min-h-full flex-col justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
 
        
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white font-serif">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
 
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-amber-400 hover:text-amber-300">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-all"
            >
              Sign in
            </button>
            <p className="mt-4 mb-4 text-bold text-center text-white">
                OR
            </p>
             <button
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-none w-full max-w-xs"    
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;