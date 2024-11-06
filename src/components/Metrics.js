
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
  ScatterController,
  Filler,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import axios from 'axios';
import './Metrics.css';

const Metrics = () => {
  const [metricsData, setMetricsData] = useState({
    distanceCovered: 0,
    caloriesBurnt: 0,
    weightLost: 0,
  });
  const [scatterData, setScatterData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve user ID from localStorage
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    if (!userId) {
      setError("User ID is missing, cannot fetch metrics.");
      return;
    }

    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`https://group01-1.onrender.com/api/metrics/calculate/${userId}`);
        const { totalDistance, caloriesBurned, weightLost } = res.data;

        setMetricsData({
          distanceCovered: totalDistance,
          caloriesBurnt: caloriesBurned,
          weightLost: weightLost,
        });

        const goalsRes = await axios.get(`http://localhost:5000/api/goals/${userId}`);
        const scatterPoints = goalsRes.data.map((goal) => ({
          x: goal.distance,
          y: goal.distance * (caloriesBurned / totalDistance),
        }));
        setScatterData(scatterPoints);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const barData = {
    labels: ['Distance Covered', 'Calories Burnt in Hundreds', 'Weight Lost'],
    datasets: [
      {
        label: 'Metrics Progress',
        data: [metricsData.distanceCovered, metricsData.caloriesBurnt, metricsData.weightLost],
        backgroundColor: ['#ff9999', '#ff3333', '#ff6666'],
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Calories vs Distance',
        data: scatterData,
        backgroundColor: '#ff6666',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: { beginAtZero: true },
      x: { beginAtZero: true },
    },
  };

  return (
    <section className="metrics">
      <h2>Fitness Metrics</h2>
      <div className="chart-container">
        <h3>Progress Chart</h3>
        <Bar data={barData} options={options} />
      </div>
      <div className="chart-container">
        <h3>Calories vs Distance</h3>
        <Scatter data={scatterChartData} options={options} />
      </div>
    </section>
  );
};

export default Metrics;
