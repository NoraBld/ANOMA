import React from 'react';
import CalendarSection from './CalendarSection';
import PaymentsSection from './PaymentsSection';

const RightBox = ({ lastActivityDate, selectedDate, setSelectedDate, payments, totalPayments, predictionDates }) => {
  return (
    <div className="w-full md:w-1/2 rounded-xl p-6 shadow-md text-white" style={{ backgroundColor: '#8D91AB' }}>
      {/* Dernière activité */}
      <div className="mb-6">
        <h3 className="text-[#2D3250] text-lg font-semibold mb-4">📌 Dernière interaction détectée :</h3>
        <div className="px-4 py-2 rounded-md bg-white/10 text-white backdrop-blur-sm">
          <span className="text-[#FCB17A] font-medium text-base">
            {lastActivityDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Calendrier de prédiction */}
      <div className="mb-6">
        <h3 className="text-[#2D3250] text-lg font-semibold mb-4">📅 Calendrier de Prédiction</h3>
        <CalendarSection
          predictionDates={predictionDates}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Liste des paiements */}
      <div className="mb-6">
        <PaymentsSection payments={payments} totalPayments={totalPayments} />
      </div>
    </div>
  );
};

export default RightBox;
