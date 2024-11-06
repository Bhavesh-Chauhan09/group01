import React, { useState } from 'react';
import axios from 'axios';
import './AddWorkout.css';

const AddWorkout = ({ userId, onWorkoutAdded }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [weight, setWeight] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newWorkout = { title, duration, date, type, weight, userId };
      const res = await axios.post('https://group01-1.onrender.com//api/workouts', newWorkout);
      onWorkoutAdded(res.data);
      // Reset form fields
      setTitle('');
      setDuration('');
      setDate('');
      setType('');
      setWeight('');
    } catch (err) {
      console.error('Error adding workout:', err);
    }
  };

  return (
    <div className="add-workout-container">
      <h2 onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
        {isCollapsed ? 'Add a New Workout' : 'Hide Workout Form'}
      </h2>
      {!isCollapsed && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <button type="submit">Add Workout</button>
        </form>
      )}
    </div>
  );
};

export default AddWorkout;
