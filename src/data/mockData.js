// Mock data for the Smart City Dashboard

// ─── Dashboard KPI Data ───
export const kpiData = [
  { title: 'Traffic Density', value: '72%', change: -3.2, icon: 'Car', color: 'primary' },
  { title: 'Energy Usage', value: '4.8 GW', change: 1.5, icon: 'Zap', color: 'warning' },
  { title: 'Waste Collected', value: '847 T', change: -5.1, icon: 'Trash2', color: 'success' },
  { title: 'Air Quality', value: 'Good', change: 2.8, icon: 'Wind', color: 'accent' },
  { title: 'Active Buses', value: '342', change: 0.5, icon: 'Bus', color: 'primary' },
  { title: 'Alerts Active', value: '12', change: -8.3, icon: 'AlertTriangle', color: 'danger' },
];

// ─── Traffic Flow (24h) ───
export const trafficFlowData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  vehicles: Math.round(200 + Math.sin(i / 3.8) * 150 + Math.random() * 80),
  avgSpeed: Math.round(35 + Math.cos(i / 4) * 15 + Math.random() * 5),
}));

// ─── Energy Consumption (7 days) ───
export const energyData = [
  { day: 'Mon', solar: 320, wind: 180, grid: 540, total: 1040 },
  { day: 'Tue', solar: 380, wind: 220, grid: 480, total: 1080 },
  { day: 'Wed', solar: 290, wind: 195, grid: 570, total: 1055 },
  { day: 'Thu', solar: 410, wind: 240, grid: 420, total: 1070 },
  { day: 'Fri', solar: 350, wind: 200, grid: 510, total: 1060 },
  { day: 'Sat', solar: 280, wind: 160, grid: 380, total: 820 },
  { day: 'Sun', solar: 260, wind: 150, grid: 340, total: 750 },
];

// ─── Waste Bin Data ───
export const wasteBinData = [
  { id: 1, location: 'Central Park', lat: 40.7829, lng: -73.9654, fill: 87, type: 'general', lastCollected: '2h ago' },
  { id: 2, location: 'City Hall', lat: 40.7128, lng: -74.006, fill: 45, type: 'recycling', lastCollected: '4h ago' },
  { id: 3, location: 'Main Street', lat: 40.7580, lng: -73.9855, fill: 92, type: 'general', lastCollected: '6h ago' },
  { id: 4, location: 'Broadway & 5th', lat: 40.7431, lng: -73.9882, fill: 23, type: 'organic', lastCollected: '1h ago' },
  { id: 5, location: 'Tech District', lat: 40.7505, lng: -73.9934, fill: 68, type: 'recycling', lastCollected: '3h ago' },
  { id: 6, location: 'Riverside', lat: 40.8005, lng: -73.9702, fill: 95, type: 'general', lastCollected: '8h ago' },
  { id: 7, location: 'Harbor Area', lat: 40.6892, lng: -74.0445, fill: 34, type: 'recycling', lastCollected: '2h ago' },
  { id: 8, location: 'University', lat: 40.7295, lng: -73.9965, fill: 72, type: 'general', lastCollected: '5h ago' },
];

// ─── Transport Routes ───
export const busRoutes = [
  { id: 'R1', name: 'Downtown Express', stops: 12, avgDelay: '2min', ridership: 4200, status: 'on-time' },
  { id: 'R2', name: 'Airport Shuttle', stops: 8, avgDelay: '5min', ridership: 2800, status: 'delayed' },
  { id: 'R3', name: 'Suburban Loop', stops: 18, avgDelay: '1min', ridership: 3500, status: 'on-time' },
  { id: 'R4', name: 'Harbor Line', stops: 10, avgDelay: '3min', ridership: 1900, status: 'on-time' },
  { id: 'R5', name: 'University Route', stops: 14, avgDelay: '8min', ridership: 5100, status: 'delayed' },
  { id: 'R6', name: 'Tech Park Express', stops: 6, avgDelay: '0min', ridership: 3200, status: 'on-time' },
];

export const vehiclePositions = [
  { id: 'V1', type: 'bus', route: 'R1', lat: 40.7549, lng: -73.9840, speed: 25, heading: 'N' },
  { id: 'V2', type: 'bus', route: 'R2', lat: 40.7280, lng: -73.7900, speed: 45, heading: 'E' },
  { id: 'V3', type: 'bus', route: 'R3', lat: 40.7680, lng: -73.9510, speed: 18, heading: 'S' },
  { id: 'V4', type: 'tram', route: 'R4', lat: 40.7100, lng: -74.0100, speed: 30, heading: 'W' },
  { id: 'V5', type: 'bus', route: 'R5', lat: 40.7310, lng: -73.9970, speed: 0, heading: 'N' },
  { id: 'V6', type: 'bus', route: 'R6', lat: 40.7500, lng: -73.9850, speed: 35, heading: 'E' },
];

// ─── Map Sensor Data ───
export const sensorLocations = [
  { id: 'S1', type: 'air-quality', lat: 40.7580, lng: -73.9855, aqi: 42, label: 'Good', pm25: 8.2 },
  { id: 'S2', type: 'air-quality', lat: 40.7280, lng: -74.0060, aqi: 78, label: 'Moderate', pm25: 22.5 },
  { id: 'S3', type: 'traffic-cam', lat: 40.7549, lng: -73.9840, vehicles: 245, congestion: 'medium' },
  { id: 'S4', type: 'traffic-cam', lat: 40.7431, lng: -73.9882, vehicles: 89, congestion: 'low' },
  { id: 'S5', type: 'noise', lat: 40.7829, lng: -73.9654, decibels: 62, level: 'moderate' },
  { id: 'S6', type: 'noise', lat: 40.7505, lng: -73.9934, decibels: 78, level: 'high' },
  { id: 'S7', type: 'weather', lat: 40.7680, lng: -73.9510, temp: 22, humidity: 65, conditions: 'Partly Cloudy' },
];

// ─── Energy Grid Data ───
export const gridData = {
  totalCapacity: 5200,
  currentLoad: 3840,
  renewable: 42,
  peakHour: '14:00',
  sources: [
    { name: 'Solar', value: 28, color: '#f59e0b' },
    { name: 'Wind', value: 14, color: '#22c55e' },
    { name: 'Natural Gas', value: 35, color: '#6b7280' },
    { name: 'Nuclear', value: 18, color: '#10b981' },
    { name: 'Hydro', value: 5, color: '#22c55e' },
  ],
};

export const hourlyEnergy = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  demand: Math.round(2800 + Math.sin((i - 6) / 3.8) * 1200 + Math.random() * 200),
  supply: Math.round(3200 + Math.sin((i - 4) / 4) * 800 + Math.random() * 150),
  solar: i >= 6 && i <= 18 ? Math.round(Math.sin((i - 6) / 3.8) * 800) : 0,
}));

// ─── Carbon Footprint ───
export const carbonData = [
  { month: 'Jan', emissions: 4200, offset: 1800, target: 3000 },
  { month: 'Feb', emissions: 3900, offset: 1900, target: 2900 },
  { month: 'Mar', emissions: 3700, offset: 2100, target: 2800 },
  { month: 'Apr', emissions: 3400, offset: 2300, target: 2700 },
  { month: 'May', emissions: 3200, offset: 2500, target: 2600 },
  { month: 'Jun', emissions: 3000, offset: 2600, target: 2500 },
];

// ─── Recycling Stats ───
export const recyclingStats = [
  { material: 'Paper', collected: 2300, recycled: 2100, rate: 91 },
  { material: 'Plastic', collected: 1800, recycled: 1260, rate: 70 },
  { material: 'Glass', collected: 950, recycled: 855, rate: 90 },
  { material: 'Metal', collected: 680, recycled: 646, rate: 95 },
  { material: 'Organic', collected: 3200, recycled: 2880, rate: 90 },
];

// ─── Notifications / Alerts ───
export const notifications = [
  { id: 1, type: 'danger', title: 'Waste Overflow', message: 'Bin #6 at Riverside is 95% full — collection overdue.', time: '2 min ago', read: false },
  { id: 2, type: 'warning', title: 'Traffic Congestion', message: 'Heavy traffic on I-495 Eastbound. Avg speed 12mph.', time: '8 min ago', read: false },
  { id: 3, type: 'info', title: 'Route Update', message: 'Bus R2 Airport Shuttle delayed by 5 minutes.', time: '15 min ago', read: false },
  { id: 4, type: 'success', title: 'Energy Target Met', message: 'Renewable energy exceeded 40% target today.', time: '1h ago', read: true },
  { id: 5, type: 'warning', title: 'Air Quality Alert', message: 'AQI rising near City Hall sensor. Currently at 78.', time: '2h ago', read: true },
  { id: 6, type: 'info', title: 'Scheduled Maintenance', message: 'Grid maintenance in Sector 4 tonight 22:00-04:00.', time: '3h ago', read: true },
];

// ─── Citizen Events ───
export const communityEvents = [
  { id: 1, title: 'Town Hall Meeting', date: '2026-02-22', time: '18:00', location: 'City Hall', category: 'governance', attendees: 156 },
  { id: 2, title: 'Green Energy Workshop', date: '2026-02-25', time: '10:00', location: 'Tech Center', category: 'sustainability', attendees: 89 },
  { id: 3, title: 'Community Clean-Up Day', date: '2026-03-01', time: '09:00', location: 'Central Park', category: 'environment', attendees: 234 },
  { id: 4, title: 'Smart Transit Forum', date: '2026-03-05', time: '14:00', location: 'Convention Center', category: 'transport', attendees: 178 },
  { id: 5, title: 'Neighborhood Safety Walk', date: '2026-03-08', time: '17:00', location: 'Downtown', category: 'safety', attendees: 67 },
];

// ─── User Roles ───
export const userRoles = {
  admin: { label: 'Administrator', permissions: ['all'] },
  citizen: { label: 'Citizen', permissions: ['view', 'report', 'feedback'] },
  visitor: { label: 'Visitor', permissions: ['view'] },
};

// ─── Role-specific Dashboard Data ───

// Admin KPIs – full system overview
export const adminKpiData = [
  { title: 'Traffic Density', value: '72%', change: -3.2, icon: 'Car', color: 'primary' },
  { title: 'Energy Usage', value: '4.8 GW', change: 1.5, icon: 'Zap', color: 'warning' },
  { title: 'Waste Collected', value: '847 T', change: -5.1, icon: 'Trash2', color: 'success' },
  { title: 'Air Quality', value: 'Good', change: 2.8, icon: 'Wind', color: 'accent' },
  { title: 'Active Buses', value: '342', change: 0.5, icon: 'Bus', color: 'primary' },
  { title: 'Alerts Active', value: '12', change: -8.3, icon: 'AlertTriangle', color: 'danger' },
];

// Citizen KPIs – personal / neighborhood focus
export const citizenKpiData = [
  { title: 'Next Bus', value: '3 min', change: 0, icon: 'Bus', color: 'primary' },
  { title: 'My Area AQI', value: '42', change: 5.0, icon: 'Wind', color: 'success' },
  { title: 'Waste Pickup', value: 'Tomorrow', change: 0, icon: 'Trash2', color: 'accent' },
  { title: 'Open Reports', value: '2', change: -50, icon: 'AlertTriangle', color: 'warning' },
  { title: 'Local Events', value: '5', change: 25, icon: 'Users', color: 'primary' },
  { title: 'Energy Saved', value: '18%', change: 4.2, icon: 'Zap', color: 'success' },
];

// Visitor KPIs – tourism + exploration
export const visitorKpiData = [
  { title: 'Attractions Nearby', value: '12', change: 0, icon: 'MapPin', color: 'primary' },
  { title: 'Events Today', value: '3', change: 0, icon: 'Calendar', color: 'accent' },
  { title: 'Transit Lines', value: '6', change: 0, icon: 'Bus', color: 'primary' },
  { title: 'City Rating', value: '4.8★', change: 2.1, icon: 'Star', color: 'warning' },
  { title: 'Temp', value: '22°C', change: 0, icon: 'Thermometer', color: 'success' },
  { title: 'Wi-Fi Zones', value: '48', change: 12, icon: 'Wifi', color: 'accent' },
];

// Citizen-specific: personal transit schedule
export const citizenTransitSchedule = [
  { route: 'R1 Downtown Express', eta: '3 min', stop: 'Main St & 5th' },
  { route: 'R3 Suburban Loop', eta: '12 min', stop: 'Central Park' },
  { route: 'R6 Tech Park Express', eta: '18 min', stop: 'Tech Hub' },
];

// Citizen-specific: reported issues
export const citizenReports = [
  { id: 1, title: 'Pothole on Elm Street', status: 'in-progress', date: '2026-02-15', category: 'roads' },
  { id: 2, title: 'Broken streetlight near park', status: 'resolved', date: '2026-02-10', category: 'lighting' },
  { id: 3, title: 'Overflowing bin at 3rd & Main', status: 'open', date: '2026-02-18', category: 'waste' },
];

// ─── Tourist Attractions ───
export const touristAttractions = [
  { id: 1, name: 'Central Park', category: 'Nature', rating: 4.9, visitors: '12k/day', lat: 40.7829, lng: -73.9654, image: '🌳', description: 'Iconic 843-acre urban park with lakes, gardens, and walking trails.', hours: '6 AM – 1 AM', admission: 'Free' },
  { id: 2, name: 'Tech Innovation Hub', category: 'Technology', rating: 4.7, visitors: '3k/day', lat: 40.7505, lng: -73.9934, image: '🔬', description: 'Interactive technology museum showcasing smart city innovations and IoT demos.', hours: '9 AM – 6 PM', admission: '$15' },
  { id: 3, name: 'Harbor Waterfront', category: 'Scenic', rating: 4.8, visitors: '8k/day', lat: 40.6892, lng: -74.0445, image: '⛵', description: 'Scenic waterfront promenade with restaurants, ferry rides, and sunset views.', hours: 'Open 24/7', admission: 'Free' },
  { id: 4, name: 'City History Museum', category: 'Culture', rating: 4.6, visitors: '2k/day', lat: 40.7128, lng: -74.006, image: '🏛️', description: 'Chronicles the city\'s transformation from industrial hub to smart city pioneer.', hours: '10 AM – 5 PM', admission: '$12' },
  { id: 5, name: 'Skyline Observatory', category: 'Scenic', rating: 4.9, visitors: '6k/day', lat: 40.7484, lng: -73.9857, image: '🏙️', description: '360° panoramic views from the 80th floor with augmented reality city guide.', hours: '8 AM – 11 PM', admission: '$25' },
  { id: 6, name: 'Eco Botanical Garden', category: 'Nature', rating: 4.5, visitors: '4k/day', lat: 40.7680, lng: -73.9510, image: '🌺', description: 'Smart-irrigated botanical garden with 5,000+ plant species and AI-guided tours.', hours: '9 AM – 7 PM', admission: '$10' },
  { id: 7, name: 'Art District & Galleries', category: 'Culture', rating: 4.4, visitors: '5k/day', lat: 40.7431, lng: -73.9882, image: '🎨', description: 'Vibrant neighborhood with 30+ galleries, street art, and interactive installations.', hours: '11 AM – 9 PM', admission: 'Free' },
  { id: 8, name: 'Smart Transit Experience', category: 'Technology', rating: 4.3, visitors: '1.5k/day', lat: 40.7549, lng: -73.9840, image: '🚄', description: 'Ride the autonomous transit loop and experience the future of urban mobility.', hours: '7 AM – 10 PM', admission: '$8' },
];

// Visitor-specific: suggested itineraries
export const visitorItineraries = [
  { id: 1, name: 'Smart City Discovery', duration: '4 hours', stops: ['Tech Innovation Hub', 'Smart Transit Experience', 'Skyline Observatory'], difficulty: 'Easy' },
  { id: 2, name: 'Nature & Scenery', duration: '3 hours', stops: ['Central Park', 'Eco Botanical Garden', 'Harbor Waterfront'], difficulty: 'Easy' },
  { id: 3, name: 'Culture & History Walk', duration: '5 hours', stops: ['City History Museum', 'Art District & Galleries', 'Harbor Waterfront'], difficulty: 'Moderate' },
];

// Visitor-specific: city events
export const visitorEvents = [
  { id: 1, title: 'Tech Festival 2026', date: '2026-02-22', time: '10:00 AM', location: 'Tech Innovation Hub', category: 'Technology', free: false },
  { id: 2, title: 'Street Art Walk', date: '2026-02-20', time: '2:00 PM', location: 'Art District', category: 'Culture', free: true },
  { id: 3, title: 'Sunset Jazz at Harbor', date: '2026-02-21', time: '6:00 PM', location: 'Harbor Waterfront', category: 'Music', free: true },
  { id: 4, title: 'Smart City Night Tour', date: '2026-02-23', time: '8:00 PM', location: 'Downtown', category: 'Tours', free: false },
];
