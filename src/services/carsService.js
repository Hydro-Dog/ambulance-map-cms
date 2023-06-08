import { getGeolocation } from "./locationService.js";

export const getCarsData = async () => {
  return getGeolocation().then((coords) => {
    const data = Array.from({ length: 7 }).map((_, index) => ({
        id: Math.random()*1000,
        latitude: coords.latitude + Math.random() * 0.03 * (Math.random() > 0.5 ? 1 : -1),
        longitude: coords.longitude + Math.random() * 0.03 * (Math.random() > 0.5 ? 1 : -1),
        name: "Бригада " + (index + 1),
    }));
    return data;
  });
};
