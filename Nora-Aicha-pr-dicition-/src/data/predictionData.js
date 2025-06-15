// src/data/predictionsData.js

export const predictions = [
    {
      id: 1,
      title: "Prédiction Janvier 2024",
      predicted: [120, 135, 150, 160, 155],
      real: [125, 140, 148, 158, 150],
      method: "GRU",
      errorRate: "3.2%",
      params: { epochs: 50, learningRate: 0.01 },
      date: "2024-01-05",
      period: "01/01/2024 - 05/01/2024"
    },
    {
      id: 2,
      title: "Prédiction Février 2024",
      predicted: [100, 110, 105, 115, 120],
      real: [98, 112, 107, 113, 119],
      method: "ARIMA",
      errorRate: "2.5%",
      params: { p: 2, d: 1, q: 2 },
      date: "2024-02-03",
      period: "01/02/2024 - 05/02/2024"
    },
    {
      id: 3,
      title: "Prédiction Mars 2024",
      predicted: [200, 210, 220, 230, 225],
      real: [198, 208, 222, 228, 226],
      method: "SARIMA",
      errorRate: "1.8%",
      params: { p: 1, d: 1, q: 1, P: 1, D: 0, Q: 1, s: 12 },
      date: "2024-03-10",
      period: "06/03/2024 - 10/03/2024"
    }
  ];