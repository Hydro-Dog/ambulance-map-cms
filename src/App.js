import "./App.css";
import { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { getGeolocation } from "./services/locationService";
import { getCarsData } from "./services/carsService";
import { getConsumerData } from "./services/consumerService";
import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  LinearProgress,
  Button,
} from "@mui/material";
import { SimpleDialog } from "./components/SimpleDialog";
import { CancelDialog } from "./components/CancelDialog";

const App = () => {
  const [myLocation, setMyLocation] = useState(null);
  const [carsLocations, setCarsLocations] = useState(null);
  const [consumerInfo, setConsumerInfo] = useState(null);
  const [ymaps, setYmaps] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [itemHovered, setItemHovered] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [dialogData, setDialogData] = useState(null);

  useEffect(() => {
    getGeolocation().then((coords) =>
      setMyLocation([coords.latitude, coords.longitude])
    );
    getCarsData().then(setCarsLocations);
    getConsumerData().then(setConsumerInfo);
  }, []);

  useEffect(() => {
    if (carsLocations && ymaps) {
      carsLocations.map((item) => {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            // Описание опорных точек мультимаршрута.
            referencePoints: [
              [item?.latitude, item?.longitude],
              [consumerInfo?.latitude, consumerInfo?.longitude],
            ],
            // Параметры маршрутизации.
            params: {
              // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
              results: 2,
            },
          },
          {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true,
            // Внешний вид линии маршрута.
            routeActiveStrokeWidth: 5,
            routeActiveStrokeColor: "#FF1F00",
          }
        );

        multiRoute.model.events.add("requestsuccess", function () {
          // Получение ссылки на активный маршрут.
          const activeRoute = multiRoute.getActiveRoute();
          // Получение коллекции путей активного маршрута.
          const activeRoutePaths = activeRoute.getPaths();
          // Проход по коллекции путей.
          activeRoutePaths.each(function (path) {
            setCarsLocations((prev) =>
              prev.map((carInfo) =>
                carInfo.id === item.id
                  ? {
                      ...carInfo,
                      distance: path.properties.get("distance").text,
                      duration: path.properties.get("duration").text,
                    }
                  : carInfo
              )
            );
          });
        });
      });
    }
  }, [ymaps, carsLocations?.length, consumerInfo]);

  const createRoute = (locationA, locationB) => {
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        // Описание опорных точек мультимаршрута.
        referencePoints: [
          [locationA.latitude, locationA.longitude],
          [locationB.latitude, locationB.longitude],
        ],
        // Параметры маршрутизации.
        params: {
          // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
          results: 2,
        },
      },
      {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true,
        // Внешний вид линии маршрута.
        routeActiveStrokeWidth: 5,
        routeActiveStrokeColor: "#FF1F00",
      }
    );

    mapRef.geoObjects.add(multiRoute);
    setCurrentRoute(multiRoute);
  };

  const [open, setOpen] = useState(false);

  const onSubmit = (value) => {
    mapRef?.geoObjects?.remove(currentRoute);
    setCurrentCar(value);
    createRoute(value, consumerInfo);
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
  };

  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const onExit = () => {
    setOpenCancelDialog(false);
  };

  const onCancelCall = () => {
    setCurrentCar(null);
    mapRef?.geoObjects?.remove(currentRoute);
    setOpenCancelDialog(false);
  };

  return (
    <div className="flex w-full">
      <div className="flex w-2/12 shrink-0 flex-col justify-between p-3">
        <div>
          <div className="mb-4 font-semibold text-slate-500 text-xl">
            Информация о вызове
          </div>
          {!consumerInfo ? (
            <LinearProgress />
          ) : (
            <div className="p-4">
              <div className="mb-4">
                <div className="text-slate-400">Адрес:</div>
                <div>{consumerInfo?.address}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-slate-400">Имя:</div>
                  <div>{consumerInfo?.name}</div>
                </div>
                <div>
                  <div className="text-slate-400">Возраст:</div>
                  <div>{consumerInfo?.age} лет</div>
                </div>
                <div>
                  <div className="text-slate-400">Контактный телефон:</div>
                  <div>{consumerInfo?.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-slate-400">Симптомы:</div>
                  <div className="flex flex-wrap gap-2">
                    {consumerInfo?.symptoms?.map((item) => (
                      <Chip label={item}></Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-7/12 shrink-0">
        <YMaps
          version="2.1.77"
          query={{ apikey: "d5753fc9-8de2-40f6-9ca2-3021a5b43a1c" }}
        >
          <Map
            modules={[
              "multiRouter.MultiRoute",
              "coordSystem.geo",
              "geocode",
              "util.bounds",
              "formatter",
            ]}
            width="100%"
            height="100vh"
            onLoad={(ymaps) => {
              setYmaps(ymaps);
            }}
            state={{ center: myLocation || [], zoom: 12 }}
            instanceRef={setMapRef}
          >
            {carsLocations?.map((item) => (
              <Placemark
                onClick={() => {
                  if (currentCar && currentCar?.id === item.id) {
                    setOpenCancelDialog(true);
                  } else {
                    setOpen(true);
                    setDialogData(item);
                  }
                }}
                geometry={[item?.latitude, item?.longitude]}
                options={{
                  preset:
                    itemHovered === item?.id
                      ? "islands#blueMassTransitCircleIcon"
                      : "islands#lightBlueMassTransitCircleIcon",
                }}
                // onClick={() => setText("Test 6")}
              />
            ))}
            <Placemark
              geometry={[consumerInfo?.latitude, consumerInfo?.longitude]}
              properties={{
                iconContent: `Wow`,
              }}
              options={{
                preset: "islands#redHeartCircleIcon",
              }}
              // onClick={() => setText("Test 6")}
            />
          </Map>
        </YMaps>
      </div>
      <div className="flex w-3/12 shrink-0 flex-col p-3">
        <div className="mb-4 text-xl font-semibold text-slate-500">
          Доступные бригады
        </div>

        {!consumerInfo ? (
          <LinearProgress />
        ) : (
          <List>
            {carsLocations
              ?.sort(
                (itemA, itemB) =>
                  Number(itemA.distance?.replace(",", ".").split(" ")[0]) -
                  Number(itemB.distance?.replace(",", ".").split(" ")[0])
              )
              .map((item) => (
                <ListItem
                  className={
                    currentCar?.id === item.id &&
                    "bg-gradient-to-r from-slate-200"
                  }
                  disablePadding
                >
                  <ListItemButton
                    className="group border-bottom"
                    onMouseEnter={() => {
                      setItemHovered(item.id);
                    }}
                    onMouseLeave={() => {
                      setItemHovered(null);
                    }}
                  >
                    <div className={`justify-between flex w-full`}>
                      <div className="flex flex-col">
                        <div className="font-bold text-md text-slate-500 flex gap-1 ">
                          {item.name}
                        </div>

                        <div className="text-xs text-slate-500 flex gap-1 ">
                          <div>Расстояние:</div>
                          <div className="font-semibold">{item.distance}</div>
                        </div>
                        <div className="text-xs text-slate-500 flex gap-1 ">
                          <div>Время прибытия:</div>
                          <div className="font-semibold">{item.duration}</div>
                        </div>
                      </div>

                      {currentCar?.id === item.id ? (
                        <Button
                          className="!hidden group-hover:!block"
                          variant="contained"
                          color="error"
                          onClick={() => {
                            mapRef?.geoObjects?.remove(currentRoute);
                            setCurrentCar(null);
                          }}
                        >
                          Отменить
                        </Button>
                      ) : (
                        <Button
                          className="!hidden group-hover:!block"
                          variant="outlined"
                          onClick={() => {
                            mapRef?.geoObjects?.remove(currentRoute);
                            createRoute(item, consumerInfo);
                            setCurrentCar(item);
                          }}
                        >
                          Назначить
                        </Button>
                      )}
                    </div>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        )}
      </div>

      <SimpleDialog
        open={open}
        carInfo={dialogData}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />

      <CancelDialog
        open={openCancelDialog}
        carInfo={dialogData}
        onCancel={onExit}
        onSubmit={onCancelCall}
      />
    </div>
  );
};

export default App;
