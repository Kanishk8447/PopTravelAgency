import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import homeImage from '../TravelAgency/assets/hero.png';
import Select from 'react-select';
import { notification } from '../../service/notification-Service';
import apiService from '../../service/apiService';
import LoadingComponent from '../../common/Loading';
import Recommend from './Recommend';
import DynamicInputComponent from '../../form/DynamicInputComponent';
import hotelbg from '../TravelAgency/assets/hotelbg.png';
import '../TravelAgency/travel.css';
import DynamicSelectBox from '../../form/DynamicSelectBoxComponent';
import tajHotel from '../TravelAgency/assets/tajHotel.jpg';
import leelaPalace from '../TravelAgency/assets/hotel.jpg';
import grandHyatt from '../TravelAgency/assets/grandHyatt.jpg';


export default function Hero() {
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [locations, setLocations] = useState([]);
  const [inputValueFrom, setInputValueFrom] = useState('');
  const [inputValueTo, setInputValueTo] = useState('');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hotelList = [
    {
      hotelName: 'Taj Hotel',
      hotelLocation: 'India',
      hotelPrice: '10000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Free Wi-Fi, Pool, Gym',
      hotelContact: '1234567890',
      hotelBookingLink: 'https://example.com/booking',
      hotelImage: tajHotel,
      hotelDescription: 'Luxury hotel in the heart of the city.',
      hotelAmenities: 'Spa, Restaurant, Bar',
      hotelCancellationPolicy: 'Free cancellation up to 24 hours before check-in.'
    },
    {
      hotelName: 'Leela Palace',
      hotelLocation: 'India',
      hotelPrice: '12000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Spa, Pool, Gym, Free Wi-Fi',
      hotelContact: '0987654321',
      hotelBookingLink: 'https://example.com/leela',
      hotelImage: leelaPalace,
      hotelDescription: 'A royal stay in the city of heritage.',
      hotelAmenities: 'Luxury Suites, Fine Dining, Spa',
      hotelCancellationPolicy: 'Free cancellation before 48 hours of check-in.'
    },
    {
      hotelName: 'Grand Hyatt',
      hotelLocation: 'Sweden',
      hotelPrice: '15000',
      hotelRating: '4.5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Free Wi-Fi, Indoor Pool, Gym',
      hotelContact: '1122334455',
      hotelBookingLink: 'https://example.com/hyatt',
      hotelImage: grandHyatt,
      hotelDescription: 'Modern luxury in the heart of Stockholm.',
      hotelAmenities: 'Conference Rooms, Bar, Lounge',
      hotelCancellationPolicy: 'Free cancellation up to 72 hours before check-in.'
    },
    {
      hotelName: 'Hilton NYC',
      hotelLocation: 'China',
      hotelPrice: '20000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Pool, Gym, Free Breakfast, Wi-Fi',
      hotelContact: '5566778899',
      hotelBookingLink: 'https://example.com/hilton',
      hotelImage: leelaPalace,
      hotelDescription: 'A luxurious stay in the heart of New York City.',
      hotelAmenities: 'Rooftop Bar, Fine Dining, Spa',
      hotelCancellationPolicy: 'Full refund within 48 hours of booking.'
    },
    {
      hotelName: 'The Ritz',
      hotelLocation: 'China',
      hotelPrice: '25000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Butler Service, Spa, Wi-Fi',
      hotelContact: '6677889900',
      hotelBookingLink: 'https://example.com/ritz',
      hotelImage: tajHotel,
      hotelDescription: 'The epitome of elegance and luxury.',
      hotelAmenities: 'Michelin-starred Dining, Private Chauffeur',
      hotelCancellationPolicy: 'Free cancellation up to 7 days before check-in.'
    },
    {
      hotelName: 'The Oberoi ',
      hotelLocation: 'India',
      hotelPrice: '23000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Private Beach, Pool, Butler Service, Free Wi-Fi',
      hotelContact: '7788990011',
      hotelBookingLink: 'https://example.com/Oberoi',
      hotelImage: grandHyatt,
      hotelDescription: 'An iconic 7-star luxury hotel in India.',
      hotelAmenities: 'Helipad, Rolls-Royce Transfer, Fine Dining',
      hotelCancellationPolicy: 'Non-refundable after booking.'
    },
    {
      hotelName: 'Shangri-La Beijing',
      hotelLocation: 'China',
      hotelPrice: '18000',
      hotelRating: '4.7',
      hotelAvailability: 'Available',
      hotelFacilities: 'Indoor Pool, Gym, Free Wi-Fi',
      hotelContact: '8899001122',
      hotelBookingLink: 'https://example.com/shangri-la',
      hotelImage: grandHyatt,
      hotelDescription: 'A serene escape in the bustling city.',
      hotelAmenities: 'Traditional Tea House, Luxury Spa',
      hotelCancellationPolicy: 'Full refund within 72 hours of booking.'
    },
    {
      hotelName: 'Four Seasons',
      hotelLocation: 'China',
      hotelPrice: '22000',
      hotelRating: '4.8',
      hotelAvailability: 'Available',
      hotelFacilities: 'Harbour View, Free Wi-Fi, Gym, Spa',
      hotelContact: '9911223344',
      hotelBookingLink: 'https://example.com/fourseasons',
      hotelImage: leelaPalace,
      hotelDescription: 'Breathtaking views of the China Bridge.',
      hotelAmenities: 'Infinity Pool, Fine Dining, Lounge',
      hotelCancellationPolicy: 'Free cancellation before 5 days of check-in.'
    },
    {
      hotelName: 'Park Hyatt',
      hotelLocation: 'China',
      hotelPrice: '28000',
      hotelRating: '5',
      hotelAvailability: 'Available',
      hotelFacilities: 'Sky Bar, Free Wi-Fi, Gym, Spa',
      hotelContact: '2233445566',
      hotelBookingLink: 'https://example.com/parkhyatt',
      hotelImage: grandHyatt,
      hotelDescription: 'A stunning cityscape view from Shinjuku.',
      hotelAmenities: 'Zen Garden, Tea Lounge, Infinity Pool',
      hotelCancellationPolicy: 'Full refund within 24 hours of booking.'
    }
  ];

  const locationJSON = [
    {
      label: 'India',
      officialName: 'Republic of India',
      capital: ['New Delhi'],
      region: 'Asia',
      subregion: 'Southern Asia',
      population: 1393409038,
      area: 3287590,
      timezones: ['UTC+05:30'],
      borders: ['AFG', 'BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
      languages: { eng: 'English', hin: 'Hindi' },
      currency: { INR: { name: 'Indian rupee', symbol: '₹' } },
      flag: 'https://flagcdn.com/in.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/in.svg',
      maps: { googleMaps: 'https://goo.gl/maps/WSk3fLwG4vtPQetp7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2011': 35.7 },
      car: { signs: ['IND'], side: 'left' }
    },
    {
      label: 'Sweden',
      officialName: 'Kingdom of Sweden',
      capital: ['Stockholm'],
      region: 'Europe',
      subregion: 'Northern Europe',
      population: 10353442,
      area: 450295,
      timezones: ['UTC+01:00'],
      borders: ['FIN', 'NOR'],
      languages: { swe: 'Swedish' },
      currency: { SEK: { name: 'Swedish krona', symbol: 'kr' } },
      flag: 'https://flagcdn.com/se.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/se.svg',
      maps: { googleMaps: 'https://goo.gl/maps/iqygE491ADVgnBW39' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2018': 30.0 },
      car: { signs: ['S'], side: 'right' }
    },
    {
      label: 'China',
      officialName: "People's Republic of China",
      capital: ['Beijing'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 1402112000,
      area: 9706961,
      timezones: ['UTC+08:00'],
      borders: [
        'AFG',
        'BTN',
        'MMR',
        'HKG',
        'IND',
        'KAZ',
        'PRK',
        'KGZ',
        'LAO',
        'MAC',
        'MNG',
        'NPL',
        'PAK',
        'RUS',
        'TJK',
        'VNM'
      ],
      languages: { cmn: 'Mandarin' },
      currency: { CNY: { name: 'Chinese yuan', symbol: '¥' } },
      flag: 'https://flagcdn.com/cn.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/cn.svg',
      maps: { googleMaps: 'https://goo.gl/maps/p9qC6rFCJzA8fKzD7' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'right',
      gini: { '2016': 38.5 },
      car: { signs: ['CHN'], side: 'right' }
    },
    {
      label: 'Japan',
      officialName: 'Japan',
      capital: ['Tokyo'],
      region: 'Asia',
      subregion: 'Eastern Asia',
      population: 125960000,
      area: 377930,
      timezones: ['UTC+09:00'],
      borders: [],
      languages: { jpn: 'Japanese' },
      currency: { JPY: { name: 'Japanese yen', symbol: '¥' } },
      flag: 'https://flagcdn.com/jp.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/jp.svg',
      maps: { googleMaps: 'https://goo.gl/maps/NGTLSCSrA8bMrvnX9' },
      independent: true,
      unMember: true,
      startOfWeek: 'monday',
      drivingSide: 'left',
      gini: { '2013': 32.1 },
      car: { signs: ['J'], side: 'left' }
    },
    {
      label: 'United States',
      officialName: 'United States of America',
      capital: ['Washington, D.C.'],
      region: 'Americas',
      subregion: 'Northern America',
      population: 331002651,
      area: 9833517,
      continent: ['North America'],
      timezones: [
        'UTC−12:00',
        'UTC−11:00',
        'UTC−10:00',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−07:00',
        'UTC−06:00',
        'UTC−05:00',
        'UTC+10:00',
        'UTC+12:00'
      ],
      borders: ['CAN', 'MEX'],
      languages: { eng: 'English' },
      currency: { USD: { name: 'United States dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/us.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/us.svg',
      maps: { googleMaps: 'https://goo.gl/maps/5T6E5sQnZf9A9T2J6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'USA',
      latlng: [38.0, -97.0],
      postalCodeFormat: '#####-####'
    },
    {
      label: 'Germany',
      officialName: 'Federal Republic of Germany',
      capital: ['Berlin'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 83783942,
      area: 357114,
      continent: ['Europe'],
      timezones: ['UTC+01:00'],
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      languages: { deu: 'German' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/de.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/de.svg',
      maps: { googleMaps: 'https://goo.gl/maps/mD9FBMq1nvXUBrkv6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'GER',
      latlng: [51.0, 9.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'France',
      officialName: 'French Republic',
      capital: ['Paris'],
      region: 'Europe',
      subregion: 'Western Europe',
      population: 65273511,
      area: 551695,
      continent: ['Europe'],
      timezones: [
        'UTC−10:00',
        'UTC−09:30',
        'UTC−09:00',
        'UTC−08:00',
        'UTC−04:00',
        'UTC−03:00',
        'UTC+01:00',
        'UTC+03:00',
        'UTC+04:00',
        'UTC+05:00',
        'UTC+11:00',
        'UTC+12:00'
      ],
      borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
      languages: { fra: 'French' },
      currency: { EUR: { name: 'Euro', symbol: '€' } },
      flag: 'https://flagcdn.com/fr.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/fr.svg',
      maps: { googleMaps: 'https://goo.gl/maps/g7QxxSFsWyTPKuzd7' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'FRA',
      latlng: [46.0, 2.0],
      postalCodeFormat: '#####'
    },
    {
      label: 'Brazil',
      officialName: 'Federative Republic of Brazil',
      capital: ['Brasília'],
      region: 'Americas',
      subregion: 'South America',
      population: 212559417,
      area: 8515767,
      continent: ['South America'],
      timezones: ['UTC−05:00', 'UTC−04:00', 'UTC−03:00', 'UTC−02:00'],
      borders: ['ARG', 'BOL', 'COL', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
      languages: { por: 'Portuguese' },
      currency: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Australia',
      officialName: 'Commonwealth of Australia',
      capital: ['Canberra'],
      region: 'Oceania',
      subregion: 'Australia and New Zealand',
      population: 25499884,
      area: 7692024,
      continent: ['Oceania'],
      timezones: [
        'UTC+05:00',
        'UTC+06:30',
        'UTC+07:00',
        'UTC+08:00',
        'UTC+09:30',
        'UTC+10:00',
        'UTC+10:30',
        'UTC+11:30'
      ],
      borders: [],
      languages: { eng: 'English' },
      currency: { AUD: { name: 'Australian dollar', symbol: '$' } },
      flag: 'https://flagcdn.com/br.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.svg',
      maps: { googleMaps: 'https://goo.gl/maps/waCKk21HeeqFzkNC9' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'BRA',
      latlng: [-10.0, -55.0],
      postalCodeFormat: '#####-###'
    },
    {
      label: 'Russia',
      officialName: 'Russian Federation',
      capital: ['Moscow'],
      region: 'Europe',
      subregion: 'Eastern Europe',
      population: 144104080,
      area: 17098242,
      continent: ['Europe', 'Asia'],
      timezones: ['UTC+03:00 to UTC+12:00'],
      borders: [
        'AZE',
        'BLR',
        'CHN',
        'EST',
        'FIN',
        'GEO',
        'KAZ',
        'PRK',
        'LVA',
        'LTU',
        'MNG',
        'NOR',
        'POL',
        'UKR'
      ],
      languages: { rus: 'Russian' },
      currency: { RUB: { name: 'Russian ruble', symbol: '₽' } },
      flag: 'https://flagcdn.com/ru.svg',
      coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/ru.svg',
      maps: { googleMaps: 'https://goo.gl/maps/6ua6CX1mV2z5eYxZ6' },
      independent: true,
      unMember: true,
      drivingSide: 'right',
      fifa: 'RUS',
      latlng: [60, 100],
      postalCodeFormat: '######'
    }
  ];

  // Fetch locations (cities, states, countries) from Google API
  useEffect(() => {
    const fetchLocations = async (query = '') => {
      try {
        // const response = await axios.get('https://restcountries.com/v3.1/all');

        // const places = response.data
        //   .filter((place) => place.name.common.toLowerCase().includes(query.toLowerCase())) // Filter based on query
        //   .map((place) => ({
        //     value: place.cca2, // Use 'cca2' as the unique identifier (country code)
        //     label: place.name.common, // Use the common name of the country as the label
        //     type: 'location', // Type to classify the data (can be 'country', 'state', etc.)
        //     capital: place.capital ? place.capital[0] : 'N/A', // Get the capital, or 'N/A' if not available
        //     flag: place.flags ? place.flags.png : 'N/A' // Get the flag image URL if available
        //   }));

        // setLocations(places);
        setLocations(locationJSON);
      } catch (error) {
        console.error('Error fetching locations:', error);
        notification('error', 'Failed to fetch locations!');
      }
    };

    // Fetch locations for both input fields
    fetchLocations(inputValueFrom); // Fetch locations based on the 'From' field input value
    fetchLocations(inputValueTo); // Fetch locations based on the 'To' field input value
  }, [inputValueFrom, inputValueTo]); // Trigger fetch whenever input values change

  const handleInputChangeFrom = (inputValue) => {
    setInputValueFrom(inputValue); // Update the input value state for 'From' field
  };

  const handleInputChangeTo = (inputValue) => {
    setInputValueTo(inputValue); // Update the input value state for 'To' field
  };

  useEffect(()=>{
    const fetchData= async ()=>{
      try {
        // Make a call to your backend API with the selected data
        const response = await apiService.getData('list');
        if (response) {
        
          notification('success', 'Search successful!');
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error:', error);
        notification('error', 'Failed to search. Try again!');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [data]);


  const handleExplore = async () => {
    if (!fromLocation || !toLocation || !checkIn || !checkOut) {
      notification('error', 'Please select all fields');
      return;
    }
    setIsLoading(true);

    const requestData = {
      // from: fromLocation.label,
      // to: toLocation.label,
      // checkIn,
      // checkOut
      input_message: `Travel Destination Finder: I'll help you discover great travel destinations based on your preferences. Simply share:

          FROM LOCATION: ${fromLocation.label}
          TO LOCATION: ${toLocation.label}
          CHECK-IN DATE: ${checkIn}
          CHECK-OUT DATE: ${checkOut}

          For example: "FROM LOCATION: Goa,TO LOCATION: Delhi CHECK-IN DATE: December 20, 2023, CHECK-OUT DATE: December 27, 2023"

          I'll provide detailed information about your destination including:
          • Popular attractions and activities
          • Accommodation options for different budgets
          • Transportation recommendations
          • Seasonal considerations for your travel dates
          • Estimated overall budget and fetch available tickets
          • Cultural experiences and local cuisine

          Tour Packages: I will also provide information on various tour packages available, including:

            Types of Packages: Examples of available travel packages (e.g., all-inclusive, adventure, luxury).
            Inclusions: What is typically included in these packages (e.g., meals, tours, transportation).
            Comparisons: Comparing different packages to help you choose the best option.

          Additionally, I can check the available tickets for flights and trains, fetching the latest details from  or provide me the URL.
          If you have specific interests (beaches, mountains, historical sites, adventure activities, etc.), please mention those as well for more tailored recommendations!

          Ready to plan your perfect getaway? Just fill in your details above!
          `
    };

    try {
      // Make a call to your backend API with the selected data
      const response = await apiService.postData(
        'initiative/e1027b83-2499-41a3-a4f5-a5fd968c4c53',
        // 'initiative/c844be48-660b-40f1-ac82-c0a8bd6713a2',
        // 'initiative/c5663eef-0fcd-42d3-8d67-455fd1df391a',
        requestData
      );
      if (response) {
        setData(response.output_text);
        notification('success', 'Search successful!');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      notification('error', 'Failed to search. Try again!');
    } finally {
      setIsLoading(false);
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    secretKey: ''
  });

  const handleChangeModel = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [hotel, sethotel] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');

  const handleBookHotel = () => {
    // e.preventDefault();
    // For simplicity, we'll just log the booking details to the console.
    // In a real application, you'd send this data to a backend server.
   
    // alert('Hotel booked successfully!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      notification('success', 'Hotel booked successfully!');
    }, 2000);
  };
  const filteredHotels = toLocation
    ? hotelList.filter((hotel) =>
        hotel.hotelLocation.toLowerCase().includes(toLocation.label.toLowerCase())
      )
    : hotelList;

  const handleChange = (name, value) => {
    const updatedValue = value;
    sethotel((prevValues) => ({ ...prevValues, [name]: updatedValue }));
  };
  const handleHotelChange = (name, value) => {
    // Find the selected hotel object from filteredHotels
    const selectedHotel = filteredHotels.find((hotel) => hotel.hotelName === value);

    if (!selectedHotel) {
      console.warn('Hotel not found:', value);
      return;
    }

    sethotel(selectedHotel); // Store the full hotel object
    handleChange(name, selectedHotel);
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <Section id="hero row">
        <div className="background">
          <img src={homeImage} alt="Travel" />
        </div>
        <div className="content">
          <div className="title">
            <h1>TRAVEL TO EXPLORE</h1>
            <p>Find destinations at city, state, or country levels.</p>
          </div>
          <div className="search col-md-9">
            <div className="container  col-md-3">
              <label>From</label>
              <Select
                options={locations}
                value={fromLocation}
                onChange={setFromLocation}
                onInputChange={handleInputChangeFrom}
                placeholder="Search for Country..."
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '250px' // Fixed width for the select container
                  }),
                  control: (provided) => ({
                    ...provided,
                    width: '100%',
                    border: 'none', // Removes border
                    boxShadow: 'none' // Prevents focus outline
                  })
                }}
              />
            </div>
            <div className="container  col-md-3">
              <label>To</label>
              <Select
                options={locations}
                value={toLocation}
                onChange={setToLocation}
                onInputChange={handleInputChangeTo}
                placeholder="Search for destination..."
                classNames={{
                  container: () => 'bg-white border border-3 rounded-5'
                }}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '250px'
                  }),
                  control: (provided) => ({
                    ...provided,
                    width: '100%',
                    border: 'none', // Removes border
                    boxShadow: 'none' // Prevents focus outline
                  })
                }}
              />
            </div>
            <div className="container  col-md-3">
              <label>Check-in</label>
              <input
                type="date"
                className=" bg-white border-3 rounded-2"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="container  col-md-3">
              <label>Check-out</label>
              <input
                type="date"
                value={checkOut}
                className=" bg-white border-3 rounded-2"
                onChange={(e) => setCheckOut(e.target.value)}
                min={
                  checkIn
                    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
                }
              />
            </div>
            <button className="ml-4" onClick={handleExplore}>
              Explore Now
            </button>
          </div>
        </div>
      </Section>
      {/*<div>
        <div className="d-flex justify-content-center m-3">
          {data && (
            <button
              data-bs-toggle="modal"
              data-bs-target="#customModal"
              className="rounded btn btn-primary p-3"
              type="button"
              style={{}}>
              🏨 Book Hotel
            </button>
          )}
        </div>

         <div
          className="modal fade custom-modal-class high-zindex-blur-background"
          id="customModal"
          tabIndex={-1}
          aria-labelledby="customModalLabel"
          data-bs-keyboard="false"
          data-bs-backdrop="static"
          aria-hidden="true"
          // onClick={() => setIsExpanded(false)}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="customModalLabel">
                  Hotel Booking
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="hotel-booking">
                  <img src={hotelbg} alt="hotel" className="hotel-bg" />
                  <div className="form-container overflow-auto">
                    <form>
                      <div className="form-group ">
                        //  <DynamicInputComponent
                        //   type="text"
                        //   label="Select Hotel"
                        //   name="hotel"
                        //   value={hotel}
                        //   onTextChange={(e) => sethotel(e.target.value)}
                        // /> 
                        <DynamicSelectBox
                          label="Select Hotel"
                          name="hotel"
                          dynamicOptions={filteredHotels.map((hotel) => ({
                            value: hotel.hotelName,
                            label: hotel.hotelName
                          }))}
                          // onSelectChange={(selectedOption) => {
                          //   sethotel(selectedOption.value);
                          // }}
                          onSelectChange={handleHotelChange}
                          placeholder="Select a hotel"
                          dynamicClass=""
                        />
                      </div>
                      {hotel && (
                        <div className="destination p-3 d-flex">
                          <div className="d-flex align-items-center">
                            <img
                              className="hotel-image"
                              src={hotel.hotelImage}
                              alt={hotel.hotelName}
                            />
                          </div>
                          <div className="ml-5">
                            <h3>{hotel.hotelName}</h3>
                            <p>{hotel.hotelDescription}</p>
                            <div className="info">
                              <div className="services">
                                <span>
                                  <strong>Facilities:</strong> {hotel.hotelFacilities}
                                </span>
                              </div>
                              <div className="amenities">
                                <span>
                                  <strong>Amenities:</strong> {hotel.hotelAmenities}
                                </span>
                              </div>
                              <h5>₹ {hotel.hotelPrice} per night</h5>
                            </div>
                            <div className="distance">
                              <span>
                                <strong>Rating:</strong> {hotel.hotelRating} ⭐
                              </span>
                            </div>
                            <div className="available">
                              <span>
                                <strong>Availability:</strong> {hotel.hotelAvailability}
                              </span>
                            </div>
                            <div className="location">
                              <span>
                                <strong>Location:</strong> {hotel.hotelLocation}
                              </span>
                            </div>
                            <div className="contact">
                              <span>
                                <strong>Contact:</strong> {hotel.hotelContact}
                              </span>
                            </div>
                            <div className="cancellation-policy">
                              <span>
                                <strong>Cancellation Policy:</strong>{' '}
                                {hotel.hotelCancellationPolicy}
                              </span>
                            </div>
                          //    <a
                          //   href={hotel.hotelBookingLink}
                          //   target="_blank"
                          //   rel="noopener noreferrer">
                          //   Book Now
                          // </a> 
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="form-group  col-md-6">
                          <DynamicInputComponent
                            type="date"
                            label="Check-In Date : "
                            name="checkInDate"
                            // value={checkInDate}
                            value={checkIn}
                            onTextChange={(e) => setCheckInDate(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <DynamicInputComponent
                            type="date"
                            label="Check-Out Date : "
                            name="checkOutDate"
                            // value={checkOutDate}
                            value={checkOut}
                            onTextChange={(e) => setCheckOutDate(e.target.value)}
                          />
                        </div>
                      </div>
                      //  <div className="row">
                      //   <div className="form-group col-md-6">
                      //     <DynamicInputComponent
                      //       type="time"
                      //       label="Check-in Time : "
                      //       name="checkInTime"
                      //       value={checkInTime}
                      //       onTextChange={(e) => setCheckInTime(e.target.value)}
                      //     />
                      //   </div>
                      //   <div className="form-group  col-md-6">
                      //     <DynamicInputComponent
                      //       type="time"
                      //       label="Check-out Time : "
                      //       name="checkOutTime"
                      //       value={checkOutTime}
                      //       onTextChange={(e) => setCheckOutTime(e.target.value)}
                      //     />
                      //   </div>
                      // </div> 
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBookHotel();
                        }}
                        className="btn btn-primary">
                        {isLoading ? 'Booking...' : 'Book Hotel'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>*/}

      {data && <Recommend data={data} />}
    </>
  );
}

const Section = styled.section`
  position: relative;
  margin-top: 2rem;
  width: 100%;
  height: 100%;
  .background {
    height: 100%;
    img {
      width: 100%;
      filter: brightness(60%);
    }
  }
  .content {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .title {
      color: white;
      h1 {
        font-size: 3rem;
        letter-spacing: 0.2rem;
      }
      p {
        text-align: center;
        padding: 0 30vw;
        margin-top: 0.5rem;
        font-size: 1.2rem;
      }
    }
    .search {
      display: flex;
      background-color: #ffffffce;
      padding: 0.5rem;
      border-radius: 0.5rem;
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 1.5rem;
        label {
          font-size: 1.1rem;
          color: #03045e;
        }
        input {
          background-color: transparent;
          border: none;
          text-align: center;
          color: black;
          &[type='date'] {
            padding-left: 1rem;
          }
          &::placeholder {
            color: black;
          }
          &:focus {
            outline: none;
          }
        }
        .css-2b097c-container {
          width: 100%;
          min-width: 200px;
        }
      }
      button {
        padding: 1rem;
        cursor: pointer;
        border-radius: 0.3rem;
        border: none;
        color: white;
        background-color: #4361ee;
        font-size: 1.1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        &:hover {
          background-color: #023e8a;
        }
      }
    }
  }
  @media screen and (max-width: 980px) {
    .search {
      flex-direction: column;
      padding: 1rem;
      gap: 0.8rem;
      .container {
        padding: 0 0.8rem;
      }
    }
  }
`;
