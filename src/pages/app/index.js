import React, { useState, useEffect, useRef, useMemo } from "react";

// OpenWeatherMap API && Leaflet Map Components import
import { openweather } from "../../api/weather";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Components import
import { MainStyledComponent } from "../../components/MainStyledComponent";
import { LocationRequestScreen } from "../../components/LocationRequestScreen";
import { Container } from "../../components/Container";
import { Menu } from "../../components/Menu";
import { MenuInfo } from "../../components/MenuInfo";
import { Logo } from "../../components/Logo";
import { MinLogo } from "../../components/MinLogo";
import { WeatherData } from "../../components/WeatherData";
import { WeatherDataRow } from "../../components/WeatherDataRow";
import { TemperatureBox } from "../../components/TemperatureBox";
import { ClimaticData } from "../../components/ClimaticData";
import { MapIcon } from "../../components/MapIcon";
import { Warnings } from "../../components/Warnings";

// style
import "../../index.css";

export function Main() {
  // Grabbing the exactly user's local time when page is renderized
  let date = new Date();

  // Date hooks
  const [month, setMonth] = useState(date.getMonth());
  const [day, setDay] = useState(date.getDate());
  const [dayName, setDayName] = useState(date.getDay());
  const [hours, setHours] = useState(date.getHours());
  const [minutes, setMinutes] = useState(date.getMinutes());

  // Date refresher (to update the user's local time every second)
  useEffect(() => {
    setInterval(() => {
      date = new Date();
      setDay(date.getDate());
      setMinutes(date.getMinutes());
      setHours(date.getHours());
    }, 1000);
  }, []);

  // Months && Days name
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septempber",
    "October",
    "November",
    "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Ordinal Numbers Concordance
  const st = [1, 21, 31];
  const nd = [2, 22];
  const rd = [3, 23];

  function ordinalNumberConcordance(day) {
    if (st.includes(day)) {
      return "st";
    } else if (nd.includes(day)) {
      return "nd";
    } else if (rd.includes(day)) {
      return "rd";
    } else {
      return "th";
    }
  }

  // Location hook ( to storage the user's geolocation: latitude & longitude )
  const [location, setLocation] = useState({});
  const locationRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = locationRef.current;
        if (marker != null) {
          setLocation(marker.getLatLng());
        }
      },
    }),
    []
  );

  // Grabbing the user's geolocation on page render
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLocation({ lat, lng });
      console.log(location);
    });
  }, []);

  // Weather Hooks
  const [response, setResponse] = useState(false);
  const [weatherUpdateTime, setWeatherUpdateTime] = useState(false);
  const [sunriseTime, setSunriseTime] = useState(false);
  const [sunsetTime, setSunsetTime] = useState(false);
  const [temperatureIcon, setTemperatureIcon] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("metric");

  // Icons id
  const clearSkyIcons = ["01d", "01n"];
  const partyCloudSkyIcons = ["02d", "02n", "03d", "03n"];
  const cloudySkyIcons = ["04d", "04n", "50d"];
  const snowSkyIcons = ["13d"];
  const lightRainSkyIcons = ["10d"];
  const intensityRainSkyIcons = ["13d", "09d"];
  const thunderstormSkyIcons = ["11d"];

  // Page Hooks
  const [isDataLoaded, setisDataLoaded] = useState(false);

  // Search Field hooks
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setisDataLoaded(false);
    getData({ q: searchTerm });
  };
  const handleClearSearch = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setisDataLoaded(false);
    getData();
  };
  // toggles temperature unit

  const toggleTemperatureUnit = () => {
    if (temperatureUnit === "metric") setTemperatureUnit("imperial");
    else setTemperatureUnit("metric");
  };

  // Getting Weather Data from OpenWeatherMap API
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    getData();
  }, [location]);

  async function getData(query = null) {
    let q = query ?? {
      lat: location.lat,
      lon: location.lng,
    };
    try {
      const res = await openweather.get("/weather", {
        params: {
          ...q,
          units: "metric",
          appid: process.env.REACT_APP_OPEN_WEATHER_SECRET_KEY,
        },
      });

      // api temp
      setResponse(res["data"]);
      setWeatherUpdateTime(
        new Date(res["data"]["dt"] * 1000 + res["data"]["timezone"])
      );
      setSunriseTime(
        new Date(res["data"]["sys"]["sunrise"] * 1000 + res["data"]["timezone"])
      );
      setSunsetTime(
        new Date(res["data"]["sys"]["sunset"] * 1000 + res["data"]["timezone"])
      );
      setTemperatureIcon(res["data"]["weather"]["0"]["icon"]);
      setisDataLoaded(true);
    } catch (err) {
      setisDataLoaded(true);
      console.log(err.response);
    }
  }

  // var tempinCelsius = response["main"]["temp"].toFixed(0);
  // console.log(tempinCelsius);  }

  if (!location) {
    return (
      <LocationRequestScreen>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MinLogo>
            
            <h1>
              <br /> weather
            </h1>
            <br></br>
            <h3>by TradeMarkia</h3>
          </MinLogo>
          <Warnings>
            <p>
              Getting your location to give weather details.
            </p>
          </Warnings>
        </Container>
        <div className="citybg"></div>
      </LocationRequestScreen>
    );
  }

  if (!isDataLoaded) {
    return (
      <LocationRequestScreen>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MinLogo>
            {/* <img
              src="/images/sunny-icon.svg"
              alt="sunny icon"
              draggable="false"
            /> */}
            <h1>
               Weather
            </h1><br></br>
            <h3>by TradeMarkia</h3>
          </MinLogo>
          <Warnings>
            <h1>Loading data...</h1>
          </Warnings>
        </Container>
        <div className="citybg"></div>
      </LocationRequestScreen>
    );
  }

  return (
    <MainStyledComponent temperature={response["main"]["temp"]}>
      <Container>
        <Menu>
          <MenuInfo>
            <span>
              {hours < 10 ? "0" + hours : hours}:
              {minutes < 10 ? "0" + minutes : minutes}
            </span>
            <span>
              {months[month]}, {day}
              {ordinalNumberConcordance(day)}{" "}
            </span>
          </MenuInfo>

          <Logo>
            {/* <img
              src="/images/sunny-icon.svg"
              alt="sunny icon"
              draggable="false"
            /> */}
            <h1>
              Weather
            </h1>
            <br></br>
            <h3>by TradeMarkia</h3>

          </Logo>

          <MenuInfo textAlign="right">
            <div className="search-container">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="Search..."
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={handleClearSearch}
                  >
                    <i className="fa fa-times" style={{ color: "black" }}></i>
                  </button>
                )}
                <button type="submit" className="search-submit">
                  Search
                </button>
              </form>
            </div>
            <span>{response ? response["name"] : "Loading.."}</span>
            <span>{response ? response["sys"]["country"] : "Loading..."}</span>
          </MenuInfo>
        </Menu>

        <WeatherData>
          <WeatherDataRow>
            <TemperatureBox
              temperature={response ? response["main"]["temp"] : "0"}
            >
              {clearSkyIcons.includes(temperatureIcon) && (
                <img
                  src="/images/weather_icons/sunny_01.svg"
                  draggable="false"
                />
              )}

              {partyCloudSkyIcons.includes(temperatureIcon) && (
                <img
                  src="/images/weather_icons/partycloudy.svg"
                  draggable="false"
                />
              )}

              {cloudySkyIcons.includes(temperatureIcon) && (
                <img src="/images/weather_icons/cloudy.svg" draggable="false" />
              )}

              {snowSkyIcons.includes(temperatureIcon) && (
                <img src="/images/weather_icons/snow.svg" draggable="false" />
              )}

              {lightRainSkyIcons.includes(temperatureIcon) && (
                <img
                  src="/images/weather_icons/sun_and_rain.svg"
                  draggable="false"
                />
              )}

              {intensityRainSkyIcons.includes(temperatureIcon) && (
                <img src="/images/weather_icons/rain.svg" draggable="false" />
              )}

              {thunderstormSkyIcons.includes(temperatureIcon) && (
                <img
                  src="/images/weather_icons/thunderstorm.svg"
                  draggable="false"
                />
              )}
              <i
                onClick={toggleTemperatureUnit}
                style={{ fontSize: "6rem", marginRight: "12px" }}
                class="fa-solid fa-sliders cursor-pointer"
                title={"Toggle temperature unit"}
              ></i>
              {/*final temperature */}
              <h1 className="temperature">
                {temperatureUnit === "metric"
                  ? response["main"]["temp"].toFixed(0) + "ºC"
                  : (response["main"]["temp"] * (9 / 5) + 32).toFixed(0) + "ºF"}
              </h1>

              <div className="info">
                <p className="temperature-description">
                  {""}
                  {response["weather"]["0"]["main"]}{" "}
                </p>

                <p className="city-name"> {response["name"]} </p>

                <p className="weather-updated-time">
                  {" "}
                  <b>
                    {days[dayName]}, {day}
                  </b>{" "}
                  {months[month]}.{" "}
                  {weatherUpdateTime.getHours() < 9
                    ? "0" + weatherUpdateTime.getHours()
                    : weatherUpdateTime.getHours()}
                  :
                  {weatherUpdateTime.getMinutes() < 10
                    ? "0" + weatherUpdateTime.getMinutes()
                    : weatherUpdateTime.getMinutes()}
                </p>
              </div>
            </TemperatureBox>

            <ClimaticData>
              <div className="climatic-data-column">
                <p>
                  Min:{" "}
                  <b>
                    {temperatureUnit === "metric"
                      ? response["main"]["temp_min"].toFixed(0) + "ºC"
                      : (response["main"]["temp_min"] * (9 / 5) + 32).toFixed(
                          0
                        ) + "ºF"}
                  </b>
                </p>
                <p>
                  Max:{" "}
                  <b>
                    {temperatureUnit === "metric"
                      ? response["main"]["temp_max"].toFixed(0) + "ºC"
                      : (response["main"]["temp_max"] * (9 / 5) + 32).toFixed(
                          0
                        ) + "ºF"}
                  </b>
                </p>
                <p>
                  Feels Like:{" "}
                  <b>
                    {temperatureUnit === "metric"
                      ? response["main"]["feels_like"].toFixed(0) + "ºC"
                      : (response["main"]["feels_like"] * (9 / 5) + 32).toFixed(
                          0
                        ) + "ºF"}
                  </b>
                </p>
              </div>
              <div
                className="climatic-data-column"
                style={{ textAlign: "right" }}
              >
                <p>
                  Pressure: <b>{response["main"]["pressure"]} hPA</b>
                </p>
                <p>
                  Humidity: <b>{response["main"]["humidity"]}%</b>
                </p>
                <p>
                  Visibility: <b>{response["visibility"]}m</b>
                </p>
              </div>
            </ClimaticData>
          </WeatherDataRow>

          <WeatherDataRow>
            <ClimaticData>
              <div className="climatic-data-column">
                <div className="climatic-data-row">
                  <div>
                    <img
                      src="/images/sunrise-icon.svg"
                      alt="sunrise icon"
                      draggable="false"
                    />
                    <p>Sunrise: </p>
                  </div>
                  <p>
                    <b>
                      {sunriseTime.getHours() < 10
                        ? "0" + sunriseTime.getHours()
                        : sunriseTime.getHours()}
                      :
                      {sunriseTime.getMinutes() < 10
                        ? "0" + sunriseTime.getMinutes()
                        : sunriseTime.getMinutes()}
                    </b>
                  </p>
                </div>
                <div className="climatic-data-row">
                  <div>
                    <img
                      src="/images/sunset-icon.svg"
                      alt="sunset icon"
                      draggable="false"
                    />
                    <p>Sunset: </p>
                  </div>
                  <p>
                    <b>
                      {sunsetTime.getHours() < 10
                        ? "0" + sunsetTime.getHours()
                        : sunsetTime.getHours()}
                      :
                      {sunsetTime.getMinutes() < 10
                        ? "0" + sunsetTime.getMinutes()
                        : sunsetTime.getMinutes()}
                    </b>
                  </p>
                </div>
              </div>
            </ClimaticData>

            <ClimaticData>
              <div className="climatic-data-column fullsize">
                <div className="climatic-data-row">
                  <div>
                    <img
                      src="/images/windspeed.svg"
                      alt="windspeed icon"
                      draggable="false"
                    />
                    <p>Wind Speed: </p>
                  </div>
                  <p>
                    <b>{response["wind"]["speed"].toFixed(0)}m/s</b>
                  </p>
                </div>
                <div className="climatic-data-row">
                  <div>
                    <img
                      src="/images/winddirection.svg"
                      alt="wind direction icon"
                      draggable="false"
                    />
                    <p>Wind Direction: </p>
                  </div>
                  <p>
                    <b>{response["wind"]["deg"].toFixed(0)}º</b>
                  </p>
                </div>
              </div>
            </ClimaticData>
          </WeatherDataRow>
        </WeatherData>

        <MapContainer
          style={{
            height: "30vh",
            width: "100%",
            borderRadius: "3rem",
            position: "relative",
            zIndex: "500",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
          center={[location.lat, location.lng]}
          zoom="7"
          scrollWheelZoom={true}
          zoomControl={true}
          attributionControl={false}
          dragging={true}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={`https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
          />
          <Marker
            position={[location.lat, location.lng]}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={locationRef}
          ></Marker>
        </MapContainer>
      </Container>
    </MainStyledComponent>
  );
}
