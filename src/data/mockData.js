// Mock data for TrekSafe

export const mockItinerary = {
  destination: 'Pokhara',
  duration: '5 Days',
  budget: 'NPR 30,000',
  style: 'Adventure + Nature',
  discovery: 'Less-crowded',
  days: [
    {
      day: 1,
      title: 'Kathmandu → Pokhara',
      activities: [
        {
          id: 'act_1',
          time: '08:00',
          name: 'Departure from Kathmandu',
          description: 'Tourist bus departure from Sorhakhutte.',
          cost: 'NPR 1,200',
          travelTime: '6-7 hours',
          type: 'Transport',
          crowd: 'High',
          difficulty: 'Easy',
          tags: ['Transport']
        },
        {
          id: 'act_2',
          time: '15:00',
          name: 'Lakeside Hotel Check-in',
          description: 'Settle into your accommodation near Phewa Lake.',
          cost: '-',
          travelTime: '-',
          type: 'Accommodation',
          crowd: 'Low',
          difficulty: 'Easy',
          tags: ['Rest']
        },
        {
          id: 'act_3',
          time: '16:30',
          name: 'Sunset at Phewa Lake',
          description: 'Peaceful boat ride or lakeside walk during golden hour.',
          cost: 'NPR 600',
          travelTime: '30 mins',
          type: 'Nature',
          crowd: 'Moderate',
          difficulty: 'Easy',
          tags: ['Nature', 'Photography']
        }
      ]
    },
    {
      day: 2,
      title: 'Sunrise & Hidden Gems',
      activities: [
        {
          id: 'act_4',
          time: '05:00',
          name: 'Sarangkot Sunrise',
          description: 'Early morning drive for panoramic Annapurna views.',
          cost: 'NPR 1,500',
          travelTime: '45 mins',
          type: 'Nature',
          crowd: 'High',
          difficulty: 'Easy',
          tags: ['Nature', 'Photography', 'Early']
        },
        {
          id: 'act_5',
          time: '09:00',
          name: 'Breakfast at Local Cafe',
          description: 'Enjoy traditional breakfast away from the main strip.',
          cost: 'NPR 500',
          travelTime: '15 mins',
          type: 'Food',
          crowd: 'Low',
          difficulty: 'Easy',
          tags: ['Food', 'Local']
        },
        {
          id: 'act_6',
          time: '11:00',
          name: 'Hidden Viewpoint Hike',
          description: 'Scenic mountain viewpoint with strong photography opportunities.',
          cost: 'Free',
          travelTime: '2 hours',
          type: 'Adventure',
          crowd: 'Low',
          difficulty: 'Moderate',
          tags: ['Nature', 'Photography', 'Less crowded']
        }
      ]
    }
  ],
  insights: {
    reasoning: 'These activities match your preference for nature, photography, moderate activity, and less-crowded experiences.',
    estimatedCost: 'NPR 30,000',
    distance: '230 km',
    activityCount: 12
  }
};

export const mockTravelGroups = [
  {
    id: 'g1',
    title: 'Pokhara Photography + Hiking',
    travelers: 4,
    date: 'May 14',
    budget: 'Moderate',
    tags: ['Photography', 'Hiking'],
    match: 92
  },
  {
    id: 'g2',
    title: 'Nature + Local Experiences',
    travelers: 3,
    date: 'May 15',
    budget: 'Flexible',
    tags: ['Nature', 'Local'],
    match: 85
  },
  {
    id: 'g3',
    title: 'Sunrise + Hidden Gems',
    travelers: 5,
    date: 'May 14',
    budget: 'Budget',
    tags: ['Early', 'Adventure'],
    match: 78
  }
];

export const mockEmergencyContacts = [
  { name: 'Tourist Police', number: '1144', icon: 'ShieldAlert' },
  { name: 'Ambulance', number: '102', icon: 'Ambulance' },
  { name: 'Police', number: '100', icon: 'PhoneCall' },
  { name: 'Nearest Hospital (Pokhara)', number: '061-520067', icon: 'Hospital' }
];
