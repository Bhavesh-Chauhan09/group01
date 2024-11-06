import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import cimage from './c.png';

const AccountSettings = () => {
  const [settings, setSettings] = useState({
    fullName: '',
    dob: '',
    weight: 0,
    height: 0,
    goal: '',
  });
  const [popupMessage, setPopupMessage] = useState('');

  // Fetch user data from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const formattedDob = user.dob ? user.dob.split('T')[0] : '';
      setSettings({
        fullName: user.fullName || '',
        dob: formattedDob,
        weight: user.weight || 0,
        height: user.height || 0,
        goal: user.goal || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // Make sure the user ID is available and the correct format
      const userId = user.id; // Ensure `id` instead of `_id`
      if (!userId) {
        console.error("User ID is missing, cannot save settings.");
        return;
      }

      const response = await fetch('https://group01-1.onrender.com/api/users/account-settings/update-settings', {
        method: 'PUT',
        headers: {
          'Authorization': user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, ...settings }), // Use userId here
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Updated settings:', updatedUser);

        // Update local storage with the latest settings, including `id`
        const updatedUserData = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        localStorage.setItem('refreshTrigger', Date.now().toString());

        // Update the local state with the new settings
        setSettings({
          fullName: updatedUser.fullName,
          dob: updatedUser.dob.split('T')[0],
          weight: updatedUser.weight,
          height: updatedUser.height,
          goal: updatedUser.goal,
        });

        // Show popup message
        setPopupMessage('Changes saved successfully!');
        setTimeout(() => setPopupMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('Failed to update settings:', errorData);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="account-settings-container">
      <div className="account-settings">
        <h2>Account Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={settings.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={settings.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={settings.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={settings.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fitness Goal</label>
            <input
              type="text"
              name="goal"
              value={settings.goal}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
      <div className="image-container">
        <img src={cimage} alt="Settings" className="settings-image" />
      </div>

      {/* Popup Message */}
      {popupMessage && <div className="popup">{popupMessage}</div>}
    </div>
  );
};

export default AccountSettings;
