
import React, { useState } from 'react';
import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';
import ProfileImage from '../components/profilComponent/ProfileImage';
import RightBox from '../components/profilComponent/RightBox';

const Profile = () => {
  const [profilePic, setProfilePic] = useState('http://localhost:8000/uploads/portrait.jpg');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const predictionDates = [
    new Date(2025, 2, 10), new Date(2025, 2, 22),
    new Date(2025, 3, 8), new Date(2025, 3, 20),
    new Date(2025, 4, 5), new Date(2025, 4, 18),
    new Date(2025, 5, 2), new Date(2025, 5, 24),
  ];

  const payments = predictionDates.map((date, i) => ({
    date: date.toLocaleDateString(),
    amount: `${(10000 + i * 2500)} DA`,
  }));

  const lastActivityDate = predictionDates[predictionDates.length - 1];

  const totalPayments = payments.reduce((acc, payment) => {
    const amountNumber = parseFloat(payment.amount.replace(' DA', '').replace('DA', '').replace(' ', ''));
    return acc + amountNumber;
  }, 0);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload-profile-pic", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setProfilePic(`http://localhost:8000/${data.url}`);
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
    }
  };

  return (
    <div className="layout-container flex h-screen" style={{ backgroundColor: '#E5E5E5' }}>
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex space-x-6 mb-8">
          <div className="w-1/2 rounded-xl p-6 shadow-md text-white" style={{ backgroundColor: '#8D91AB' }}>
            <h2 className="text-xl mb-4">Mon Profil</h2>
            <ProfileImage onImageChange={handleImageChange} profilePic={profilePic} />
          </div>
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
