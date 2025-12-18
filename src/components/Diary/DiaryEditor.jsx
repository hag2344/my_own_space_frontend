import Button from "../common/Button";
import "./DiaryEditor.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeatherItem from "./WeatherItem";
import { weatherList } from "../../utils/constants";
import { getToday } from "../../utils/dateFormat";

const DiaryEditor = ({ initData, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    todayDate: getToday(),
    weatherId: 1,
    wakeUpTime: "",
    sleepTime: "",
    content: "",
    todayImportantWork: "",
    todayKindWork: "",
    todaySelfReflection: "",
    tomorrowWork: "",
  });

  const navigate = useNavigate();

  // initData가 바뀔 때 값 다시 채우기
  useEffect(() => {
    if (!initData) return;

    setForm({
      title: initData.title || "",
      todayDate: initData.todayDate || getToday(),
      weatherId: initData.weatherId || 1,
      wakeUpTime: initData.wakeUpTime || "",
      sleepTime: initData.sleepTime || "",
      content: initData.content || "",
      todayImportantWork: initData.todayImportantWork || "",
      todayKindWork: initData.todayKindWork || "",
      todaySelfReflection: initData.todaySelfReflection || "",
      tomorrowWork: initData.tomorrowWork || "",
    });
  }, [initData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="diary-editor-wrapper">
      <section className="diary-editor-title">
        <fieldset>
          <legend>제목</legend>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
          />
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>날짜</legend>
          <input
            type="date"
            name="todayDate"
            value={form.todayDate}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>날씨</legend>
          <div className="weather-list-wrapper">
            {weatherList.map((item) => (
              <WeatherItem
                key={item.weatherId}
                onClick={() => {
                  handleChange({
                    target: {
                      name: "weatherId",
                      value: item.weatherId,
                    },
                  });
                }}
                weatherId={item.weatherId}
                isSelected={item.weatherId === form.weatherId}
              />
            ))}
          </div>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>일어난 시각</legend>
          <input
            type="time"
            name="wakeUpTime"
            value={form.wakeUpTime}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>잠자는 시각</legend>
          <input
            type="time"
            name="sleepTime"
            value={form.sleepTime}
            onChange={handleChange}
          />
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>내용</legend>
          <textarea
            className="diary-editor-content"
            name="content"
            value={form.content}
            onChange={handleChange}
          />
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>오늘의 중요한 일</legend>
          <textarea
            name="todayImportantWork"
            value={form.todayImportantWork}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>오늘의 착한 일</legend>
          <textarea
            name="todayKindWork"
            value={form.todayKindWork}
            onChange={handleChange}
          />
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>오늘의 반성</legend>
          <textarea
            name="todaySelfReflection"
            value={form.todaySelfReflection}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>내일의 할 일</legend>
          <textarea
            name="tomorrowWork"
            value={form.tomorrowWork}
            onChange={handleChange}
          />
        </fieldset>
      </section>
      <section>
        <fieldset className="diary-editor-action">
          <Button
            text={initData ? "수정" : "등록"}
            type={"New"}
            onClick={() => onSave(form)}
          />
          <Button
            text={"뒤로가기"}
            type={"Basic"}
            onClick={() => navigate(-1)}
          />
        </fieldset>
      </section>
    </div>
  );
};

export default DiaryEditor;
