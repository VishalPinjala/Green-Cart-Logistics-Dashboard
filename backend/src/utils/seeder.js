import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";
import connectDB from "../config/db.js";

// Sample data that matches the assessment requirements
const sampleDrivers = [
  {
    name: "Rajesh Kumar",
    status: "Active",
    currentShiftHours: 6,
    pastWeekHours: [8, 7, 8, 6, 8, 5, 7],
    totalDeliveriesToday: 5,
  },
  {
    name: "Priya Sharma",
    status: "Active",
    currentShiftHours: 4,
    pastWeekHours: [7, 8, 6, 8, 7, 6, 8],
    totalDeliveriesToday: 3,
  },
  {
    name: "Amit Singh",
    status: "Active",
    currentShiftHours: 9, // This driver is fatigued
    pastWeekHours: [8, 8, 9, 7, 8, 8, 6],
    totalDeliveriesToday: 7,
  },
  {
    name: "Sunita Patel",
    status: "Active",
    currentShiftHours: 5,
    pastWeekHours: [6, 7, 8, 5, 6, 7, 8],
    totalDeliveriesToday: 4,
  },
  {
    name: "Vikash Yadav",
    status: "Off Duty",
    currentShiftHours: 0,
    pastWeekHours: [8, 8, 7, 8, 6, 7, 8],
    totalDeliveriesToday: 0,
  },
];

const sampleRoutes = [
  {
    routeId: "R001",
    distanceKm: 15,
    trafficLevel: "Low",
    baseTimeMinutes: 45,
  },
  {
    routeId: "R002",
    distanceKm: 22,
    trafficLevel: "Medium",
    baseTimeMinutes: 60,
  },
  {
    routeId: "R003",
    distanceKm: 8,
    trafficLevel: "High",
    baseTimeMinutes: 35,
  },
  {
    routeId: "R004",
    distanceKm: 30,
    trafficLevel: "Low",
    baseTimeMinutes: 75,
  },
  {
    routeId: "R005",
    distanceKm: 18,
    trafficLevel: "High",
    baseTimeMinutes: 50,
  },
  {
    routeId: "R006",
    distanceKm: 12,
    trafficLevel: "Medium",
    baseTimeMinutes: 40,
  },
];

const generateSampleOrders = (routes) => {
  const customerNames = [
    "Arjun Reddy",
    "Kavya Menon",
    "Rohit Gupta",
    "Anita Joshi",
    "Deepak Agarwal",
    "Meera Iyer",
    "Suresh Nair",
    "Divya Khanna",
  ];

  const locations = [
    "Koramangala",
    "Indiranagar",
    "Whitefield",
    "Marathahalli",
    "HSR Layout",
    "BTM Layout",
    "Jayanagar",
    "Rajajinagar",
  ];

  const orders = [];

  for (let i = 1; i <= 20; i++) {
    const route = routes[Math.floor(Math.random() * routes.length)];
    const customerName =
      customerNames[Math.floor(Math.random() * customerNames.length)];
    const pickupLoc = locations[Math.floor(Math.random() * locations.length)];
    let deliveryLoc = locations[Math.floor(Math.random() * locations.length)];

    // Ensure pickup and delivery are different
    while (deliveryLoc === pickupLoc) {
      deliveryLoc = locations[Math.floor(Math.random() * locations.length)];
    }

    // Generate varied order values - some high value (>1000) for bonus testing
    const valueRanges = [500, 750, 1200, 1500, 800, 2000, 650, 1800];
    const valueRs = valueRanges[Math.floor(Math.random() * valueRanges.length)];

    orders.push({
      orderId: `ORD-${String(i).padStart(3, "0")}`,
      customerName: `${customerName}`,
      valueRs,
      pickupLocation: pickupLoc,
      deliveryLocation: deliveryLoc,
      assignedRoute: route._id,
      status: Math.random() > 0.2 ? "Pending" : "In Transit", // 80% pending, 20% in transit
      priorityLevel: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      estimatedDeliveryTimeMinutes: route.baseTimeMinutes,
      orderDate: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time within last 24 hours
    });
  }

  return orders;
};

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Promise.all([
      Driver.deleteMany({}),
      Route.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("🗑️ Cleared existing data");

    // Seed drivers
    const drivers = await Driver.insertMany(sampleDrivers);
    console.log(`👥 Seeded ${drivers.length} drivers`);

    // Seed routes
    const routes = await Route.insertMany(sampleRoutes);
    console.log(`🛣️ Seeded ${routes.length} routes`);

    // Generate and seed orders with route references
    const orders = generateSampleOrders(routes);
    const createdOrders = await Order.insertMany(orders);
    console.log(`📦 Seeded ${createdOrders.length} orders`);

    console.log("✅ Database seeding completed successfully!");

    return {
      drivers: drivers.length,
      routes: routes.length,
      orders: createdOrders.length,
    };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
};

// CLI script to run seeding
export const runSeeder = async () => {
  try {
    await connectDB();
    const result = await seedDatabase();
    console.log("📊 Seeding Summary:", result);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeder();
}
