// // FileTable.js
// import React from 'react';
// import { FaDownload, FaTrash } from 'react-icons/fa';

// const FileTable = ({ files }) => {
//   return (
//     <div className="mt-8 w-full px-4 text-white">
//       <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D3250' }}>Mes Fichiers</h3>
//       <table className="min-w-full bg-transparent rounded-md shadow-md">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Nom</th>
//             <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Type</th>
//             <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Date</th>
//             <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file, index) => (
//             <tr key={index} className="bg-white/10 hover:bg-white/20">
//               <td className="px-4 py-2">{file.name}</td>
//               <td className="px-4 py-2">{file.type}</td>
//               <td className="px-4 py-2">{file.date}</td>
//               <td className="px-4 py-2 flex space-x-4">
//                 <FaDownload size={20} className="cursor-pointer text-[#FCB17A]" />
//                 <FaTrash size={20} className="cursor-pointer text-[#FCB17A]" />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FileTable;
import React from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa';

const FileTable = ({ files }) => {
  return (
    <div className="mt-8 w-full px-4 text-white">
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D3250' }}>Mes Fichiers</h3>

      {/* Wrapper pour le scroll horizontal sur petits écrans */}
      <div className="overflow-x-auto rounded-md shadow-md">
        <table className="min-w-[600px] w-full bg-transparent">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Nom</th>
              <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Type</th>
              <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Date</th>
              <th className="px-4 py-2 text-left text-sm" style={{ color: '#2D3250' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index} className="bg-white/10 hover:bg-white/20">
                <td className="px-4 py-2 whitespace-nowrap">{file.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{file.type}</td>
                <td className="px-4 py-2 whitespace-nowrap">{file.date}</td>
                <td className="px-4 py-2 flex space-x-4">
                  <FaDownload size={20} className="cursor-pointer text-[#FCB17A]" />
                  <FaTrash size={20} className="cursor-pointer text-[#FCB17A]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
