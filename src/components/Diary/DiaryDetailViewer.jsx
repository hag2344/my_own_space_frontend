import "./DiaryDetailViewer.css";
import Button from "../common/Button";
import WeatherItem from "./WeatherItem";
import { weatherList } from "../../utils/constants";
import { formatKoreanDate, formatKoreanTime } from "../../utils/dateFormat";

const DiaryDetailViewer = ({ item, onBack, onEdit, onDelete }) => {
  const {
    title,
    todayDate,
    weatherId,
    wakeUpTime,
    sleepTime,
    content,
    todayImportantWork,
    todayKindWork,
    todaySelfReflection,
    tomorrowWork,
  } = item || {};

  return (
    <div className="diary-detail-viewer-wrapper">
      <section className="diary-detail-title">
        <fieldset>
          <legend>제목</legend>
          <span>{title}</span>
        </fieldset>
      </section>
      <section>
        <fieldset className="diary-detail-text-center">
          <legend>날짜</legend>
          <span>{todayDate ? formatKoreanDate(todayDate) : ""}</span>
        </fieldset>
        <fieldset>
          <legend>날씨</legend>
          <div className="weather-list-wrapper">
            {weatherList.map((item) => (
              <WeatherItem
                key={item.weatherId}
                weatherId={item.weatherId}
                isSelected={item.weatherId === weatherId}
                isDetail={true}
              />
            ))}
          </div>
        </fieldset>
      </section>
      <section>
        <fieldset className="diary-detail-text-center">
          <legend>일어난 시각</legend>
          <span>{wakeUpTime ? formatKoreanTime(wakeUpTime) : ""}</span>
        </fieldset>
        <fieldset className="diary-detail-text-center">
          <legend>잠자는 시각</legend>
          <span>{sleepTime ? formatKoreanTime(sleepTime) : ""}</span>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>내용</legend>
          <p className="diary-detail-content">{content}</p>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>오늘의 중요한 일</legend>
          <p>{todayImportantWork}</p>
        </fieldset>
        <fieldset>
          <legend>오늘의 착한 일</legend>
          <p>{todayKindWork}</p>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>오늘의 반성</legend>
          <p>{todaySelfReflection}</p>
        </fieldset>
        <fieldset>
          <legend>내일의 할 일</legend>
          <p>{tomorrowWork}</p>
        </fieldset>
      </section>

      {/* === 하단 버튼 === */}
      <section className="diary-detail-action">
        <Button text={"수정"} type={"New"} onClick={onEdit} />
        <Button text={"삭제"} type={"Del"} onClick={onDelete} />
        <Button text={"뒤로가기"} type={"Basic"} onClick={onBack} />
      </section>
    </div>
  );
};

export default DiaryDetailViewer;
