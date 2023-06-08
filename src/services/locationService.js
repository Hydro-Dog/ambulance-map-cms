export const getGeolocation = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      resolve(pos.coords);
    }

    function error(err) {
      reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
};
