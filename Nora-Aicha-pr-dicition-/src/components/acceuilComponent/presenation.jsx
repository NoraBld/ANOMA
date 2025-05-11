import React, { useState } from 'react';
import '../../assets/css/acceuil.css';
import imgSrc from '../../assets/images/presentation1.png';
import { FaGoogle } from 'react-icons/fa'; // Pour l'icône Google

export default function Presentation() {
    const [mode, setMode] = useState(null); // null | "login" | "register"
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false); // pour "sauvegarder le mot de passe"
    const [fileType, setFileType] = useState(""); // Pour stocker le type de fichier (CSV ou Excel)
    const [dataset, setDataset] = useState(null); // Pour stocker le dataset téléchargé

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setDataset(file);
    };

    const renderWelcome = () => (
        <section
            className="main-banner py-24 px-6 text-white flex flex-col items-center justify-center text-center"
            style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            <div className="flex flex-col justify-center items-center text-center space-y-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed drop-shadow-lg max-w-4xl">
                    <span className="block text-lg sm:text-xl font-bold mb-4">
                        Boostez vos résultats avec l’intelligence prédictive.
                    </span>
                    Achetez des services puissants de prédiction adaptés à vos besoins.<br />
                    Simple. Rapide. Performant.
                </h1>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => setMode("register")}
                        className="px-6 py-2 border-2 border-[#fcb17a] text-black bg-[#fcb17a] rounded transition font-medium"
                    >
                        S'inscrire
                    </button>
                    <button
                        onClick={() => setMode("login")}
                        className="px-6 py-2 border-2 border-[#fcb17a] text-black bg-[#fcb17a] rounded transition font-medium"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        </section>
    );

    const renderFormLayout = () => (
        <div className="flex h-screen relative">
            {/* Formulaire à gauche avec flèche */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#2d3250] p-8 relative">
                <button
                    onClick={() => setMode(null)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-[#fcb17a] text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-[#cfae5e] transition"
                    title="Retour"
                >
                    ❮
                </button>

                {mode === 'register' ? (
                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-6 text-white">Inscription</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Nom</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    placeholder="Nom"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Email</label>
                                <input
                                    type="email"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    placeholder="Mot de passe"
                                />
                            </div>
                            
                            {/* Sélection du type de fichier (CSV ou Excel) */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Type de fichier</label>
                                <select
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    value={fileType}
                                    onChange={(e) => setFileType(e.target.value)}
                                >
                                    <option value="">Sélectionner le type de fichier</option>
                                    <option value="csv">CSV</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>

                            {/* Upload du dataset (CSV ou Excel) */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Insérer votre dataset</label>
                                <input
                                    type="file"
                                    accept={fileType === "csv" ? ".csv" : ".xlsx,.xls"}
                                    onChange={handleFileChange}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-[#fcb17a] text-black py-2 px-4 rounded-md transition font-medium"
                            >
                                S'inscrire
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-6 text-white">Connexion</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Email</label>
                                <input
                                    type="email"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-[#424769] text-white"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Sauvegarder le mot de passe */}
                            <div className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    checked={isChecked}
                                    onChange={() => setIsChecked(!isChecked)}
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm">
                                    Sauvegarder le mot de passe
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#fcb17a] text-black py-2 px-4 rounded-md transition font-medium"
                            >
                                Se connecter
                            </button>
                        </form>

                        {/* Connexion avec Google */}
                        <div className="mt-4">
                            <button
                                type="button"
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-800 transition flex items-center justify-center"
                            >
                                <FaGoogle className="mr-2" />
                                Se connecter avec Google
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Image à droite */}
            <div
                className="hidden md:block w-1/2 bg-cover bg-center"
                style={{ backgroundImage: `url(${imgSrc})` }}
                title="Double-cliquez pour revenir à l'accueil"
                onDoubleClick={() => setMode(null)}
            ></div>
        </div>
    );

    return mode === null ? renderWelcome() : renderFormLayout();
}
