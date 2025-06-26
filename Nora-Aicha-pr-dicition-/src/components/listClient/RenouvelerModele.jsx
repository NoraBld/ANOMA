import React, { useState } from "react";

// Composant Spinner (animation de chargement)
const Spinner = () => (
  <div className="flex flex-col items-center my-4">
    <div className="w-8 h-8 border-4 border-[#FCB17A] border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[#162556] mt-2">Prédiction en cours...</p>
  </div>
);

const RenouvelerModele = () => {
  const [loading, setLoading] = useState(false);

  const handleRenouvellement = async () => {
    setLoading(true); // Affiche le spinner
    try {
      const response = await fetch("http://localhost:8000/predict/gru/global", {
        method: "POST",
      });

      const data = await response.json();

      setLoading(false); // ✅ Stoppe le spinner juste avant l'affichage du message

      if (response.ok) {
        alert("✅ " + data.message);
        console.log(data.meilleur_modele);
      } else {
        alert("❌ Erreur : " + data.message);
      }
    } catch (error) {
      setLoading(false); // ✅ Stoppe le spinner avant l'alerte d'erreur
      console.error("Erreur:", error);
      alert("Erreur de connexion au backend.");
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center gap-4">
      {loading && <Spinner />}
      <button
        className="px-4 py-2 bg-[#FCB17A] text-white rounded hover:bg-[#e99a5a]"
        onClick={handleRenouvellement}
        disabled={loading}
      >
        Renouveler le modèle
      </button>
    </div>
  );
};

export default RenouvelerModele;
