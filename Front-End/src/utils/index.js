import { proxy } from "valtio";

// Define the initial state for services
const serviceState = proxy({
  services: [], // List of service objects

  // Reactive getter for total cost
  get totalCost() {
    return this.services.reduce((sum, service) => {
      const cost = parseFloat(service.cost);
      if (isNaN(cost)) {
        console.warn(`Invalid cost for service: ${service.cost}`);
        return sum;
      }
      return sum + cost;
    }, 0);
  },

  // Methods to manage services
  addService(service) {
    if (!service.description || !service.cost) {
      console.warn("Invalid service data. Description and cost are required.");
      return;
    }
    this.services.push(service);
  },

  removeService(index) {
    if (index < 0 || index >= this.services.length) {
      console.warn(`Invalid service index: ${index}`);
      return;
    }
    this.services.splice(index, 1);
  },
});

export { serviceState };
