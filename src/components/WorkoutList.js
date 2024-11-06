import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './WorkoutList.css';
import AddWorkout from './AddWorkout';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const WorkoutList = ({ userId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [weightData, setWeightData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Weight Progress (kg)',
        data: [],
        borderColor: '#f5cccc',
        backgroundColor: '#ff3333',
        fill: true,
      },
    ],
  });
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!userId) return;
      console.log("Fetching workouts for userId:", userId);
      try {
        const response = await axios.get(`https://group01-1.onrender.com/api/workouts/${userId}`);
        setWorkouts(response.data);

        // Prepare data for weight chart
        const newLabels = response.data.map(workout => new Date(workout.date).toLocaleDateString());
        const newWeightData = response.data.map(workout => workout.weight || 0);
        
        setWeightData({
          labels: newLabels,
          datasets: [
            {
              ...weightData.datasets[0],
              data: newWeightData,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching workouts:', err.response?.data || err.message);
      }
    };

    fetchWorkouts();
  }, [userId]);

  const handleWorkoutAdded = (newWorkout) => {
    setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);

    setWeightData(prevData => ({
      labels: [...prevData.labels, new Date(newWorkout.date).toLocaleDateString()],
      datasets: [{
        ...prevData.datasets[0],
        data: [...prevData.datasets[0].data, newWorkout.weight || 0],
      }],
    }));
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await axios.delete(`https://group01-1.onrender.com/api/workouts/${workoutId}`);
      const deletedWorkout = workouts.find(workout => workout._id === workoutId);
      
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout._id !== workoutId));
      
      setWeightData(prevData => {
        const index = prevData.labels.findIndex(label => label === new Date(deletedWorkout.date).toLocaleDateString());
        if (index !== -1) {
          const updatedLabels = [...prevData.labels];
          const updatedData = [...prevData.datasets[0].data];
          updatedLabels.splice(index, 1);
          updatedData.splice(index, 1);
          return {
            labels: updatedLabels,
            datasets: [{
              ...prevData.datasets[0],
              data: updatedData,
            }],
          };
        }
        return prevData;
      });
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  return (
    <section className="workout-list">
      <h2>Recent Workouts</h2>
      <div className="workout-container">
        <div className="workout-details">
          {workouts.map((workout) => (
            <div key={workout._id} className="workout-item">
              <h3>{workout.title}</h3>
              <p>Duration: {workout.duration} mins</p> {/* Add 'mins' for duration */}
              <p>Type: {workout.type}</p>
              <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
              <p>Weight: {workout.weight ? `${workout.weight} kgs` : 'N/A'}</p> {/* Add 'kgs' for weight */}
              <button onClick={() => handleDeleteWorkout(workout._id)} className="delete-button">Delete Workout</button>
            </div>
          ))}
        </div>
        <div className="add-workout-toggle">
          <button onClick={() => setShowAddWorkout(!showAddWorkout)} className="toggle-button">
            {showAddWorkout ? 'Hide Add Workout' : 'Add Workout'}
          </button>
        </div>
        {showAddWorkout && <AddWorkout userId={userId} onWorkoutAdded={handleWorkoutAdded} />}
        <div className="weight-chart">
          <h3>Weight Progress</h3>
          <Line data={weightData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      </div>
    </section>
  );
};

export default WorkoutList;
