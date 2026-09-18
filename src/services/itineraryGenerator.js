const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeText = (value) => String(value || '').trim();

const parseDate = (dateValue) => {
  if (!dateValue) return null;
  const [year, month, day] = String(dateValue).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const toISODate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateTotalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 5;

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!(start instanceof Date) || !(end instanceof Date) || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 5;
  }

  if (end < start) {
    return 5;
  }

  const diff = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
  return diff > 0 ? diff : 1;
};

const addDays = (dateString, offset) => {
  const date = parseDate(dateString);
  if (!date) return dateString;
  date.setUTCDate(date.getUTCDate() + offset);
  return toISODate(date);
};

const clampBudget = (budget = 'Mid-range') => {
  const normalized = normalizeText(budget).toLowerCase();
  if (normalized.includes('premium')) return 'premium';
  if (normalized.includes('budget')) return 'budget';
  return 'mid-range';
};

const normalizeActivityNames = (selectedActivities = []) => {
  const items = Array.isArray(selectedActivities) ? selectedActivities : [];

  return items.map((item) => {
    if (typeof item === 'string') {
      const value = normalizeText(item).toLowerCase();
      if (value.includes('trek')) return 'trekking';
      if (value.includes('hike')) return 'day_activity';
      if (value.includes('parag')) return 'paragliding';
      if (value.includes('raft')) return 'rafting';
      if (value.includes('food') || value.includes('cafe') || value.includes('meal')) return 'food';
      if (value.includes('culture') || value.includes('temple') || value.includes('heritage') || value.includes('museum') || value.includes('monastery')) return 'culture';
      if (value.includes('nature') || value.includes('waterfall') || value.includes('lake') || value.includes('sunrise') || value.includes('sunset') || value.includes('wildlife')) return 'nature';
      if (value.includes('wellness') || value.includes('yoga') || value.includes('spa') || value.includes('relax')) return 'wellness';
      return 'day_activity';
    }

    if (item && typeof item === 'object') {
      return normalizeText(item.type || item.name || '').toLowerCase().replace(/\s+/g, '_');
    }

    return 'day_activity';
  });
};

const money = (value) => Number(value || 0);

const tripCostByBudget = (budget) => {
  const normalized = clampBudget(budget);
  const scale = {
    budget: 0.8,
    'mid-range': 1,
    premium: 1.45
  };
  return scale[normalized] || 1;
};

const activityTemplate = ({
  type,
  name,
  location,
  description,
  startTime,
  endTime,
  durationHours,
  activityCost,
  transportCost = 0,
  foodCost = 0,
  entryFee = 0,
  totalCost = 0,
  extra = {}
}) => ({
  type,
  name,
  location,
  description,
  startTime,
  endTime,
  durationHours,
  activityCost,
  transportCost,
  foodCost,
  entryFee,
  totalCost,
  ...extra
});

const buildDayActivity = ({ name, location, startTime, endTime, description, cost, transport = 0, food = 0 }) => activityTemplate({
  type: 'day_activity',
  name,
  location,
  description,
  startTime,
  endTime,
  durationHours: Math.max(1, Math.round((new Date(`2026-01-01T${endTime}`) - new Date(`2026-01-01T${startTime}`)) / 3600000) || 2),
  activityCost: cost,
  transportCost: transport,
  foodCost: food,
  totalCost: cost + transport + food,
  extra: { entryFee: 0 }
});

const buildTrekkingActivity = ({ destination, budget, durationDays = 2, dayIndex = 1, totalDays = 5 }) => {
  const budgetFactor = tripCostByBudget(budget);
  const routeMap = {
    Kathmandu: 'Nagarkot Ridge Trail',
    Pokhara: 'Poon Hill Traverse',
    Chitwan: 'Rapti Valley Nature Trail',
    Mustang: 'Lo Manthang Circuit',
    'Everest Region': 'Namche to Khumjung Route',
    default: 'Scenic Himalayan Trail'
  };

  const route = routeMap[destination] || routeMap.default;
  const startPoint = destination === 'Pokhara' ? 'Pokhara Lakeside' : destination === 'Kathmandu' ? 'Nagarkot' : `${destination} Base`;

  return {
    type: 'trekking',
    name: `${route} - Day ${dayIndex}`,
    route,
    startPoint,
    endPoint: destination === 'Pokhara' ? 'Poon Hill Viewpoint' : `${destination} Trailhead`,
    difficulty: dayIndex === 1 ? 'Moderate' : 'Challenging',
    durationDays,
    durationHours: dayIndex === 1 ? 5 : 6,
    distance: dayIndex === 1 ? '8-10 km' : '10-14 km',
    elevation: dayIndex === 1 ? '1,500-2,000 m' : '2,000-2,800 m',
    guideRequired: true,
    guideCost: Math.round(3200 * budgetFactor),
    permitRequired: destination === 'Mustang' || destination === 'Everest Region',
    permitCost: destination === 'Mustang' ? 3500 : destination === 'Everest Region' ? 4500 : 0,
    transportCost: Math.round(1800 * budgetFactor),
    equipmentRequired: ['Trekking boots', 'Daypack', 'Water bottle', 'Sun protection'],
    activityCost: Math.round(4200 * budgetFactor),
    weatherDependent: true,
    bestTime: 'Early morning or clear weather window',
    safetyInformation: 'Subject to weather and local trail conditions. Guide recommended especially for higher elevations.',
    bookingInformation: 'Availability should be confirmed with the local provider.'
  };
};

const buildParaglidingActivity = ({ destination, budget }) => {
  const budgetFactor = tripCostByBudget(budget);
  const locationMap = {
    Kathmandu: 'Boudhanath / Chandragiri ridge',
    Pokhara: 'Sarangkot launch point',
    default: 'Best launch point in the region'
  };

  return {
    type: 'paragliding',
    name: 'Paragliding Experience',
    location: locationMap[destination] || locationMap.default,
    takeoffPoint: destination === 'Pokhara' ? 'Sarangkot' : 'High ridge launch',
    landingPoint: destination === 'Pokhara' ? 'Phewa Valley' : 'Safe landing zone',
    flightDuration: '15-25 minutes',
    totalExperienceDuration: '2-3 hours',
    estimatedPrice: Math.round(12000 * budgetFactor),
    transportCost: Math.round(1800 * budgetFactor),
    weatherDependent: true,
    bestTime: 'Morning to early afternoon',
    requirements: ['Weight and weather restrictions apply', 'Light weight clothing recommended'],
    bookingInformation: 'Availability should be confirmed with the local provider.'
  };
};

const buildFoodExperience = ({ destination, budget, meal = 'Lunch', travelPace = 'Balanced' }) => {
  const budgetFactor = tripCostByBudget(budget);
  const localCuisine = destination === 'Kathmandu' ? 'Newari & momos' : destination === 'Pokhara' ? 'Gurkha-style meals & local Thakali' : 'Nepali specialties';

  return {
    type: 'food',
    name: `${meal} Experience`,
    location: `${destination} local market or café`,
    cuisine: localCuisine,
    meal,
    timing: meal === 'Breakfast' ? '08:00-09:00' : meal === 'Lunch' ? '12:30-14:00' : '19:00-20:30',
    description: `Enjoy authentic ${localCuisine.toLowerCase()} with a local, budget-conscious dining experience suited for ${travelPace.toLowerCase()} travel.`,
    estimatedCost: Math.round(700 * budgetFactor),
    activityCost: Math.round(700 * budgetFactor),
    foodCost: Math.round(700 * budgetFactor)
  };
};

const buildCultureActivity = ({ destination, budget }) => {
  const budgetFactor = tripCostByBudget(budget);
  return {
    type: 'culture',
    name: 'Heritage & Culture Walk',
    location: destination === 'Kathmandu' ? 'Old Kathmandu & Durbar Square' : destination === 'Pokhara' ? 'Lakeside cultural lane' : `${destination} heritage district`,
    description: 'A culturally rich walk through historic lanes, temples, and local life.',
    durationHours: 2,
    openingHours: 'Typically 9:00-17:00',
    entryFee: 0,
    transportCost: Math.round(700 * budgetFactor),
    activityCost: Math.round(1200 * budgetFactor),
    totalCost: Math.round(1900 * budgetFactor)
  };
};

const buildNatureActivity = ({ destination, budget }) => {
  const budgetFactor = tripCostByBudget(budget);
  return {
    type: 'nature',
    name: 'Scenic Nature Stop',
    location: destination === 'Pokhara' ? 'Phewa Lake viewpoint' : destination === 'Kathmandu' ? 'Swayambhu ridge' : `${destination} landscape viewpoint`,
    description: 'A short scenic session designed for a relaxed pace and light walking.',
    durationHours: 2,
    travelTime: '30-60 minutes',
    entryFee: 0,
    activityCost: Math.round(400 * budgetFactor),
    transportCost: Math.round(500 * budgetFactor),
    totalCost: Math.round(900 * budgetFactor)
  };
};

const buildWellnessActivity = ({ destination, budget }) => {
  const budgetFactor = tripCostByBudget(budget);
  return {
    type: 'wellness',
    name: 'Wellness & Recovery Session',
    location: `${destination} wellness studio or lodge`,
    description: 'A calm reset with gentle movement, stretching, or spa-style recovery.',
    durationHours: 1.5,
    activityCost: Math.round(2500 * budgetFactor),
    transportCost: 0,
    totalCost: Math.round(2500 * budgetFactor)
  };
};

const buildRaftingActivity = ({ destination, budget }) => {
  const budgetFactor = tripCostByBudget(budget);
  return {
    type: 'rafting',
    name: 'Whitewater Rafting',
    location: destination === 'Pokhara' ? 'Seti River' : 'Local river route',
    river: destination === 'Pokhara' ? 'Seti River' : 'Regional river stretch',
    durationHours: 2,
    difficulty: 'Moderate',
    transportCost: Math.round(1500 * budgetFactor),
    activityCost: Math.round(6500 * budgetFactor),
    guideRequired: true,
    safetyInformation: 'Subject to river conditions and weather. Availability should be confirmed with the local provider.',
    bestTime: 'Morning after rainfall and before heavy monsoon flow',
    weatherDependent: true
  };
};

const buildArrivalDay = ({ destination, budget, dayNumber, totalDays }) => {
  const arrivalActivities = [
    buildDayActivity({
      name: 'Arrival and local orientation',
      location: destination,
      startTime: '09:00',
      endTime: '10:30',
      description: 'Settle in, check the local area, and confirm your travel plan for the stay.',
      cost: Math.round(600 * tripCostByBudget(budget)),
      transport: Math.round(900 * tripCostByBudget(budget)),
      food: Math.round(500 * tripCostByBudget(budget))
    }),
    buildDayActivity({
      name: 'Easy evening stroll',
      location: `${destination} central area`,
      startTime: '17:00',
      endTime: '18:30',
      description: 'A low-pressure walk to acclimatize and settle into the destination.',
      cost: Math.round(400 * tripCostByBudget(budget)),
      transport: 0,
      food: Math.round(350 * tripCostByBudget(budget))
    })
  ];

  return { day: dayNumber, date: '', theme: 'Arrival and Light Exploration', activities: arrivalActivities, dailyTotal: arrivalActivities.reduce((sum, act) => sum + Number(act.totalCost || 0), 0) };
};

const buildDepartureDay = ({ destination, budget, dayNumber, totalDays }) => {
  const departureActivities = [
    buildDayActivity({
      name: 'Final local lookout',
      location: destination,
      startTime: '08:00',
      endTime: '09:30',
      description: 'A final short activity before leaving the destination.',
      cost: Math.round(400 * tripCostByBudget(budget)),
      transport: 0,
      food: Math.round(350 * tripCostByBudget(budget))
    }),
    buildDayActivity({
      name: 'Departure transfer',
      location: `${destination} transit point`,
      startTime: '10:30',
      endTime: '12:00',
      description: 'Transfer out with time to account for road or airport travel.',
      cost: 0,
      transport: Math.round(1300 * tripCostByBudget(budget)),
      food: 0
    })
  ];

  return { day: dayNumber, date: '', theme: 'Departure and Wrap-Up', activities: departureActivities, dailyTotal: departureActivities.reduce((sum, act) => sum + Number(act.totalCost || 0), 0) };
};

export const generateDynamicItinerary = (preferences = {}) => {
  const destination = normalizeText(preferences.destination || 'Pokhara');
  const startDate = normalizeText(preferences.startDate || '2026-09-18');
  const endDate = normalizeText(preferences.endDate || '2026-09-22');
  const selectedActivities = Array.isArray(preferences.selectedActivities) && preferences.selectedActivities.length > 0
    ? preferences.selectedActivities
    : Array.isArray(preferences.style)
      ? preferences.style
      : ['Day Activities'];
  const activityNames = normalizeActivityNames(selectedActivities);
  const totalDays = calculateTotalDays(startDate, endDate);
  const totalNights = Math.max(totalDays - 1, 0);
  const budget = normalizeText(preferences.budget || 'Mid-range');
  const travelPace = normalizeText(preferences.travelPace || 'Balanced');
  const travelWith = normalizeText(preferences.group || preferences.travelingWith || 'Solo');
  const discoveryPreferences = Array.isArray(preferences.discoveryPreferences) ? preferences.discoveryPreferences : [];
  const additionalInstructions = normalizeText(preferences.userNotes || preferences.additionalInstructions || '');

  const selectedSet = new Set(activityNames);
  const includeTrekking = selectedSet.has('trekking');
  const includeParagliding = selectedSet.has('paragliding');
  const includeRafting = selectedSet.has('rafting');
  const includeFood = selectedSet.has('food');
  const includeCulture = selectedSet.has('culture');
  const includeNature = selectedSet.has('nature');
  const includeWellness = selectedSet.has('wellness');

  const activityPool = [];

  if (includeTrekking) {
    const trekDuration = totalDays >= 5 ? 3 : totalDays >= 3 ? 2 : 1;
    for (let dayIndex = 1; dayIndex <= trekDuration; dayIndex += 1) {
      activityPool.push({
        day: dayIndex + 1,
        type: 'trekking',
        activity: buildTrekkingActivity({
          destination,
          budget,
          durationDays: trekDuration,
          dayIndex,
          totalDays
        })
      });
    }
  }

  if (includeParagliding) {
    activityPool.push({ day: Math.min(2, totalDays), type: 'paragliding', activity: buildParaglidingActivity({ destination, budget }) });
  }

  if (includeRafting) {
    activityPool.push({ day: Math.min(3, totalDays), type: 'rafting', activity: buildRaftingActivity({ destination, budget }) });
  }

  if (includeFood) {
    activityPool.push({ day: 1, type: 'food', activity: buildFoodExperience({ destination, budget, meal: 'Breakfast', travelPace }) });
    activityPool.push({ day: Math.max(2, Math.min(totalDays - 1, 4)), type: 'food', activity: buildFoodExperience({ destination, budget, meal: 'Lunch', travelPace }) });
  }

  if (includeCulture) {
    activityPool.push({ day: Math.min(2, totalDays), type: 'culture', activity: buildCultureActivity({ destination, budget }) });
  }

  if (includeNature) {
    activityPool.push({ day: Math.min(3, totalDays), type: 'nature', activity: buildNatureActivity({ destination, budget }) });
  }

  if (includeWellness) {
    activityPool.push({ day: Math.max(1, totalDays - 1), type: 'wellness', activity: buildWellnessActivity({ destination, budget }) });
  }

  const days = [];
  for (let index = 0; index < totalDays; index += 1) {
    const date = addDays(startDate, index);
    const dayNumber = index + 1;
    const plannedActivities = [];

    if (dayNumber === 1) {
      plannedActivities.push(buildArrivalDay({ destination, budget, dayNumber, totalDays }).activities[0]);
      plannedActivities.push(buildArrivalDay({ destination, budget, dayNumber, totalDays }).activities[1]);
    }

    const daySpecific = activityPool.filter((item) => item.day === dayNumber || item.day === dayNumber + 1 || item.day === dayNumber - 1);
    const selectedActivityCards = daySpecific.map(({ activity }) => ({ ...activity, totalCost: Number(activity.estimatedPrice || activity.totalCost || activity.activityCost || 0) + Number(activity.transportCost || 0) + Number(activity.foodCost || 0) }));
    selectedActivityCards.forEach((activity) => plannedActivities.push(activity));

    if (!plannedActivities.length) {
      const fallback = buildDayActivity({
        name: 'Local exploration',
        location: destination,
        startTime: '09:00',
        endTime: '11:00',
        description: `A flexible, budget-aware exploration block for ${destination} that fits your ${travelPace.toLowerCase()} travel pace and ${budget.toLowerCase()} budget.`,
        cost: Math.round(600 * tripCostByBudget(budget)),
        transport: Math.round(300 * tripCostByBudget(budget)),
        food: Math.round(400 * tripCostByBudget(budget))
      });
      plannedActivities.push(fallback);
    }

    if (dayNumber === totalDays) {
      const departure = buildDepartureDay({ destination, budget, dayNumber, totalDays }).activities[0];
      const departureTransfer = buildDepartureDay({ destination, budget, dayNumber, totalDays }).activities[1];
      plannedActivities.push(departure, departureTransfer);
    }

    const dailyTotal = plannedActivities.reduce((sum, activity) => {
      const numericComponents = [
        activity.activityCost,
        activity.transportCost,
        activity.foodCost,
        activity.entryFee,
        activity.guideCost,
        activity.permitCost,
        activity.estimatedPrice,
        activity.totalCost
      ].filter((value) => typeof value === 'number' && Number.isFinite(value));

      return sum + (numericComponents.length > 0 ? numericComponents.reduce((inner, num) => inner + num, 0) : 0);
    }, 0);

    days.push({
      day: dayNumber,
      date,
      theme: dayNumber === 1 ? 'Arrival and Local Exploration' : dayNumber === totalDays ? 'Departure and Wrap-Up' : `Day ${dayNumber} Highlights`,
      activities: plannedActivities,
      dailyTotal
    });
  }

  const totalCost = days.reduce((sum, day) => sum + Number(day.dailyTotal || 0), 0);

  const itinerary = {
    destination,
    startDate,
    endDate,
    totalDays,
    totalNights,
    budget,
    travelingWith: travelWith,
    selectedActivities: selectedActivities.map((activity) => ({
      name: typeof activity === 'string' ? activity : (activity.name || 'Selected Activity'),
      type: typeof activity === 'object' ? (activity.type || activity.name || 'day_activity') : 'day_activity'
    })),
    activityPreferences: Array.isArray(preferences.activityPreferences) ? preferences.activityPreferences : [],
    discoveryPreferences: discoveryPreferences,
    travelPace,
    socialPreference: normalizeText(preferences.socialPreference || 'Just Me'),
    additionalInstructions,
    days,
    costSummary: {
      accommodation: Math.round((Number(preferences.accommodationRate) || 2500) * totalNights),
      activities: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.activityCost || 0), 0), 0),
      guides: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.guideCost || 0), 0), 0),
      permits: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.permitCost || 0), 0), 0),
      food: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.foodCost || 0), 0), 0),
      transportation: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.transportCost || 0), 0), 0),
      equipment: days.reduce((sum, day) => sum + day.activities.reduce((inner, activity) => inner + Number(activity.equipmentCost || 0), 0), 0),
      other: 0,
      total: totalCost
    }
  };

  const expectedDays = calculateTotalDays(startDate, endDate);
  if (!Array.isArray(itinerary.days) || itinerary.days.length !== expectedDays) {
    throw new Error(`Itinerary validation failed: expected ${expectedDays} days but generated ${itinerary.days?.length || 0}.`);
  }

  if (itinerary.days[0].date !== startDate || itinerary.days[itinerary.days.length - 1].date !== endDate) {
    throw new Error('Itinerary date validation failed: first and last dates do not match the selected trip range.');
  }

  for (let index = 0; index < itinerary.days.length; index += 1) {
    const currentDate = itinerary.days[index].date;
    const expectedDate = addDays(startDate, index);
    if (currentDate !== expectedDate) {
      throw new Error(`Day ${index + 1} date does not match the expected date sequence: ${currentDate} !== ${expectedDate}.`);
    }
  }

  return itinerary;
};
