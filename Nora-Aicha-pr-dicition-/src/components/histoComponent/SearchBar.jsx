  import React, { useState } from 'react';
  import { Search } from 'lucide-react'; // Icône de recherche, assure-toi que lucide-react est installé

  const SearchBar = ({ predictions, onSelect }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // Index de l'élément surligné

    const filtered = predictions.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' && highlightedIndex < filtered.length - 1) {
        setHighlightedIndex(prev => prev + 1); // Flèche bas
      } else if (e.key === 'ArrowUp' && highlightedIndex > 0) {
        setHighlightedIndex(prev => prev - 1); // Flèche haut
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        onSelect(filtered[highlightedIndex]);
        setQuery('');
        setShowSuggestions(false);
      }
    };

    const handleOptionClick = (option) => {
      onSelect(option);
      setQuery('');
      setShowSuggestions(false);
    };

    return (
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une prédiction..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#8D91AB] text-white placeholder-gray-200 border border-[#2d3250] focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setHighlightedIndex(-1); // Réinitialise l'élément surligné quand on tape
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKeyDown} // Ajoute le gestionnaire de touches
          />
          <Search className="absolute left-3 top-3 text-white" size={20} />
        </div>

        {showSuggestions && filtered.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-[#A8ABBE] rounded-xl shadow-lg overflow-hidden transition-all duration-200">
            {filtered.map((pred, index) => (
              <li
                key={pred.id}
                className={`px-4 py-3 cursor-pointer border-b last:border-b-0 border-[#b5ac91] 
                  ${highlightedIndex === index ? 'bg-[#A8ABBE]' : 'hover:bg-[#A8ABBE]'} `}
                onMouseDown={() => handleOptionClick(pred)} // Clic sur option (empêche fermeture immédiate)
                onMouseEnter={() => setHighlightedIndex(index)} // Surligne l'élément en survol
                style={{ color: highlightedIndex === index ? '#303658' : '#303658' }} // Texte en #303658
              >
                {pred.title}
              </li>
            ))}
          </ul>
        )}

        {showSuggestions && filtered.length === 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-[#A8ABBE] rounded-xl shadow-lg overflow-hidden transition-all duration-200">
            <li className="px-4 py-3 text-gray-600 italic">Aucune prédiction trouvée.</li>
          </ul>
        )}
      </div>
    );
  };

  export default SearchBar;
