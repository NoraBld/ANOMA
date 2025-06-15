import React, { useState } from 'react';

const GrapheAction = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4 justify-end mb-8 relative">

      <div className="flex flex-wrap gap-4 justify-end">
        {/* Bouton pour ouvrir le modal de confirmation */}
        <button 
          onClick={() => setIsConfirmModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
        >
          Choisir un modèle
        </button>

        {/* Bouton pour afficher le formulaire de paiement */}
        <button 
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Acheter le graphe
        </button>
      </div>

      {/* Modal de confirmation */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">Voulez-vous vraiment choisir un nouveau modèle ?</p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  console.log('Modèle choisi confirmé !');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de paiement (affiché sous les boutons) */}
      {showPaymentForm && (
        <div className="mt-6 p-6 border rounded-2xl shadow-inner bg-gray-50 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Paiement</h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nom complet"
              className="border border-gray-300 rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Numéro de carte"
              className="border border-gray-300 rounded-lg p-2"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/AA"
                className="border border-gray-300 rounded-lg p-2 w-1/2"
              />
              <input
                type="text"
                placeholder="CVC"
                className="border border-gray-300 rounded-lg p-2 w-1/2"
              />
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPaymentForm(false);
                  console.log('Paiement effectué !');
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                Payer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default GrapheAction;
