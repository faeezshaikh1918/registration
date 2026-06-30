export const locationData = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    states: [
      { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
      { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'] },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    states: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
      { name: 'Texas', cities: ['Austin', 'Houston', 'Dallas'] },
      { name: 'New York', cities: ['New York', 'Buffalo', 'Rochester'] },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer'] },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    states: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns'] },
    ],
  },
]

export function getCountryByName(name) {
  return locationData.find(country => country.name === name) || null
}
