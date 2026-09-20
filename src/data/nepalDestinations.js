export const nepalDestinations = [
  { name: 'Kathmandu', subtitle: 'Capital city, temples and living heritage', province: 'Bagmati', latitude: 27.7172, longitude: 85.3240 },
  { name: 'Kathmandu Valley', subtitle: 'A cultural valley of cities and shrines', province: 'Bagmati', latitude: 27.6710, longitude: 85.4298 },
  { name: 'Kathmandu Durbar Square', subtitle: 'Historic palace courtyards in the old city', province: 'Bagmati', latitude: 27.7048, longitude: 85.3076 },
  { name: 'Pokhara', subtitle: 'Lakeside city with Himalayan views', province: 'Gandaki', latitude: 28.2096, longitude: 83.9856 },
  { name: 'Pokhara Lakeside', subtitle: 'Relaxed waterfront cafes and activities', province: 'Gandaki', latitude: 28.2139, longitude: 83.9590 },
  { name: 'Chitwan', subtitle: 'Jungle safaris and Tharu culture', province: 'Bagmati', latitude: 27.5291, longitude: 84.3542 },
  { name: 'Mustang', subtitle: 'High desert landscapes and ancient villages', province: 'Gandaki', latitude: 29.1830, longitude: 83.9830 },
  { name: 'Upper Mustang', subtitle: 'Remote Himalayan valleys and monasteries', province: 'Gandaki', latitude: 29.1900, longitude: 83.9500 },
  { name: 'Everest Region', subtitle: 'Mountain trails beneath the world’s highest peak', province: 'Koshi', latitude: 27.9881, longitude: 86.9250 },
  { name: 'Bandipur', subtitle: 'Hilltop heritage town with mountain views', province: 'Gandaki', latitude: 27.9370, longitude: 84.4060 },
  { name: 'Nagarkot', subtitle: 'Sunrise viewpoints over the Himalayas', province: 'Bagmati', latitude: 27.7172, longitude: 85.5200 },
  { name: 'Lumbini', subtitle: 'Sacred birthplace of Lord Buddha', province: 'Lumbini', latitude: 27.4833, longitude: 83.2767 },
  { name: 'Rara Lake', subtitle: 'Nepal’s largest lake in a quiet alpine setting', province: 'Karnali', latitude: 29.5293, longitude: 82.0830 },
  { name: 'Annapurna', subtitle: 'Iconic trekking routes and mountain scenery', province: 'Gandaki', latitude: 28.5960, longitude: 84.5630 },
  { name: 'Annapurna Base Camp', subtitle: 'Glacial sanctuary surrounded by Himalayan peaks', province: 'Gandaki', latitude: 28.5300, longitude: 83.8780 },
  { name: 'Annapurna Circuit', subtitle: 'Classic high-pass trek through diverse mountain landscapes', province: 'Gandaki', latitude: 28.6667, longitude: 84.0167 },
  { name: 'Ghandruk', subtitle: 'Gurung village with sweeping Annapurna views', province: 'Gandaki', latitude: 28.3750, longitude: 83.8090 },
  { name: 'Poon Hill', subtitle: 'Classic sunrise trek viewpoint', province: 'Gandaki', latitude: 28.4000, longitude: 83.7300 },
  { name: 'Dhulikhel', subtitle: 'Peaceful ridge town and Himalayan panorama', province: 'Bagmati', latitude: 27.6221, longitude: 85.5428 },
  { name: 'Bhaktapur', subtitle: 'Medieval squares, pottery and Newari culture', province: 'Bagmati', latitude: 27.6710, longitude: 85.4298 },
  { name: 'Patan', subtitle: 'Fine art, courtyards and historic architecture', province: 'Bagmati', latitude: 27.6644, longitude: 85.3188 },
  { name: 'Janakpur', subtitle: 'Mithila art and the Janaki Temple', province: 'Madhesh', latitude: 26.7288, longitude: 85.9263 },
  { name: 'Ilam', subtitle: 'Tea gardens and misty eastern hills', province: 'Koshi', latitude: 26.9094, longitude: 87.9282 },
  { name: 'Manang', subtitle: 'High-altitude villages on the Annapurna Circuit', province: 'Gandaki', latitude: 28.6667, longitude: 84.0167 },
  { name: 'Tilicho Lake', subtitle: 'Dramatic turquoise lake in the Himalayas', province: 'Gandaki', latitude: 28.6833, longitude: 84.0167 },
  { name: 'Langtang', subtitle: 'Mountain valleys, trails and Tamang heritage', province: 'Bagmati', latitude: 28.2167, longitude: 85.5167 },
  { name: 'Manaslu Region', subtitle: 'Remote circuit trails around the world’s eighth-highest peak', province: 'Gandaki', latitude: 28.5497, longitude: 84.5597 },
  { name: 'Kanchenjunga Region', subtitle: 'Wild eastern trails beneath the world’s third-highest peak', province: 'Koshi', latitude: 27.7025, longitude: 88.1475 },
  { name: 'Dolpo Region', subtitle: 'Remote trans-Himalayan valleys, lakes and ancient culture', province: 'Karnali', latitude: 29.2500, longitude: 82.7500 },
  { name: 'Tansen', subtitle: 'Charming hill town with old-world streets', province: 'Lumbini', latitude: 27.8670, longitude: 83.5460 },
  { name: 'Bardia', subtitle: 'Wildlife, river walks and quiet jungle trails', province: 'Lumbini', latitude: 28.3900, longitude: 81.3500 }
];

export const presetDestinations = nepalDestinations.filter(({ name }) => [
  'Annapurna', 'Everest Region', 'Langtang', 'Manaslu Region', 'Mustang', 'Kanchenjunga Region', 'Dolpo Region', 'Rara Lake'
].includes(name));
