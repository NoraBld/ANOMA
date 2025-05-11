// import { Menu, User } from 'lucide-react';
// import React, { useState } from "react";
// import logo from '../../assets/images/logoAN.png';
// import '../../assets/css/acceuil.css'
// import { X } from 'lucide-react';
// import { FaGoogle } from 'react-icons/fa';
// import DataUpload from "../dataUpload.jsx"


// function NavBar() {

//     const [isOpen, setIsOpen] = useState(false); // État pour contrôler l'ouverture et la fermeture du modal

//     const toggleModal = () => {
//         setIsOpen(!isOpen); // Ouvre/ferme le modal
//     };
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isChecked, setIsChecked] = useState(false);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission logic here
//         console.log({ email, password, isChecked });
//     };

//     const [isClicked, setIsClicked] = useState(false);

//     const toggleModalButton = () => {
//         // Toggle the clicked state
//         setIsClicked(!isClicked);
//     };
//     return (

//         <>
//             <div>


//                 {/* Modal */}
//                 {isOpen && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto z-100">
//                         <div className="bg-white rounded-lg shadow-lg w-96">
//                             {/* Modal Header */}
//                             <div className="modal-header p-4 flex justify-between items-center border-b border-gray-200">

//                                 <button
//                                     className="text-gray-600 hover:text-gray-800 items-left ml-0 flex justify-start"
//                                     onClick={toggleModal}
//                                 ><X className="w-6 h-6" />
//                                 </button>
//                             </div>

//                             {/* Modal Body */}
//                             <div className="modal-body p-4">
//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div className="mb-3">
//                                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                             Email address
//                                         </label>
//                                         <input
//                                             type="email"
//                                             id="email"
//                                             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ringx-3 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             aria-describedby="emailHelp"
//                                         />
//                                         <div id="emailHelp" className="mt-1 text-xs text-gray-500">
//                                         Votre adresse email restera strictement confidentielle.
//                                         </div>
//                                     </div>

//                                     <div className="mb-3">
//                                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                                             Password
//                                         </label>
//                                         <input
//                                             type="password"
//                                             id="password"
//                                             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-3 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
//                                             value={password}
//                                             onChange={(e) => setPassword(e.target.value)}
//                                         />
//                                     </div>

//                                     <div className="mb-3 flex items-center">
//                                         <input
//                                             type="checkbox"
//                                             id="check"
//                                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                             checked={isChecked}
//                                             onChange={() => setIsChecked(!isChecked)}
//                                         />
//                                         <label htmlFor="check" className="ml-2 text-sm text-gray-700">
//                                             sauvgarder le password
//                                         </label>
//                                     </div>

//                                     {isClicked && (
//                                         <div className="p-4 ">
//                                             <DataUpload />
//                                         </div>
//                                     )}

//                                     {/* <button
//                                         type="submit"
//                                         className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
//                                     > */}
//                                     <button
//                                         className={`w-full py-2 px-4 rounded-md hover:bg-blue-600 transition hover:text-white ${isClicked ? 'bg-blue-100 text-blue-800' : ' bg-blue-500  text-white'
//                                             } p-2 rounded-md`}
//                                         onClick={toggleModalButton}
//                                     >
//                                         Ce connecter
//                                     </button>
//                                     {/* <button
//                                         type="submit"
//                                         className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition"
//                                     > */}
//                                     <button
//                                         className={`w-full py-2 px-4 rounded-md hover:bg-blue-600 transition hover:text-white ${isClicked ? 'bg-blue-500  text-white ' : ' bg-blue-100 text-blue-800 '
//                                             } p-2 rounded-md`}
//                                         onClick={toggleModalButton}
//                                     >
//                                         S'incrire
//                                     </button>

//                                 </form>
//                             </div>

//                             {/* Modal Footer */}
//                             <div className="modal-footer p-4 flex justify-end border-t border-gray-200">



//                                 <button
//                                     type="button"
//                                     className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-800 transition flex items-center justify-center"
//                                 >
//                                     <FaGoogle className="w-5 h-5 text-blue-0 mr-2" />
//                                     Ce connecter avec GOOGLE
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md">
//                 <div className="container mx-auto px-4">
//                     <div className="flex justify-between items-center py-2">

//                         {/* Logo à gauche */}
//                         <a href="/" className="logo">
//                           <img src={logo} alt="adna predict logo" className="h-28 w-auto" />
//                        </a>

//                         {/* Boutons à droite */}
//                         <div className="flex items-center space-x-4">
//                             <button
//                                 className="border butcon  px-1 py-2 rounded-md transition flex items-center"
//                                 onClick={toggleModal}
//                             >
//                                 <User className="mr-1 h-4 w-4" />
//                                  se connecter / s'inscrire
//                             </button>

                            
//                         </div>

//                     </div>
//                 </div>
//             </header>


//         </>
//     );
// }

// export default NavBar;

