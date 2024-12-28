import { proxy } from "valtio";

// Define the initial state for services
const serviceState = proxy({
  services: [], // List of service objects

  // Reactive getter for total cost
  get totalCost() {
    return this.services.reduce(
      (sum, service) => sum + parseFloat(service.cost || 0),
      0
    );
  },

  // Methods to manage services
  addService(service) {
    this.services.push(service);
  },
  removeService(serviceId) {
    this.services = this.services.filter((service) => service.id !== serviceId);
  },
});

export { serviceState };