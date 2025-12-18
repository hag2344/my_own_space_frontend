import "./WeatherItem.css";
import { getWeatherImage } from "../../utils/get-weather-image";

const WeatherItem = ({ weatherId, isSelected, onClick, isDetail }) => {
  return (
    <div
      onClick={onClick}
      className={`weather-item ${isSelected ? `weather-item-selected` : ""} ${
        isDetail ? `weather-item-detail` : ""
      }`}
    >
      <img className="weather-img" src={getWeatherImage(weatherId)} />
    </div>
  );
};

export default WeatherItem;
