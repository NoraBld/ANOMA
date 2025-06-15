import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4">
                   

                    <div className="text-sm space-y-1">
                        <p><strong>SONELGAZ - Société Nationale de l'Électricité et du Gaz</strong></p>
                        <p>Téléphone : <a href="tel:+21321750000" className="text-blue-400 hover:text-blue-500">+213 21 75 00 00</a></p>
                        <p>Email : <a href="mailto:contact@sonelgaz.dz" className="text-blue-400 hover:text-blue-500">contact@sonelgaz.dz</a></p>
                        <p>Fax : +213 21 75 00 01</p>
                        <p>Adresse : Rue de l’Industrie, El Madania, Alger, Algérie</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
