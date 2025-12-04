import { Doctor, RouteStep, Ambulance } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Chen',
    department: 'Cardiology',
    rating: 4.9,
    experience: 12,
    image: 'https://picsum.photos/id/64/200/200',
    available: true,
    nextSlot: 'Today, 2:30 PM',
    fees: 1500,
    location: 'Central Heart Institute, Suite 404',
    timings: 'Mon-Fri: 09:00 AM - 04:00 PM'
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    department: 'Neurology',
    rating: 4.8,
    experience: 15,
    image: 'https://picsum.photos/id/177/200/200',
    available: true,
    nextSlot: 'Tomorrow, 10:00 AM',
    fees: 2000,
    location: 'Neuroscience Center, West Wing',
    timings: 'Tue-Sat: 10:00 AM - 06:00 PM'
  },
  {
    id: 'd3',
    name: 'Dr. Emily Rodriguez',
    department: 'Pediatrics',
    rating: 4.9,
    experience: 8,
    image: 'https://picsum.photos/id/342/200/200',
    available: true,
    nextSlot: 'Today, 4:15 PM',
    fees: 1200,
    location: 'Happy Kids Clinic, Main St',
    timings: 'Mon-Fri: 08:30 AM - 03:00 PM'
  },
  {
    id: 'd4',
    name: 'Dr. Michael Chang',
    department: 'Orthopedics',
    rating: 4.7,
    experience: 20,
    image: 'https://picsum.photos/id/1074/200/200',
    available: false,
    nextSlot: 'Wed, 9:00 AM',
    fees: 1800,
    location: 'City Ortho & Trauma Center',
    timings: 'Mon-Thu: 09:00 AM - 05:00 PM'
  },
  {
    id: 'd5',
    name: 'Dr. Lisa Patel',
    department: 'Dermatology',
    rating: 4.6,
    experience: 6,
    image: 'https://picsum.photos/id/449/200/200',
    available: true,
    nextSlot: 'Today, 11:30 AM',
    fees: 1400,
    location: 'Skin Glow Clinic, 2nd Floor',
    timings: 'Wed-Sun: 11:00 AM - 07:00 PM'
  },
  {
    id: 'd6',
    name: 'Dr. Robert Fox',
    department: 'Cardiology',
    rating: 4.5,
    experience: 10,
    image: 'https://picsum.photos/id/1062/200/200',
    available: true,
    nextSlot: 'Tomorrow, 3:00 PM',
    fees: 1600,
    location: 'Heart Care Plaza, Rm 102',
    timings: 'Mon-Fri: 10:00 AM - 02:00 PM'
  }
];

export const MOCK_AMBULANCES: Ambulance[] = [
  {
    id: 'a1',
    provider: 'City Rapid Response',
    type: 'Basic Life Support',
    rating: 4.5,
    eta: '8 mins',
    fees: 1500,
    features: ['Stretcher', 'First Aid', 'Oxygen'],
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'a2',
    provider: 'Apollo Emergency',
    type: 'Advanced Life Support',
    rating: 4.9,
    eta: '5 mins',
    fees: 3500,
    features: ['Ventilator', 'ECG Monitor', 'Paramedic Team'],
    image: 'https://images.unsplash.com/photo-1612531386530-97286d74c2ae?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'a3',
    provider: 'Green Cross ICU',
    type: 'ICU Express',
    rating: 5.0,
    eta: '12 mins',
    fees: 5000,
    features: ['Full ICU Setup', 'Doctor on Board', 'Defibrillator'],
    image: 'https://images.unsplash.com/photo-1516574187841-69301995118a?auto=format&fit=crop&q=80&w=200'
  }
];

export const MOCK_ROUTE: RouteStep[] = [
  { instruction: "Head north on Broadway", distance: "0.5 km", duration: "2 mins", trafficStatus: 'clear' },
  { instruction: "Turn right onto 5th Ave (Avoids construction on 4th)", distance: "1.2 km", duration: "4 mins", trafficStatus: 'moderate' },
  { instruction: "Take the express lane via Downtown Tunnel", distance: "3.0 km", duration: "5 mins", trafficStatus: 'clear' },
  { instruction: "Arrive at General Hospital Emergency Entrance", distance: "0.1 km", duration: "1 min", trafficStatus: 'clear' }
];