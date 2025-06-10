import React, { useState } from 'react';
import DynamicInputComponent from '../../form/DynamicInputComponent';
import hotelbg from '../TravelAgency/assets/hotelbg.png';
import '../TravelAgency/travel.css';

const HotelBooking = () => {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  const handleBookHotel = () => {
    // For simplicity, we'll just log the booking details to the console.
    // In a real application, you'd send this data to a backend server.
    console.log('Booking Details:', {
      location,
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime
    });
    alert('Hotel booked successfully!');
  };

  return (
    <div className="hotel-booking">
      <img src={hotelbg} alt="hotel" className="hotel-bg" />
      <div className="form-container">
        <form>
          <div className="form-group">
            <DynamicInputComponent
              type="text"
              label="Location"
              name="location"
              value={location}
              onTextChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <DynamicInputComponent
              type="date"
              label="Check-In Date : "
              name="checkInDate"
              value={checkInDate}
              onTextChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <DynamicInputComponent
              type="date"
              label="Check-Out Date : "
              name="checkOutDate"
              value={checkOutDate}
              onTextChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <DynamicInputComponent
              type="time"
              label="Check-in Time : "
              name="checkInTime"
              value={checkInTime}
              onTextChange={(e) => setCheckInTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <DynamicInputComponent
              type="time"
              label="Check-out Time : "
              name="checkOutTime"
              value={checkOutTime}
              onTextChange={(e) => setCheckOutTime(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleBookHotel}>
            Book Hotel
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelBooking;
