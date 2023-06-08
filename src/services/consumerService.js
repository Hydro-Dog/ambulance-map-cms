import { getGeolocation } from "./locationService.js";

export const getConsumerData = () => {
  return getGeolocation().then((coords) => ({
    latitude: coords.latitude + Math.random() * 0.01,
    longitude: coords.longitude + Math.random() * 0.01,
    name: "Александр Сергеевич Иванов",
    age: 46,
    phoneNumber: "770-975-44-23",
    address: "ул. Садовая, д.15",
    symptoms: ["Боль в животе", "Жар", "Тошнота"],
  }));
};
