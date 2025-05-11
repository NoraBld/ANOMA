import React, { useState } from 'react';
import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';
import ProfileImage from '../components/profilComponent/ProfileImage';
import RightBox from '../components/profilComponent/RightBox'; // RightBox contient Calendar + Paiements

const Profile = () => {
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🔶 Dates communes de prédiction (et de paiement)
  const predictionDates = [
    new Date(2025, 2, 10), new Date(2025, 2, 22),
    new Date(2025, 3, 8), new Date(2025, 3, 20),
    new Date(2025, 4, 5), new Date(2025, 4, 18),
    new Date(2025, 5, 2), new Date(2025, 5, 24),
  ];

  // Paiements basés sur ces dates
  const payments = predictionDates.map((date, i) => ({
    date: date.toLocaleDateString(),          // Format lisible
    amount: `${(10000 + i * 2500)} DA`,       // Montant simulé
  }));

  // Date de dernière activité : la dernière date
  const lastActivityDate = predictionDates[predictionDates.length - 1];

  // Total des paiements
  const totalPayments = payments.reduce((acc, payment) => {
    const amountNumber = parseFloat(payment.amount.replace(' DA', '').replace('DA', '').replace(' ', ''));
    return acc + amountNumber;
  }, 0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="layout-container flex h-screen" style={{ backgroundColor: '#E5E5E5' }}>
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex space-x-6 mb-8">
          {/* Box gauche : Profil */}
          <div className="w-1/2 rounded-xl p-6 shadow-md text-white" style={{ backgroundColor: '#8D91AB' }}>
            <h2 className="text-xl mb-4">Mon Profil</h2>
            <ProfileImage onImageChange={handleImageChange} />
          </div>

          {/* Box droite : Activité, Calendrier, Paiements */}
          <RightBox
            lastActivityDate={lastActivityDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            payments={payments}
            totalPayments={totalPayments}
            predictionDates={predictionDates}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
