 import React from "react";
     
     const Navbar = () => {
       return (
         
        <nav className="bg-white shadow-md">
           <div className="container mx-auto px-6 py-4 flex items-center flex-nowrap">
    
           <div className="container mx-auto px-6 py-4 flex items-center flex-nowrap">
                 <div  className="flex items-center ">
                    <a href="/home">
                        <img src="/images/logo.png" alt="Logo" width="100" height="100"/>
                    </a>
                </div>
            </div>
   
            <div className=" hidden md:flex items-center space-x-8 max-auto">
                <a href="/" className="text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium">Home</a>
                <a href="/coffee" className="text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium">Coffee</a>
                <a href="/bakery" className="text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium">Bakery</a>
                <a href="/shop" className="text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium">Shop</a>
                <a href="/about" className="text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium">About</a>
                <a href="/login" className="px-4 py-2 bg-amber-600 text-white rounded-md hover:text-amber-700 transition-colors duration-300 font-medium">Login</a>
            </div>
   
             <div className="flex items-center relative ml-auto">
                <input 
                type="text"
                placeholder="Search.."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
                </div>
          </div>
        </nav>
      );
    };
   
    export default Navbar;