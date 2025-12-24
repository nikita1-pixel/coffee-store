import React from "react";
import Image from "next/image";
     const MiniMenu = () => {
       return (
        <div className="flex space-x-6  p-6 justify-center items-center bg-white  backdrop-blur-sm">
           
        <a href="/hot-coffee" className="flex flex-col items-center justify-center w-32 h-32 px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-20">
           <Image src="/images/hotcoffee.png" alt="Hot Coffee Icon" width={64} height={64} className="mb-2" />
               Hot Coffee
        </a>
    
          
          <a href="/cold-coffee"className="flex flex-col items-center w-32 h-32  px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200">
                <Image src="/images/coldcoffee.png" alt="Cold Coffee Icon" width={64} height={64} className="mb-2" /> 
                    Cold Coffee
          </a>
    
        
          <a href="/cup-coffee" className="flex flex-col items-center w-32 h-32  px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200">
                <Image src="/images/cup coffee.png" alt="Cup Coffee Icon" width={64} height={64} className="mb-2" /> 
                    Cup Coffee
          </a>
    
          
          <a href="/dessert"className="flex flex-col items-center  w-32 h-32 px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200">
                <Image src="/images/dessert.png" alt="Dessert Icon" width={64} height={64} className="mb-2" /> 
                    <h1 className="">Dessert</h1>
          </a>
        </div>
      );
    };
    
    export default MiniMenu;