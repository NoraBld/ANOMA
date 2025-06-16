
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// On définit ici deux dates par mois jusqu'à juin 2025
const defaultPredictionDates = [
  new Date(2025, 2, 10), new Date(2025, 2, 22),  // Mars
  new Date(2025, 3, 8),  new Date(2025, 3, 20),  // Avril
  new Date(2025, 4, 5),  new Date(2025, 4, 18),  // Mai
  new Date(2025, 5, 2),  new Date(2025, 5, 24),  // Juin
];

const CalendarSection = ({ predictionDates = defaultPredictionDates, selectedDate, onDateChange }) => {
  const customTileClass = ({ date }) => {
    const isPrediction = predictionDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    return isPrediction ? 'highlighted-border-date' : null;
  };

  return (
    <div className="w-full">
      
      <style>{`
        .react-calendar {
          background-color: transparent;
          border: none;
          color: white;
          font-family: inherit;
          width: 100%;
        }

        .react-calendar__tile {
          background: transparent;
          color: white;
          border-radius: 8px;
          padding: 10px 0;
          transition: all 0.2s ease;
        }

        .react-calendar__tile--active {
          background: #4A90E2;
          color: white;
        }

        .react-calendar__tile--now {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .react-calendar__navigation {
          background: transparent;
          color: white;
          font-weight: bold;
        }

        .react-calendar__navigation button {
          color: white;
        }

        .react-calendar__month-view__weekdays {
          background: transparent;
          color: #ccc;
        }

        .highlighted-border-date {
          border: 2px solid #FCB17A !important;
          border-radius: 8px;
        }
      `}</style>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={customTileClass}
        className="w-full"
      />
    </div>
  );
};

export default CalendarSection;
