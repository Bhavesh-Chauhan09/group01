import React, { useState } from 'react';
import './AddGoal.css';

const AddGoal = ({ userId, fetchGoals }) => {
  const [day, setDay] = useState('');
  const [distance, setDistance] = useState('');
  const [totalGoals, setTotalGoals] = useState('');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check only day and distance
    if (!day || !distance) {
      setError('Day and Distance are required.');
      return;
    }

    try {
      // Prepare the request body dynamically to exclude empty fields
      const goalData = {
        userId,
        day: Number(day),
        distance: Number(distance)
      };

      // Only include totalGoals and progress if they have values
      if (totalGoals) goalData.totalgoals = Number(totalGoals);
      if (progress) goalData.progress = Number(progress);

      const response = await fetch('https://group01-1.onrender.com//api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        // Refresh goals data after successful addition
        await fetchGoals();
        setDay('');
        setDistance('');
        setTotalGoals('');
        setProgress('');
        setError('');
        setIsOpen(false);
        alert('Goal added successfully!');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add goal.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={`add-goal ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Goal Form' : 'Add Goal'}
      </button>
      {isOpen && (
        <form onSubmit={handleSubmit} className="goal-form">
          <h2>Add Goal</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <label>Day:</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Distance (km):</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            className="toggle-advanced"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            {isAdvancedOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          {isAdvancedOpen && (
            <>
              <div>
                <label>Total Goals:</label>
                <input
                  type="number"
                  value={totalGoals}
                  onChange={(e) => setTotalGoals(e.target.value)}
                />
              </div>
              <div>
                <label>Progress:</label>
                <input
                  type="number"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                />
              </div>
            </>
          )}
          <button type="submit">Add Goal</button>
        </form>
      )}
    </div>
  );
};

export default AddGoal;
