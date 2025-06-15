// import React from "react";
// import logo from '../../assets/images/logoAN.png';
// import '../../assets/css/acceuil.css';

// function NavBar() {
//     return (
//         <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center py-2">
//                     {/* Logo à gauche */}
//                     <a href="/" className="logo">
//                         <img src={logo} alt="AN predict logo" />
//                     </a>

//                     {/* Liens de navigation */}
//                     <nav className="flex items-center space-x-6">
//                         <a
//                             href="/aide"
//                             style={{ color: '#E3A761' }}
//                             className="hover:underline"
//                         >
//                             Aide
//                         </a>
//                         <a
//                             href="/contact"
//                             style={{ color: '#E3A761' }}
//                             className="hover:underline"
//                         >
//                             Contact
//                         </a>

                        
//                     </nav>
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default NavBar;



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
                            {menuOpen ? <HiX /> : <HiMenu />}
                        </button>
                    </div>

                    {/* Liens de navigation - version desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="/aide" className="hover:underline" style={{ color: '#E3A761' }}>Aide</a>
                        <a href="/contact" className="hover:underline" style={{ color: '#E3A761' }}>Contact</a>
                    </nav>
                </div>

                {/* Liens de navigation - version mobile */}
                {menuOpen && (
                    <div className="md:hidden mt-2 rounded p-4 bg-[#424769]">
                        <a
                            href="/aide"
                            className="block text-[#E3A761] py-2 px-3 rounded hover:bg-[#2d3250] transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            Aide
                        </a>
                        <a
                            href="/contact"
                            className="block text-[#E3A761] py-2 px-3 rounded hover:bg-[#2d3250] transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}

export default NavBar;
