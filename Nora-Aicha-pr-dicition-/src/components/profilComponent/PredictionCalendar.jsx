import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PredictionCalendar = () => {
  const [predictionDates, setPredictionDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/admin/prediction-dates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Erreur lors du chargement des dates de prédiction');
        }

        const data = await res.json();
        const formattedDates = data.map(date => new Date(date));
        setPredictionDates(formattedDates);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDates();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isPredictionDay = predictionDates.some(
        d => d.toDateString() === date.toDateString()
      );
      return isPredictionDay ? 'highlight' : null;
    }
  };

  return (
    <div className="mt-6 px-4">
      <h3 className="text-lg font-semibold mb-4 text-[#1D2D66]">
        Dates des prédictions
      </h3>
      <Calendar
        tileClassName={tileClassName}
        onClickDay={(value) => {
          if (predictionDates.some(d => d.toDateString() === value.toDateString())) {
            alert("Prédiction disponible pour ce jour !");
          }
        }}
      />
      <style>
        {`
          .highlight {
            background-color: #FF4D4D !important;
            color: white !important;
            border-radius: 50%;
            font-weight: bold;
          }

          .react-calendar {
            border: none;
            width: 100%;
            max-width: 400px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 1rem;
          }

          .react-calendar__tile--now {
            background: #1D2D66 !important;
            color: white !important;
            border-radius: 50%;
          }

          .react-calendar__tile:enabled:hover {
            background: #e6e6e6;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default PredictionCalendar;
