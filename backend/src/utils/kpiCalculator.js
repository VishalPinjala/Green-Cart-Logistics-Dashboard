export const calculateKPIs = (orders, availableDrivers, routes, simulationParams) => {
  const { numDrivers, startTime, maxHoursPerDay } = simulationParams;
  
  let totalProfit = 0;
  let onTimeDeliveries = 0;
  let lateDeliveries = 0;
  let totalFuelCost = 0;
  
  if (!orders || orders.length === 0) {
    return {
      totalProfit: 0,
      efficiencyScore: 0,
      onTimeDeliveries: 0,
      lateDeliveries: 0,
      fuelCost: 0,
      details: []
    };
  }

  // Select only the specified number of drivers
  const selectedDrivers = availableDrivers.slice(0, numDrivers);
  
  // Track driver workload for the simulation
  const driverWorkload = selectedDrivers.map(driver => ({
    id: driver._id,
    name: driver.name,
    hoursWorked: driver.currentShiftHours || 0,
    pastWeekHours: driver.pastWeekHours || [0,0,0,0,0,0,0],
    deliveriesToday: 0,
    isFatigued: (driver.currentShiftHours || 0) > 8
  }));

  const orderDetails = [];
  
  // Process each order
  orders.forEach((order, index) => {
    // Find the route for this order
    const route = routes.find(r => 
      r._id.toString() === order.assignedRoute.toString() || 
      r._id.toString() === order.assignedRoute._id?.toString()
    );
    
    if (!route) {
      console.warn(`Route not found for order ${order.orderId}`);
      return;
    }

    // Assign driver (round-robin or least loaded)
    const driverIndex = index % selectedDrivers.length;
    const assignedDriver = driverWorkload[driverIndex];
    
    // Check if this delivery would exceed max hours
    const estimatedDeliveryHours = route.baseTimeMinutes / 60;
    if (assignedDriver.hoursWorked + estimatedDeliveryHours > maxHoursPerDay) {
      // Skip this delivery or reassign to another driver
      console.warn(`Driver ${assignedDriver.name} would exceed max hours`);
    }

    // Calculate delivery time with fatigue rule
    let actualDeliveryTime = route.baseTimeMinutes;
    
    // Rule 2: Driver Fatigue Rule - if driver worked >8 hours, speed decreases by 30%
    if (assignedDriver.isFatigued) {
      actualDeliveryTime = actualDeliveryTime * 1.3;
    }

    // Rule 1: Late Delivery Penalty - if delivery time > (base route time + 10 minutes)
    const allowedTime = route.baseTimeMinutes + 10;
    const isLate = actualDeliveryTime > allowedTime;
    
    let deliveryPenalty = 0;
    if (isLate) {
      deliveryPenalty = 50; // ₹50 penalty
      lateDeliveries++;
    } else {
      onTimeDeliveries++;
    }

    // Rule 4: Fuel Cost Calculation
    let fuelCost = route.distanceKm * 5; // Base cost: ₹5/km
    if (route.trafficLevel === "High") {
      fuelCost += route.distanceKm * 2; // +₹2/km surcharge for high traffic
    }
    totalFuelCost += fuelCost;

    // Rule 3: High-Value Bonus - if order value > ₹1000 AND delivered on time
    let highValueBonus = 0;
    if (order.valueRs > 1000 && !isLate) {
      highValueBonus = order.valueRs * 0.1; // 10% bonus
    }

    // Rule 5: Overall Profit calculation
    const orderProfit = order.valueRs + highValueBonus - deliveryPenalty - fuelCost;
    totalProfit += orderProfit;

    // Update driver workload
    assignedDriver.hoursWorked += estimatedDeliveryHours;
    assignedDriver.deliveriesToday++;

    // Store order details for debugging/reporting
    orderDetails.push({
      orderId: order.orderId,
      driverName: assignedDriver.name,
      routeId: route.routeId,
      orderValue: order.valueRs,
      fuelCost,
      highValueBonus,
      deliveryPenalty,
      orderProfit,
      isLate,
      actualDeliveryTime,
      allowedTime
    });
  });

  // Rule 6: Efficiency Score calculation
  const totalDeliveries = onTimeDeliveries + lateDeliveries;
  const efficiencyScore = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

  return {
    totalProfit: Math.round(totalProfit * 100) / 100, // Round to 2 decimal places
    efficiencyScore: Math.round(efficiencyScore * 100) / 100,
    onTimeDeliveries,
    lateDeliveries,
    fuelCost: Math.round(totalFuelCost * 100) / 100,
    driverUtilization: driverWorkload.map(d => ({
      name: d.name,
      hoursWorked: Math.round(d.hoursWorked * 100) / 100,
      deliveriesToday: d.deliveriesToday
    })),
    details: orderDetails // For debugging - remove in production
  };
};