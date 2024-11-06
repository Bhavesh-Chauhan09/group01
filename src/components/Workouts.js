import React, { useState } from 'react';
import axios from 'axios';

const AddWorkout = ({ userId, onWorkoutAdded }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(''); // Duration in mins
  const [type, setType] = useState('');
  const [weight, setWeight] = useState(''); // Weight in kgs

  const handleAddWorkout = async (e) => {
    e.preventDefault();

    const newWorkout = {
      title,
      duration: `${duration} mins`, // Automatically append 'mins'
      type,
      weight: `${weight} kgs`, // Automatically append 'kgs'
      date: new Date().toISOString(),
      userId,
    };

    try {
      const response = await axios.post(`https://group01.onrender.com/api/workouts`, newWorkout);
      onWorkoutAdded(response.data);
    } catch (err) {
      console.error('Error adding workout:', err);
    }

    // Reset form fields
    setTitle('');
    setDuration('');
    setType('');
    setWeight('');
  };

  return (
    <form onSubmit={handleAddWorkout} className="add-workout-form">
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Duration (mins)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 45"
          required
        />
      </div>
      <div>
        <label>Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Weight (kgs)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g., 70"
        />
      </div>
      <button type="submit">Add Workout</button>
    </form>
  );
};
export default AddWorkout;
