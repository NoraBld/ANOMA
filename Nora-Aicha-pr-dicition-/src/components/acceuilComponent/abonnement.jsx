import { FaChartBar, FaSearch, FaBrain } from "react-icons/fa";
import React from "react";

const methods = [
  {
    id: "01",
    title: "SARIMA",
    description:
      "Modèle statistique robuste pour l’analyse de séries temporelles saisonnières.",
    icon: <FaChartBar style={{ color: "#FCB17A" }} />,
  },
  {
    id: "02",
    title: "SARIMAX",
    description:
      "Modèle SARIMA avec variables exogènes pour une précision accrue.",
    icon: <FaSearch style={{ color: "#FCB17A" }} />,
  },
  {
    id: "03",
    title: "GRU",
    description:
      "Modèle de deep learning performant pour les données complexes à long terme.",
    icon: <FaBrain style={{ color: "#FCB17A" }} />,
  },
];

export default function Abonnement({ onComplete }) {
  const fullTitle = "";
  const fullSubtitle =
    " Choisissez une méthode adaptée à vos besoins énergétiques et bénéficiez d’analyses intelligentes, précises et rapides.";

  return (
    <div
      className="min-h-screen text-white px-6 py-16"
      style={{ backgroundColor: "#424769" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        {/* Texte à gauche */}
        <div className="flex flex-col justify-center h-full">
         <h1 className="text-xl md:text-3xl font-extrabold mb-4 leading-snug text-[#FCB17A] drop-shadow-sm text-center">
  {fullSubtitle}
</h1>

         
        </div>

        {/* Méthodes à droite */}
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-blue-500/50" />
          <div className="space-y-16 pl-20">
            {methods.map((method, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Icône en cercle */}
                <div className="absolute left-[-2.5rem] top-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 border-4 border-white/20 flex items-center justify-center shadow-md">
                  {method.icon}
                </div>

                {/* Carte méthode */}
                <div
                  className="flex-1 p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(103, 111, 157, 0.4)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <h3 className="text-xl font-bold mb-2">
                    {method.id} - {method.title}
                  </h3>
                  <p className="text-sm text-gray-200">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
