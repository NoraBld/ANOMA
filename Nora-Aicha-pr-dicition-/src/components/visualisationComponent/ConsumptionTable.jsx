// import React, { useState } from 'react';

// const sampleData = [
//   { date: '2024-01-01', consommation: 120 },
//   { date: '2024-01-15', consommation: 135 },
//   { date: '2024-02-03', consommation: 140 },
//   { date: '2024-03-10', consommation: 150 },
//   { date: '2024-03-25', consommation: 160 },
  
  

// ];

// const ConsumptionTable = () => {
//   const [searchDate, setSearchDate] = useState('');

//   const filteredData = sampleData.filter(item =>
//     item.date.includes(searchDate)
//   );

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md mt-6">
//      <h2 className="text-xl font-bold mb-4 text-[#2d3250] text-center">
//   Données de consommation
// </h2>


// <input
//   type="date"
//   value={searchDate}
//   onChange={(e) => setSearchDate(e.target.value)}
//   className="mb-4 px-3 py-2 border rounded-md shadow-sm w-full text-sm text-[#2d3250]"
// />


// <div className="h-65 overflow-y-auto">
//       <table className="min-w-full border text-sm text-left text-[#000000]">
//         <thead className="bg-[#303658] text-white">
//           <tr>
//             <th className="px-4 py-2">Date</th>
//             <th className="px-4 py-2">Consommation (kWh)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((item, index) => (
//               <tr key={index} className="border-t hover:bg-gray-100">
//                 <td className="px-4 py-2">{item.date}</td>
//                 <td className="px-4 py-2">{item.consommation}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
//                 Aucune donnée pour cette date.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       </div>
//     </div>
//   );
// };

// export default ConsumptionTable;
import React, { useState, useEffect } from 'react';

const ConsumptionTable = () => {
  const [consommations, setConsommations] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/client/mes-consommations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const transformed = data.map(item => ({
          date: `${item.annee}-${String(item.mois).padStart(2, '0')}-${String(item.jour || 1).padStart(2, '0')}`, // ajout du jour si disponible
          consommation: item.valeur,
        })).sort((a, b) => a.date.localeCompare(b.date));

        setConsommations(transformed);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des consommations :", error);
      });
  }, []);

  const filteredData = consommations.filter(item =>
    item.date.includes(searchDate)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-[#2d3250] text-center">
        Données de consommation
      </h2>

      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-md shadow-sm w-full text-sm text-[#2d3250]"
      />

      <div className="h-65 overflow-y-auto">
        <table className="min-w-full border text-sm text-left text-[#000000]">
          <thead className="bg-[#303658] text-white">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Consommation (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.consommation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
                  Aucune donnée pour cette date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsumptionTable;
