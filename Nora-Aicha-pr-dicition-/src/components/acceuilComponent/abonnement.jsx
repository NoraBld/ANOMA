// import { FaChartBar, FaSearch, FaBrain } from "react-icons/fa";
// import React, { useEffect, useState, useRef } from "react";

// const methods = [
//   {
//     id: "01",
//     title: "SARIMA",
//     description:
//       "Modèle statistique robuste pour les séries temporelles avec saisonnalité.",
//     icon: <FaChartBar style={{ color: "#FCB17A" }} />,
//     price: "0DA",
//   },
//   {
//     id: "02",
//     title: "GRU",
//     description:
//       "Réseau neuronal récurrent optimisé pour des prédictions séquentielles rapides.",
//     icon: <FaSearch style={{ color: "#FCB17A" }} />,
//     price: "250000DA",
//   },
//   {
//     id: "03",
//     title: "LSTM",
//     description:
//       "Architecture puissante de deep learning pour gérer les dépendances à long terme.",
//     icon: <FaBrain style={{ color: "#FCB17A" }} />,
//     price: "800000DA",
//   },
// ];

// export default function Abonnement() {
//   const fullTitle = "DDes prédictions selon vos budgets.";
//   const fullSubtitle =
//     "Trouvez votre abonnement idéal grâce à nos différentes méthodes de prédiction de consommation.";

//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const timeouts = useRef([]);

//   useEffect(() => {
//     let titleIndex = 0;
//     let subtitleIndex = 0;

//     const clearAllTimeouts = () => {
//       timeouts.current.forEach((t) => clearTimeout(t));
//       timeouts.current = [];
//     };

//     const typeTitle = () => {
//       if (titleIndex < fullTitle.length) {
//         setTitle((prev) => prev + fullTitle.charAt(titleIndex));
//         titleIndex++;
//         timeouts.current.push(setTimeout(typeTitle, 40));
//       } else {
//         typeSubtitle();
//       }
//     };

//     const typeSubtitle = () => {
//       if (subtitleIndex < fullSubtitle.length) {
//         setSubtitle((prev) => prev + fullSubtitle.charAt(subtitleIndex));
//         subtitleIndex++;
//         timeouts.current.push(setTimeout(typeSubtitle, 20));
//       }
//     };

//     typeTitle();

//     return () => {
//       clearAllTimeouts();
//       setTitle("");
//       setSubtitle("");
//     };
//   }, []);

//   return (
//     <div
//       className="min-h-screen text-white px-6 py-16"
//       style={{ backgroundColor: "#424769" }} // fond des méthodes
//     >
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
//         {/* Texte animé à gauche */}
//         <div className="flex flex-col justify-center h-full">
//           <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
//             {title}
//           </h1>
//           <p className="text-lg text-gray-200">{subtitle}</p>
//         </div>

//         {/* Méthodes à droite */}
//         <div className="relative">
//           <div className="absolute left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-blue-500/50" />
//           <div className="space-y-16 pl-20">
//             {methods.map((method, index) => (
//               <div key={index} className="relative flex items-start gap-4">
//                 <div className="absolute left-[-2.5rem] top-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 border-4 border-white/20 flex items-center justify-center shadow-md">
//                   {method.icon}
//                 </div>

//                 <div
//                   className="flex-1 p-6 rounded-2xl backdrop-blur-lg border border-white/10 shadow-2xl hover:scale-[1.015] transition-transform relative overflow-hidden"
//                   style={{
//                     backgroundColor: "rgba(103, 111, 157, 0.4)", // Fond transparent des méthodes
//                     backdropFilter: "blur(5px)", // Flou de fond pour plus d'effet de transparence
//                   }}
//                 >
//                   <div
//                     className="absolute top-4 right-4 text-sm px-3 py-1 rounded-full font-semibold shadow-md"
//                     style={{
//                       backgroundColor: "#FCB17A",
//                       color: "#1a1a1a",
//                     }}
//                   >
//                     {method.price}
//                   </div>

//                   <h3 className="text-xl font-bold mb-2">
//                     {method.id} - {method.title}
//                   </h3>
//                   <p className="text-sm text-gray-200">{method.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { FaChartBar, FaSearch, FaBrain } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";

const methods = [
  {
    id: "01",
    title: "SARIMA",
    description:
      "Modèle statistique robuste pour les séries temporelles avec saisonnalité.",
    icon: <FaChartBar style={{ color: "#FCB17A" }} />,
    price: "0DA",
  },
  {
    id: "02",
    title: "GRU",
    description:
      "Réseau neuronal récurrent optimisé pour des prédictions séquentielles rapides.",
    icon: <FaSearch style={{ color: "#FCB17A" }} />,
    price: "250000DA",
  },
  {
    id: "03",
    title: "LSTM",
    description:
      "Architecture puissante de deep learning pour gérer les dépendances à long terme.",
    icon: <FaBrain style={{ color: "#FCB17A" }} />,
    price: "800000DA",
  },
];

export default function Abonnement({ onComplete }) {
  const fullTitle = "DDes prédictions selon vos budgets.";
  const fullSubtitle =
    "Trouvez votre abonnement idéal grâce à nos différentes méthodes de prédiction de consommation.";

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const timeouts = useRef([]);

  useEffect(() => {
    let titleIndex = 0;
    let subtitleIndex = 0;

    const clearAllTimeouts = () => {
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current = [];
    };

    const typeTitle = () => {
      if (titleIndex < fullTitle.length) {
        setTitle((prev) => prev + fullTitle.charAt(titleIndex));
        titleIndex++;
        timeouts.current.push(setTimeout(typeTitle, 80));  // Augmenter un peu la vitesse
      } else {
        typeSubtitle();
      }
    };

    const typeSubtitle = () => {
      if (subtitleIndex < fullSubtitle.length) {
        setSubtitle((prev) => prev + fullSubtitle.charAt(subtitleIndex));
        subtitleIndex++;
        timeouts.current.push(setTimeout(typeSubtitle, 60));  // Augmenter un peu la vitesse
      } else {
        // Appeler la fonction callback une fois l'animation terminée
        onComplete();
      }
    };

    typeTitle();

    return () => {
      clearAllTimeouts();
      setTitle("");
      setSubtitle("");
    };
  }, [onComplete]);

  return (
    <div
      className="min-h-screen text-white px-6 py-16"
      style={{ backgroundColor: "#424769" }} // fond des méthodes
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        {/* Texte animé à gauche */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-200">{subtitle}</p>
        </div>

        {/* Méthodes à droite */}
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-blue-500/50" />
          <div className="space-y-16 pl-20">
            {methods.map((method, index) => (
              <div key={index} className="relative flex items-start gap-4">
                <div className="absolute left-[-2.5rem] top-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 border-4 border-white/20 flex items-center justify-center shadow-md">
                  {method.icon}
                </div>

                <div
                  className="flex-1 p-6 rounded-2xl backdrop-blur-lg border border-white/10 shadow-2xl hover:scale-[1.015] transition-transform relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(103, 111, 157, 0.4)", // Fond transparent des méthodes
                    backdropFilter: "blur(5px)", // Flou de fond pour plus d'effet de transparence
                  }}
                >
                  <div
                    className="absolute top-4 right-4 text-sm px-3 py-1 rounded-full font-semibold shadow-md"
                    style={{
                      backgroundColor: "#FCB17A",
                      color: "#1a1a1a",
                    }}
                  >
                    {method.price}
                  </div>

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
