import React, { useState } from 'react';
import Papa from 'papaparse';  // Pour traiter les fichiers CSV
import * as XLSX from 'xlsx';  // Pour traiter les fichiers Excel (XLSX)

const DataUpload = () => {
  const [data, setData] = useState(null);
  const [fileType, setFileType] = useState('csv');  // Valeur initiale 'csv'
  const [showData, setShowData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour gérer le téléchargement de fichier CSV
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log('Données extraites (CSV):', result.data);
          setData(result.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  // Fonction pour gérer le téléchargement de fichier Excel
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];  // On prend la première feuille
        const jsonData = XLSX.utils.sheet_to_json(ws);  // Convertit la feuille en JSON
        console.log('Données extraites (Excel):', jsonData);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Gérer la sélection du format
  const handleFormatChange = (event) => {
    setFileType(event.target.value);  // 'csv' ou 'excel'
  };

  return (
 

<div className="mt-4 w-full bg-gray-100 p-4 rounded-lg shadow">

          <h3 className="text-lg font-semibold mb-2">Formulaire d'insertion</h3>
          <form className="flex flex-col gap-4">

          <select onChange={handleFormatChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="csv">CSV</option>
          <option value="excel">Excel (XLSX)</option>
        </select>
           


        <input
        type="file"
        accept={fileType === 'csv' ? '.csv' : '.xlsx'}
        onChange={fileType === 'csv' ? handleCSVUpload : handleExcelUpload}
        className="border border-gray-300 p-2 rounded-lg"
        // placeholder='Importer le fichier'
      />
           

           {errorMessage && (
  <div className="text-red-500 mt-2">
    {errorMessage}
  </div>
)}
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
              onClick={() => {
                if (!data) {
                  setErrorMessage('Aucune donnée insérée.');
                  setShowData(false); // S'assurer que les données ne s'affichent pas
                } else {
                  setErrorMessage(''); // Effacer tout message d'erreur précédent
                  setShowData(true);
                }
              }}
            >
              Valider
            </button>
          </form>

     {showData && data && (
  <div className="mt-4">
    <h4 className="text-md font-semibold">Données extraites :</h4>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
)}
    </div>
  );
};

export default DataUpload;
