import React from "react";

const SelectionnerClient = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeleteSelected,
}) => {
  const allSelected = totalCount > 0 && selectedCount === totalCount;

  return (
    <div className="mb-4 flex items-center gap-4">
      {!selectedCount && (
        <button
          onClick={onSelectAll}
          className="px-4 py-2 bg-[#FCB17A] text-white rounded hover:bg-[#e99a5a]"
        >
          Sélectionner tous
        </button>
      )}

      {selectedCount > 0 && (
        <>
          <span className="text-[#0F1A3C] font-medium">
            {selectedCount} client{selectedCount > 1 ? "s" : ""} sélectionné
            {selectedCount > 1 ? "s" : ""}
          </span>
          <button
            onClick={onDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Supprimer la sélection
          </button>
        </>
      )}
    </div>
  );
};

export default SelectionnerClient;
