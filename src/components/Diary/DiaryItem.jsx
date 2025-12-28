import "./DiaryItem.css";
import { getWeatherImage } from "../../utils/get-weather-image";
import { formatKoreanDateShort } from "../../utils/dateFormat";

const DiaryItem = ({ id, title, todayDate, weatherId, content, onClick }) => {
  return (
    <div className="diary-item-card" onClick={onClick}>
      <img src={getWeatherImage(weatherId)} />
      <div className="diary-item-card-wrapper">
        <h3>{title}</h3>
        <p className="diary-item-card-content">{content}</p>
        <p>{formatKoreanDateShort(todayDate)}</p>
      </div>
    </div>
  );
};

export default DiaryItem;
