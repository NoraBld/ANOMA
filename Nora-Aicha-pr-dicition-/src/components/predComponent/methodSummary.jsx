import React from 'react'
import method from '../../assets/images/analyse.png'
import param from '../../assets/images/parametres-des-engrenages.png'
import erreur from '../../assets/images/etat-derreur.png'

const MethodSummary = () => {
  return (
    <div className="bg-white p-6 mb-8 border border-[#162556] rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-13 text-blue-950 text-center">Informations Clés de l'Analyse</h2>
      <div className="flex gap-6 w-full flex-col md:flex-row">
        <div className="bg-fuchsia-100 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
          <img src={method} alt="Méthode Utilisée" className='w-6 mb-2 mx-auto'/>
          <h3 className="text-lg font-bold mb-2 text-[#162556]">Méthode Utilisée</h3>
          <p className="text-gray-600">GRU</p>
        </div>

        <div className="bg-amber-50 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
          <img src={param} alt="Paramètres" className='w-6 mb-2 mx-auto'/>
          <h3 className="text-lg font-bold mb-2 text-[#162556]">Paramètres</h3>
          <p className="text-gray-600">lr = 0.001, epochs = 50</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
          <img src={erreur} alt="Taux d'Erreur" className='w-6 mb-2 mx-auto'/>
          <h3 className="text-lg font-bold mb-2 text-[#162556]">Taux d'Erreur</h3>
          <p className="text-gray-600">4.2%</p>
        </div>
      </div>
    </div>
  );
};

export default MethodSummary;
