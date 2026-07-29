import dotenv from "dotenv";
import connectDB from "../config/db.js";
import State from "../models/State.js";
import City from "../models/City.js";
import Category from "../models/Category.js";
import TouristPlace from "../models/TouristPlace.js";
import Festival from "../models/Festival.js";
import Admin from "../models/Admin.js";

dotenv.config();
await connectDB();

// All 28 states + 8 union territories of India
const ALL_STATES = [
  { name: "Andhra Pradesh", region: "South", capital: "Amaravati" },
  { name: "Arunachal Pradesh", region: "Northeast", capital: "Itanagar" },
  { name: "Assam", region: "Northeast", capital: "Dispur" },
  { name: "Bihar", region: "East", capital: "Patna" },
  { name: "Chhattisgarh", region: "Central", capital: "Raipur" },
  { name: "Goa", region: "West", capital: "Panaji" },
  { name: "Gujarat", region: "West", capital: "Gandhinagar" },
  { name: "Haryana", region: "North", capital: "Chandigarh" },
  { name: "Himachal Pradesh", region: "North", capital: "Shimla" },
  { name: "Jharkhand", region: "East", capital: "Ranchi" },
  { name: "Karnataka", region: "South", capital: "Bengaluru" },
  { name: "Kerala", region: "South", capital: "Thiruvananthapuram" },
  { name: "Madhya Pradesh", region: "Central", capital: "Bhopal" },
  { name: "Maharashtra", region: "West", capital: "Mumbai" },
  { name: "Manipur", region: "Northeast", capital: "Imphal" },
  { name: "Meghalaya", region: "Northeast", capital: "Shillong" },
  { name: "Mizoram", region: "Northeast", capital: "Aizawl" },
  { name: "Nagaland", region: "Northeast", capital: "Kohima" },
  { name: "Odisha", region: "East", capital: "Bhubaneswar" },
  { name: "Punjab", region: "North", capital: "Chandigarh" },
  { name: "Rajasthan", region: "North", capital: "Jaipur" },
  { name: "Sikkim", region: "Northeast", capital: "Gangtok" },
  { name: "Tamil Nadu", region: "South", capital: "Chennai" },
  { name: "Telangana", region: "South", capital: "Hyderabad" },
  { name: "Tripura", region: "Northeast", capital: "Agartala" },
  { name: "Uttar Pradesh", region: "North", capital: "Lucknow" },
  { name: "Uttarakhand", region: "North", capital: "Dehradun" },
  { name: "West Bengal", region: "East", capital: "Kolkata" },
];

const ALL_UTS = [
  { name: "Andaman and Nicobar Islands", region: "South", capital: "Port Blair" },
  { name: "Chandigarh", region: "North", capital: "Chandigarh" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", region: "West", capital: "Daman" },
  { name: "Delhi", region: "North", capital: "New Delhi" },
  { name: "Jammu and Kashmir", region: "North", capital: "Srinagar" },
  { name: "Ladakh", region: "North", capital: "Leh" },
  { name: "Lakshadweep", region: "South", capital: "Kavaratti" },
  { name: "Puducherry", region: "South", capital: "Puducherry" },
];

const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const run = async () => {
  console.log("Clearing existing data...");
  await Promise.all([
    State.deleteMany(),
    City.deleteMany(),
    Category.deleteMany(),
    TouristPlace.deleteMany(),
    Festival.deleteMany(),
    Admin.deleteMany(),
  ]);

  console.log("Seeding all 28 states + 8 union territories...");
  const stateDocsInput = [
    ...ALL_STATES.map((s) => ({ ...s, type: "State" })),
    ...ALL_UTS.map((s) => ({ ...s, type: "Union Territory" })),
  ].map((s) => ({
    name: s.name,
    slug: slugify(s.name),
    type: s.type,
    region: s.region,
    capital: s.capital,
    description: `Discover the heritage, culture and destinations of ${s.name}.`,
  }));
  const insertedStates = await State.insertMany(stateDocsInput);
  const stateBySlug = Object.fromEntries(insertedStates.map((s) => [s.slug, s]));

  console.log("Enriching featured states with coordinates and cuisine...");
  await State.findByIdAndUpdate(stateBySlug["rajasthan"]._id, {
    coordinates: { lat: 26.9124, lng: 75.7873 },
    description: "Land of kings, forts, palaces and the Thar Desert.",
    languages: ["Hindi", "Rajasthani"],
    cuisine: [
      { name: "Dal Baati Churma", description: "Baked wheat rolls served with spiced lentils and sweet crumbled wheat." },
      { name: "Laal Maas", description: "A fiery mutton curry cooked with red chillies and Rajasthani spices." },
      { name: "Ghevar", description: "A disc-shaped sweet soaked in sugar syrup, popular during festivals." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["kerala"]._id, {
    coordinates: { lat: 8.5241, lng: 76.9366 },
    description: "God's Own Country — backwaters, hill stations and beaches.",
    languages: ["Malayalam"],
    cuisine: [
      { name: "Appam with Stew", description: "Fermented rice pancakes served with a mild coconut-milk vegetable or meat stew." },
      { name: "Kerala Sadya", description: "A traditional vegetarian feast served on a banana leaf with rice and multiple side dishes." },
      { name: "Fish Moilee", description: "Fish simmered in a light, coconut-milk based curry with curry leaves." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["uttar-pradesh"]._id, {
    coordinates: { lat: 26.8467, lng: 80.9462 },
    description: "Home of the Taj Mahal, ancient Varanasi and Mughal heritage.",
    languages: ["Hindi", "Urdu"],
    cuisine: [
      { name: "Awadhi Biryani", description: "Fragrant, slow-cooked rice and meat dish from the royal kitchens of Lucknow." },
      { name: "Banarasi Chaat", description: "Tangy, spicy street snacks synonymous with Varanasi's lanes." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["punjab"]._id, {
    coordinates: { lat: 31.1471, lng: 75.3412 },
    description: "Land of five rivers, golden wheat fields and the Golden Temple.",
    languages: ["Punjabi"],
    cuisine: [
      { name: "Sarson da Saag with Makki di Roti", description: "Mustard greens curry served with cornmeal flatbread." },
      { name: "Amritsari Kulcha", description: "Stuffed leavened bread baked in a tandoor, a Punjab classic." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["goa"]._id, {
    coordinates: { lat: 15.2993, lng: 74.1240 },
    description: "Sun-soaked beaches, Portuguese heritage and a laid-back coastal vibe.",
    languages: ["Konkani", "Marathi"],
    cuisine: [
      { name: "Goan Fish Curry", description: "Coconut and kokum based curry, a staple of Goan coastal cuisine." },
      { name: "Bebinca", description: "A rich, layered Goan dessert made with coconut milk and eggs." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["himachal-pradesh"]._id, {
    coordinates: { lat: 31.1048, lng: 77.1734 },
    description: "Himalayan valleys, hill stations and adventure sports.",
    languages: ["Hindi", "Pahari"],
    cuisine: [
      { name: "Dham", description: "A traditional festive meal of rice, lentils and yoghurt-based curries." },
      { name: "Siddu", description: "Steamed wheat bread stuffed with poppy seeds or lentils." },
    ],
  });
  await State.findByIdAndUpdate(stateBySlug["karnataka"]._id, {
    coordinates: { lat: 15.3173, lng: 75.7139 },
    description: "From the ruins of Hampi to the gardens of Mysuru and the tech hub of Bengaluru.",
    languages: ["Kannada"],
    cuisine: [
      { name: "Bisi Bele Bath", description: "A spiced rice dish cooked with lentils and vegetables." },
      { name: "Mysore Pak", description: "A rich, ghee-laden gram-flour sweet originating in Mysuru." },
    ],
  });

  console.log("Seeding categories...");
  const categories = await Category.insertMany([
    { name: "Heritage", slug: "heritage", icon: "landmark" },
    { name: "Nature", slug: "nature", icon: "mountain" },
    { name: "Religious", slug: "religious", icon: "temple" },
    { name: "Adventure", slug: "adventure", icon: "compass" },
    { name: "Pilgrimage", slug: "pilgrimage", icon: "temple" },
    { name: "Wildlife", slug: "wildlife", icon: "paw" },
    { name: "Beaches", slug: "beaches", icon: "waves" },
    { name: "Mountains", slug: "mountains", icon: "mountain-snow" },
  ]);
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  console.log("Seeding cities...");
  const jaipur = await City.create({ name: "Jaipur", slug: "jaipur", state: stateBySlug["rajasthan"]._id, description: "The Pink City." });
  const udaipur = await City.create({ name: "Udaipur", slug: "udaipur", state: stateBySlug["rajasthan"]._id, description: "The City of Lakes." });
  const sawaiMadhopur = await City.create({ name: "Sawai Madhopur", slug: "sawai-madhopur", state: stateBySlug["rajasthan"]._id, description: "Gateway to Ranthambore National Park." });
  const alleppey = await City.create({ name: "Alleppey", slug: "alleppey", state: stateBySlug["kerala"]._id, description: "Venice of the East." });
  const agra = await City.create({ name: "Agra", slug: "agra", state: stateBySlug["uttar-pradesh"]._id, description: "Home to the Taj Mahal." });
  const varanasi = await City.create({ name: "Varanasi", slug: "varanasi", state: stateBySlug["uttar-pradesh"]._id, description: "One of the world's oldest living cities, on the banks of the Ganges." });
  const amritsar = await City.create({ name: "Amritsar", slug: "amritsar", state: stateBySlug["punjab"]._id, description: "Home to the Golden Temple." });
  const calangute = await City.create({ name: "Calangute", slug: "calangute", state: stateBySlug["goa"]._id, description: "Goa's largest and liveliest beach town." });
  const manali = await City.create({ name: "Manali", slug: "manali", state: stateBySlug["himachal-pradesh"]._id, description: "A Himalayan resort town popular for adventure sports." });
  const hampi = await City.create({ name: "Hampi", slug: "hampi", state: stateBySlug["karnataka"]._id, description: "A UNESCO World Heritage village of ancient ruins." });
  const mawlynnong = await City.create({ name: "Mawlynnong", slug: "mawlynnong", state: stateBySlug["meghalaya"]._id, description: "A small East Khasi Hills village known as Asia's cleanest village." });

  console.log("Seeding 10 preloaded tourist places...");
  await TouristPlace.create([
    {
      name: "Amber Fort",
      slug: "amber-fort",
      state: stateBySlug["rajasthan"]._id,
      city: jaipur._id,
      categories: [cat.heritage],
      shortDescription: "A majestic hilltop fort overlooking Maota Lake.",
      description: "Amber Fort is a UNESCO World Heritage Site built by Raja Man Singh I, known for its artistic Hindu-style elements, sprawling ramparts, and the ornate Sheesh Mahal.",
      historicalSignificance: "Former capital of the Kachwaha Rajput dynasty before Jaipur was founded.",
      bestTimeToVisit: "October - March",
      timings: "8:00 AM - 5:30 PM",
      entryFee: { indian: "₹100", foreigner: "₹500" },
      budgetLevel: "Mid-range",
      recommendedDuration: "Half day",
      suitableFor: ["Family", "Couple", "Group"],
      seasonalTags: ["Winter", "Year-round"],
      isFeaturedOffer: true,
      offerText: "Free guided heritage walk every Sunday morning this season.",
      nearbyHotels: [
        { name: "Fairmont Jaipur", priceRange: "₹8,000 - ₹15,000/night", distanceKm: 6 },
        { name: "Hotel Pearl Palace", priceRange: "₹1,500 - ₹3,000/night", distanceKm: 8 },
      ],
      nearbyRestaurants: [
        { name: "1135 AD", cuisine: "Royal Rajasthani", priceRange: "₹₹₹", distanceKm: 0.2 },
        { name: "Anokhi Café", cuisine: "Continental & Organic", priceRange: "₹₹", distanceKm: 7 },
      ],
      famousFood: [
        { name: "Dal Baati Churma", description: "The signature Rajasthani thali dish." },
        { name: "Pyaaz Kachori", description: "A flaky, onion-stuffed fried snack popular in Jaipur." },
      ],
      localTransport: ["Auto-rickshaw", "App-based cabs", "Local bus", "Elephant/jeep ride up the fort"],
      location: { address: "Devisinghpura, Amer, Jaipur, Rajasthan", mapLink: "https://maps.google.com/?q=Amber+Fort+Jaipur", lat: 26.9855, lng: 75.8513 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Amber_fort_jaipur.jpg?width=800", isCover: true }],
      tags: ["fort", "unesco", "rajput"],
      isVerified: true,
    },
    {
      name: "City Palace, Udaipur",
      slug: "city-palace-udaipur",
      state: stateBySlug["rajasthan"]._id,
      city: udaipur._id,
      categories: [cat.heritage],
      shortDescription: "A palace complex on the banks of Lake Pichola.",
      description: "Built over nearly 400 years by successive Maharanas of Mewar, the City Palace blends Rajasthani and Mughal architectural styles with courtyards, gardens, and museums.",
      bestTimeToVisit: "September - March",
      timings: "9:30 AM - 5:30 PM",
      entryFee: { indian: "₹300", foreigner: "₹700" },
      budgetLevel: "Luxury",
      recommendedDuration: "Half day",
      suitableFor: ["Couple", "Family"],
      seasonalTags: ["Winter", "Year-round"],
      nearbyHotels: [
        { name: "Taj Lake Palace", priceRange: "₹25,000+/night", distanceKm: 1 },
        { name: "Hotel Lakend", priceRange: "₹4,000 - ₹6,000/night", distanceKm: 2 },
      ],
      nearbyRestaurants: [
        { name: "Ambrai Restaurant", cuisine: "Rajasthani & Multi-cuisine", priceRange: "₹₹₹", distanceKm: 1.2 },
        { name: "Millets of Mewar", cuisine: "Organic Local", priceRange: "₹₹", distanceKm: 0.5 },
      ],
      famousFood: [{ name: "Laal Maas", description: "Fiery Mewari mutton curry, a Udaipur specialty." }],
      localTransport: ["Boat rides on Lake Pichola", "Auto-rickshaw", "App-based cabs"],
      location: { address: "Udaipur, Rajasthan", mapLink: "https://maps.google.com/?q=City+Palace+Udaipur", lat: 24.5764, lng: 73.6835 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/City_Palace_by_lake_Pichola,_Udaipur.jpg?width=800", isCover: true }],
      tags: ["palace", "lake", "mewar"],
      isVerified: true,
    },
    {
      name: "Alleppey Backwaters",
      slug: "alleppey-backwaters",
      state: stateBySlug["kerala"]._id,
      city: alleppey._id,
      categories: [cat.nature],
      shortDescription: "A network of tranquil canals, rivers and lakes.",
      description: "The Alleppey backwaters offer houseboat cruises through palm-fringed canals, paddy fields below sea level, and traditional Kerala village life along the banks.",
      bestTimeToVisit: "November - February",
      timings: "Open all day",
      entryFee: { indian: "Free", foreigner: "Free" },
      budgetLevel: "Mid-range",
      recommendedDuration: "1 day (or overnight houseboat)",
      suitableFor: ["Couple", "Family", "Solo"],
      seasonalTags: ["Winter"],
      isFeaturedOffer: true,
      offerText: "20% off overnight houseboat stays on weekday bookings this month.",
      nearbyHotels: [
        { name: "Punnamada Backwater Resort", priceRange: "₹5,000 - ₹9,000/night", distanceKm: 2 },
        { name: "Houseboat stay (on water)", priceRange: "₹6,000 - ₹12,000/night", distanceKm: 0 },
      ],
      nearbyRestaurants: [{ name: "Chakara Restaurant", cuisine: "Kerala Seafood", priceRange: "₹₹", distanceKm: 1.5 }],
      famousFood: [
        { name: "Karimeen Pollichathu", description: "Pearl spot fish marinated and grilled in a banana leaf." },
        { name: "Appam with Stew", description: "A Kerala breakfast classic." },
      ],
      localTransport: ["Houseboats", "Country boats", "Auto-rickshaw"],
      location: { address: "Alappuzha, Kerala", mapLink: "https://maps.google.com/?q=Alleppey+Backwaters", lat: 9.4981, lng: 76.3388 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Houseboats_in_Alleppey_Backwaters.jpg?width=800", isCover: true }],
      tags: ["backwaters", "houseboat", "nature"],
      isVerified: true,
    },
    {
      name: "Taj Mahal",
      slug: "taj-mahal",
      state: stateBySlug["uttar-pradesh"]._id,
      city: agra._id,
      categories: [cat.heritage],
      shortDescription: "The iconic ivory-white marble mausoleum on the Yamuna.",
      description: "Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is a UNESCO World Heritage Site and one of the New Seven Wonders of the World.",
      historicalSignificance: "Completed in 1653, considered the finest example of Mughal architecture.",
      bestTimeToVisit: "October - March",
      timings: "Sunrise - Sunset (closed Fridays)",
      entryFee: { indian: "₹50", foreigner: "₹1100" },
      budgetLevel: "Budget",
      recommendedDuration: "Half day",
      suitableFor: ["Family", "Couple", "Solo", "Group"],
      seasonalTags: ["Winter"],
      nearbyHotels: [
        { name: "The Oberoi Amarvilas", priceRange: "₹30,000+/night", distanceKm: 1 },
        { name: "Hotel Taj Resorts", priceRange: "₹2,000 - ₹4,000/night", distanceKm: 2 },
      ],
      nearbyRestaurants: [{ name: "Pinch of Spice", cuisine: "North Indian", priceRange: "₹₹", distanceKm: 3 }],
      famousFood: [{ name: "Agra Petha", description: "A translucent, sugar-syrup soaked sweet made from ash gourd." }],
      localTransport: ["Electric shuttle to the monument", "Auto-rickshaw", "App-based cabs"],
      location: { address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh", mapLink: "https://maps.google.com/?q=Taj+Mahal+Agra", lat: 27.1751, lng: 78.0421 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Taj-Mahal.jpg?width=800", isCover: true }],
      tags: ["unesco", "mughal", "wonder"],
      isVerified: true,
    },
    {
      name: "Golden Temple",
      slug: "golden-temple-amritsar",
      state: stateBySlug["punjab"]._id,
      city: amritsar._id,
      categories: [cat.religious, cat.pilgrimage],
      shortDescription: "The holiest Gurdwara of Sikhism, glowing gold over the Amrit Sarovar.",
      description: "The Golden Temple, or Harmandir Sahib, is the spiritual and cultural centre of Sikhism, known for its gold-plated sanctum and the world's largest free community kitchen (langar).",
      bestTimeToVisit: "October - March",
      timings: "Open 24 hours",
      entryFee: { indian: "Free", foreigner: "Free" },
      budgetLevel: "Budget",
      recommendedDuration: "Half day",
      suitableFor: ["Family", "Solo", "Group"],
      seasonalTags: ["Winter", "Year-round"],
      nearbyHotels: [
        { name: "Hotel Ranjit's Svaasa", priceRange: "₹6,000 - ₹10,000/night", distanceKm: 1 },
        { name: "Sarovar Portico Amritsar", priceRange: "₹3,500 - ₹6,000/night", distanceKm: 2 },
      ],
      nearbyRestaurants: [
        { name: "Kesar Da Dhaba", cuisine: "Punjabi", priceRange: "₹", distanceKm: 1 },
        { name: "Free community langar (temple kitchen)", cuisine: "Vegetarian Punjabi", priceRange: "Free / donation-based", distanceKm: 0 },
      ],
      famousFood: [{ name: "Amritsari Kulcha", description: "Stuffed tandoori bread served with chickpea curry." }],
      localTransport: ["Cycle-rickshaw", "Auto-rickshaw", "Walking (old city core)"],
      location: { address: "Golden Temple Rd, Amritsar, Punjab", mapLink: "https://maps.google.com/?q=Golden+Temple+Amritsar", lat: 31.6200, lng: 74.8765 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Temple-Amritsar.JPG?width=800", isCover: true }],
      tags: ["sikhism", "gurdwara", "pilgrimage"],
      isVerified: true,
    },
    {
      name: "Kashi Vishwanath & Ganga Ghats",
      slug: "varanasi-ghats",
      state: stateBySlug["uttar-pradesh"]._id,
      city: varanasi._id,
      categories: [cat.religious, cat.pilgrimage],
      shortDescription: "Ancient riverside ghats and one of Hinduism's holiest temples.",
      description: "Varanasi's ghats along the Ganges are the spiritual heart of the city, where pilgrims bathe at sunrise and witness the nightly Ganga Aarti ceremony near the Kashi Vishwanath Temple.",
      bestTimeToVisit: "October - March",
      timings: "Ghats open 24 hours; Aarti at sunset",
      entryFee: { indian: "Free", foreigner: "Free" },
      budgetLevel: "Budget",
      recommendedDuration: "1 day",
      suitableFor: ["Solo", "Family", "Group"],
      seasonalTags: ["Winter"],
      nearbyHotels: [
        { name: "BrijRama Palace", priceRange: "₹12,000 - ₹20,000/night", distanceKm: 0.5 },
        { name: "Hotel Ganges View", priceRange: "₹3,000 - ₹5,000/night", distanceKm: 1 },
      ],
      nearbyRestaurants: [{ name: "Kashi Chaat Bhandar", cuisine: "Street Food", priceRange: "₹", distanceKm: 0.8 }],
      famousFood: [{ name: "Banarasi Chaat", description: "Spicy-tangy street snacks unique to Varanasi's lanes." }],
      localTransport: ["Boat rides on the Ganges", "Cycle-rickshaw", "Walking"],
      location: { address: "Varanasi, Uttar Pradesh", mapLink: "https://maps.google.com/?q=Varanasi+Ghats", lat: 25.3109, lng: 83.0107 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ahilya_Ghat_by_the_Ganges,_Varanasi.jpg?width=800", isCover: true }],
      tags: ["ganges", "temple", "pilgrimage"],
      isVerified: true,
    },
    {
      name: "Baga Beach",
      slug: "baga-beach-goa",
      state: stateBySlug["goa"]._id,
      city: calangute._id,
      categories: [cat.beaches, cat.adventure],
      shortDescription: "Goa's most popular beach for nightlife, water sports and shacks.",
      description: "Baga Beach is known for its buzzing beach shacks, water sports like parasailing and jet-skiing, and a lively nightlife scene along the North Goa coastline.",
      bestTimeToVisit: "November - February",
      timings: "Open all day",
      entryFee: { indian: "Free", foreigner: "Free" },
      budgetLevel: "Mid-range",
      recommendedDuration: "1 day",
      suitableFor: ["Couple", "Group", "Solo"],
      seasonalTags: ["Winter"],
      isFeaturedOffer: true,
      offerText: "Combo water-sports packages discounted for groups of 4+.",
      nearbyHotels: [
        { name: "Taj Holiday Village Resort", priceRange: "₹10,000 - ₹18,000/night", distanceKm: 3 },
        { name: "Baga Beach Resort", priceRange: "₹2,500 - ₹4,500/night", distanceKm: 0.3 },
      ],
      nearbyRestaurants: [
        { name: "Britto's", cuisine: "Goan & Seafood", priceRange: "₹₹", distanceKm: 0.2 },
        { name: "Fisherman's Wharf", cuisine: "Goan & Continental", priceRange: "₹₹₹", distanceKm: 4 },
      ],
      famousFood: [{ name: "Goan Fish Curry Rice", description: "A tangy coconut-based curry, a staple beach-shack meal." }],
      localTransport: ["Rented scooters/bikes", "App-based cabs", "Local buses"],
      location: { address: "Baga, North Goa, Goa", mapLink: "https://maps.google.com/?q=Baga+Beach+Goa", lat: 15.5553, lng: 73.7517 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Baga_Beach1.jpg?width=800", isCover: true }],
      tags: ["beach", "nightlife", "watersports"],
      isVerified: true,
    },
    {
      name: "Ranthambore National Park",
      slug: "ranthambore-national-park",
      state: stateBySlug["rajasthan"]._id,
      city: sawaiMadhopur._id,
      categories: [cat.wildlife, cat.nature],
      shortDescription: "One of India's best places to spot wild Bengal tigers.",
      description: "Ranthambore National Park is a former royal hunting ground turned tiger reserve, combining dense forest, lakes and the ruins of Ranthambore Fort within its boundaries.",
      bestTimeToVisit: "October - June",
      timings: "6:00 AM - 6:00 PM (safari slots vary by season)",
      entryFee: { indian: "₹500 (safari)", foreigner: "₹2000 (safari)" },
      budgetLevel: "Mid-range",
      recommendedDuration: "1-2 days",
      suitableFor: ["Family", "Group", "Solo"],
      seasonalTags: ["Winter", "Summer"],
      nearbyHotels: [
        { name: "Sawai Madhopur Lodge", priceRange: "₹8,000 - ₹14,000/night", distanceKm: 5 },
        { name: "Hotel Ankur Resort", priceRange: "₹2,500 - ₹4,000/night", distanceKm: 3 },
      ],
      nearbyRestaurants: [{ name: "Resort in-house dining (most stays)", cuisine: "Multi-cuisine", priceRange: "₹₹", distanceKm: 0 }],
      famousFood: [{ name: "Rajasthani Thali", description: "A full spread of local curries, roti and sweets served at area resorts." }],
      localTransport: ["Jeep safari", "Canter (open bus) safari"],
      location: { address: "Sawai Madhopur, Rajasthan", mapLink: "https://maps.google.com/?q=Ranthambore+National+Park", lat: 26.0173, lng: 76.5026 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ranthambore_National_Park.JPG?width=800", isCover: true }],
      tags: ["tiger", "safari", "wildlife"],
      isVerified: true,
    },
    {
      name: "Solang Valley",
      slug: "solang-valley-manali",
      state: stateBySlug["himachal-pradesh"]._id,
      city: manali._id,
      categories: [cat.mountains, cat.adventure],
      shortDescription: "A snow-capped valley near Manali known for adventure sports.",
      description: "Solang Valley offers paragliding, zorbing and skiing against a backdrop of the Pir Panjal and Solang glaciers, making it one of Himachal's top adventure hubs.",
      bestTimeToVisit: "March - June, December - February (for snow)",
      timings: "9:00 AM - 5:00 PM",
      entryFee: { indian: "Free (activities charged separately)", foreigner: "Free (activities charged separately)" },
      budgetLevel: "Mid-range",
      recommendedDuration: "1 day",
      suitableFor: ["Couple", "Group", "Family"],
      seasonalTags: ["Winter", "Summer"],
      nearbyHotels: [
        { name: "Span Resort & Spa", priceRange: "₹9,000 - ₹15,000/night", distanceKm: 8 },
        { name: "Zostel Manali", priceRange: "₹800 - ₹1,500/night", distanceKm: 10 },
      ],
      nearbyRestaurants: [{ name: "Johnson's Café", cuisine: "Continental & Himachali", priceRange: "₹₹", distanceKm: 9 }],
      famousFood: [{ name: "Siddu", description: "Steamed stuffed bread, a Himachali specialty." }],
      localTransport: ["Rented bikes", "Shared taxis from Manali", "Local buses"],
      location: { address: "Solang Valley, near Manali, Himachal Pradesh", mapLink: "https://maps.google.com/?q=Solang+Valley", lat: 32.3172, lng: 77.1571 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley,_Paragliding,_India.jpg?width=800", isCover: true }],
      tags: ["snow", "paragliding", "himalaya"],
      isVerified: true,
    },
    {
      name: "Hampi Ruins",
      slug: "hampi-ruins",
      state: stateBySlug["karnataka"]._id,
      city: hampi._id,
      categories: [cat.heritage],
      shortDescription: "The boulder-strewn ruins of the once-mighty Vijayanagara Empire.",
      description: "Hampi's UNESCO-listed ruins spread across a surreal boulder landscape, featuring the iconic Virupaksha Temple, the Stone Chariot, and the remains of one of medieval India's richest cities.",
      historicalSignificance: "Capital of the Vijayanagara Empire (14th–16th century), once one of the largest cities in the world.",
      bestTimeToVisit: "October - February",
      timings: "6:00 AM - 6:00 PM",
      entryFee: { indian: "₹40", foreigner: "₹600" },
      budgetLevel: "Budget",
      recommendedDuration: "2 days",
      suitableFor: ["Solo", "Group", "Couple"],
      seasonalTags: ["Winter"],
      nearbyHotels: [
        { name: "Evolve Back Kamalapura Palace", priceRange: "₹15,000+/night", distanceKm: 3 },
        { name: "Hampi's Boulders Resort", priceRange: "₹3,000 - ₹5,000/night", distanceKm: 5 },
      ],
      nearbyRestaurants: [{ name: "Mango Tree Restaurant", cuisine: "South Indian & Multi-cuisine", priceRange: "₹", distanceKm: 1 }],
      famousFood: [{ name: "Bisi Bele Bath", description: "A spiced rice-lentil dish popular across Karnataka." }],
      localTransport: ["Bicycle rentals", "Auto-rickshaw", "Coracle boat crossing"],
      location: { address: "Hampi, Ballari district, Karnataka", mapLink: "https://maps.google.com/?q=Hampi", lat: 15.3350, lng: 76.4600 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Main_gopuram_of_the_Virupaksha_Temple_in_Hampi.jpg?width=800", isCover: true }],
      tags: ["unesco", "ruins", "vijayanagara"],
      isVerified: true,
    },
    {
      name: "Mawlynnong Village",
      slug: "mawlynnong-village",
      state: stateBySlug["meghalaya"]._id,
      city: mawlynnong._id,
      categories: [cat.nature],
      shortDescription: "A tiny East Khasi Hills village famed as Asia's cleanest village.",
      description: "Mawlynnong is a community-run village where residents have voluntarily kept the streets spotless for decades, powered by bamboo dustbins and a strict no-littering ethic. Nearby is a living root bridge grown from rubber tree roots, and a natural balancing rock.",
      historicalSignificance: "Named Asia's cleanest village by Discover India magazine in 2003, driven entirely by community initiative rather than government intervention.",
      bestTimeToVisit: "October - April",
      timings: "Open all day",
      entryFee: { indian: "Free", foreigner: "Free" },
      budgetLevel: "Budget",
      recommendedDuration: "Half day",
      suitableFor: ["Family", "Couple", "Solo"],
      seasonalTags: ["Winter", "Summer"],
      isHiddenGem: true,
      hiddenGemNote: "Rarely on standard itineraries — most visitors to Meghalaya skip straight to Cherrapunji.",
      nearbyHotels: [{ name: "Mawlynnong homestays (community-run)", priceRange: "₹800 - ₹2,000/night", distanceKm: 0 }],
      nearbyRestaurants: [{ name: "Village-run local eateries", cuisine: "Khasi", priceRange: "₹", distanceKm: 0 }],
      famousFood: [{ name: "Jadoh", description: "A Khasi rice dish cooked with pork or other meat and local spices." }],
      localTransport: ["Shared taxis from Shillong", "Walking within the village"],
      location: { address: "Mawlynnong, East Khasi Hills, Meghalaya", mapLink: "https://maps.google.com/?q=Mawlynnong+Village", lat: 25.1999, lng: 91.9316 },
      images: [{ url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mawlynnong,_Asia's_Cleanest_Village.jpg?width=800", isCover: true }],
      tags: ["village", "cleanest village", "khasi"],
      isVerified: true,
    },
  ]);

  console.log("Seeding festivals...");
  await Festival.create([
    { name: "Pushkar Camel Fair", state: stateBySlug["rajasthan"]._id, month: "November", description: "One of the world's largest camel and livestock fairs, held in the holy town of Pushkar with folk music, camel races and a bustling trade mela." },
    { name: "Jaipur Literature Festival", state: stateBySlug["rajasthan"]._id, month: "January", description: "A major literary gathering held in Jaipur, bringing together authors, thinkers and readers from around the world." },
    { name: "Onam", state: stateBySlug["kerala"]._id, month: "August", description: "Kerala's biggest harvest festival, marked by grand sadya feasts, snake boat races, and pookalam (flower carpet) displays." },
    { name: "Thrissur Pooram", state: stateBySlug["kerala"]._id, month: "April", description: "A spectacular temple festival in Thrissur featuring decorated elephants, traditional percussion ensembles and fireworks." },
    { name: "Taj Mahotsav", state: stateBySlug["uttar-pradesh"]._id, month: "February", description: "A 10-day cultural festival in Agra celebrating Mughal-era arts, crafts, music and cuisine near the Taj Mahal." },
    { name: "Dev Deepawali", state: stateBySlug["uttar-pradesh"]._id, month: "November", description: "Varanasi's ghats are lit with millions of oil lamps in a spectacular celebration, fifteen days after Diwali." },
    { name: "Baisakhi", state: stateBySlug["punjab"]._id, month: "April", description: "Punjab's harvest festival and Sikh new year, celebrated with bhangra, gidda and processions at the Golden Temple." },
    { name: "Goa Carnival", state: stateBySlug["goa"]._id, month: "February", description: "A colourful, Portuguese-influenced street parade with music, dance and floats across Goa's towns." },
    { name: "Winter Carnival Manali", state: stateBySlug["himachal-pradesh"]._id, month: "January", description: "A snow festival in Manali featuring skiing competitions, cultural performances and bonfire nights." },
    { name: "Hampi Utsav", state: stateBySlug["karnataka"]._id, month: "November", description: "A vibrant cultural festival amid the ruins of Hampi, showcasing Karnataka's dance, music and puppetry traditions." },
  ]);

  console.log("Seeding default admin (email: admin@travelbharat.in / password: Admin@123)...");
  await Admin.create({
    name: "Super Admin",
    email: "admin@travelbharat.in",
    password: "Admin@123",
    role: "superadmin",
  });

  console.log(`Seed complete: ${insertedStates.length} states/UTs, ${categories.length} categories, 11 tourist places (incl. 1 hidden gem), 10 festivals.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
