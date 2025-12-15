import React from 'react';
import Image from 'next/image';
    
     const Footer = () => {
       return (
         <footer className="bg-white text-black p-8 mt-auto">
           <div className="container mx-auto">
    
            <div className="flex justify-between items-start">
   
              {/* Section 1*/}
              <div className="flex-shrink-0">
                <Image src="/images/logo.png" alt="Coffee Store Logo" width={120} height={50} />
              </div>
   
               {/* Section 2 */}
              <div className="flex space-x-12">
                <div>
                  <h3 className="font-bold text-lg mb-4">Privacy</h3>
                  <ul className="space-y-2 text-sm text-gray-">
                    <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                    <li><a href="/terms" className="hover:underline">Terms of Use</a></li>
                    <li><a href="/cookies" className="hover:underline">Cookies</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Services</h3>
                  <ul className="space-y-2 text-sm text-gray-">
                    <li><a href="/coffee" className="hover:underline">Our Coffees</a></li>
                    <li><a href="/catering" className="hover:underline">Catering</a></li>
                    <li><a href="/shop" className="hover:underline">Online Shop</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">About Us</h3>
                  <ul className="space-y-2 text-sm text-gray-">
                    <li><a href="/about" className="hover:underline">Our Story</a></li>
                    <li><a href="/careers" className="hover:underline">Careers</a></li>
                    <li><a href="/terms" className="hover:underline">Find a Location</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Information</h3>
                  <ul className="space-y-2 text-sm text-gray-">
                    <li><a href="/plans" className="hover:underline">Plans & Pricing</a></li>
                    <li><a href="/products" className="hover:underline">Sell your Products</a></li>
                    <li><a href="/jobs" className="hover:underline">Jobs</a></li>
                  </ul>
                </div>
              </div>
   
              {/* Section 3 */}
               <div>
                 <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                 <div className="flex space-x-4">
                   <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                     <Image src="/images/instaa.png" alt="Instagram" width={24} height={24} />
                   </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/linkedin.png" alt="linkedin" width={24} height={24} /> 
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/YouTube,.png" alt="youtube" width={24} height={24} /> 
                  </a>
                  <a href="https://telegram.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/Telegram.png" alt="telegram" width={24} height={24} /> 
                  </a>
                 </div>
                </div>
   
            </div>
   
            
            <div className="text-center mt-8 border-t border-gray-700 pt-4">
              <p>&copy; {new Date().getFullYear()} Coffee Store. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );
    };
   
    export default Footer