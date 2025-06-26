import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/acceuil.css';
import imgSrc from '../../assets/images/presentation1.png';

export default function Presentation() {
  const [step, setStep] = useState("welcome");
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const endpoint = role === "admin" ? "login_admin" : "login";

    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motdepasse: password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert("Erreur : " + data.detail);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem(role, JSON.stringify(data[role]));
      navigate(role === "admin" ? "/profile" : "/profileCl");
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      alert("Une erreur est survenue.");
    }
  };

  const renderWelcome = () => (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6"
      style={{
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {/* Overlay léger */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-[#fcb17a] drop-shadow-lg">
          Bienvenue sur ANOMA Predict
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white font-medium leading-relaxed drop-shadow-md">
          Anticipez vos consommations et productions grâce à une solution intelligente,
          <br />
          fiable et parfaitement adaptée à vos besoins énergétiques.
        </p>

        {step === "welcome" && (
          <button
            onClick={() => setStep("select-role")}
            className="mt-4 px-8 py-3 bg-[#fcb17a] text-[#2D3250] text-lg font-semibold rounded-full shadow-md hover:bg-[#e89e5a] transition"
          >
            Se connecter
          </button>
        )}

        {step === "select-role" && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-6 py-2 border border-[#fcb17a] text-white bg-[#424769] rounded-md font-medium focus:outline-none"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() => setStep("login")}
              className="px-6 py-2 bg-[#fcb17a] text-[#2D3250] rounded-md font-semibold shadow hover:bg-[#e89e5a] transition"
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const renderLoginForm = () => (
    <div className="flex h-screen relative">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#2d3250] p-8 relative">
        <button
          onClick={() => setStep("select-role")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-[#fcb17a] text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-[#cfae5e] transition"
          title="Retour"
        >
          ❮
        </button>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Connexion {role === "admin" ? "Admin" : "Client"}
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#fcb17a] focus:outline-none bg-[#424769] text-white"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Mot de passe</label>
              <input
                type="password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#fcb17a] focus:outline-none bg-[#424769] text-white"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center text-white">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm">
                Sauvegarder le mot de passe
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#fcb17a] text-black py-2 px-4 rounded-md transition font-medium hover:bg-[#e89e5a]"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>

      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgSrc})` }}
        title="Double-cliquez pour revenir à l'accueil"
        onDoubleClick={() => setStep("welcome")}
      ></div>
    </div>
  );

  return step === "login" ? renderLoginForm() : renderWelcome();
}
