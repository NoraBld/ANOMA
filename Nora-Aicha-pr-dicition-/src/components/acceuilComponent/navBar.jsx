

import React, { useState } from "react";
import logo from '../../assets/images/logoAN.png';
import { HiMenu, HiX } from 'react-icons/hi';
import '../../assets/css/acceuil.css';

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-2">
                    {/* Logo à gauche */}
                    <a href="/" className="logo">
                        <img src={logo} alt="AN predict logo" className="h-10" />
                    </a>

                    {/* Bouton menu pour petits écrans */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-[#E3A761] focus:outline-none text-2xl"
                        >
                            
                        </button>
                    </div>

                    
                </div>

                
               
            </div>
        </header>
    );
}

export default NavBar;
