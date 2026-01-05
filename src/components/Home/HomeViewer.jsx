import "./HomeViewer.css";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ScrollTopButton from "../common/ScrollTopButton";
import Button from "../common/Button";
import HomePanelItem from "./HomePanelItem";

import { homeApi } from "../../api/homeApi";

const HomeViewer = () => {
  const navigate = useNavigate();

  const [todaySchedule, setTodaySchedule] = useState([]);
  const [todayDiary, setTodayDiary] = useState(null);
  const [latestMemory, setLatestMemory] = useState([]);
  const [latestBookReport, setLatestBookReport] = useState([]);
  const [todayScheduleCount, setTodayScheduleCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await homeApi.summary();

      // ApiResponse<T>
      const apiRes = res?.data;
      if (!apiRes?.success) {
        setErrorMsg(apiRes?.message || "홈 정보를 불러오지 못했어요.");
        return;
      }

      const payload = apiRes.data;
      setTodayScheduleCount(payload?.todayScheduleCount ?? 0);
      setTodaySchedule(payload?.todaySchedules ?? []);
      setTodayDiary(payload?.todayDiary ?? null);
      setLatestMemory(payload?.latestMemories ?? []);
      setLatestBookReport(payload?.latestBookReports ?? []);
    } catch (e) {
      setErrorMsg("홈 정보를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await fetchSummary();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [fetchSummary]);

  if (isLoading) {
    return (
      <div className="home-wrapper">
        <section className="home-section">
          <p className="empty">불러오는 중...</p>
        </section>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="home-wrapper">
        <section className="home-section">
          <p className="empty">{errorMsg}</p>
          <Button text="다시 시도" type="Basic" onClick={fetchSummary} />
        </section>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* 오늘 요약 */}
      <section className="home-summary">
        <h2>Today</h2>
        <p>
          일정 {todayScheduleCount}개 ·
          {todayDiary ? " 오늘의 일기 작성됨" : " 일기 미작성"}
        </p>
      </section>

      {/* 오늘의 일정 */}
      <section className="home-section">
        <h3>오늘의 일정</h3>
        {todaySchedule.length === 0 ? (
          <p className="empty">오늘은 등록된 일정이 없어요</p>
        ) : (
          <ul className="home-list">
            {todaySchedule.slice(0, 3).map((item) => (
              <li key={item.id} className="home-list-item">
                {item.title}
              </li>
            ))}
          </ul>
        )}
        <Button
          text="일정 관리로 이동"
          type="Basic"
          onClick={() => navigate("/schedule")}
        />
      </section>

      {/* 오늘의 일기 */}
      <section className="home-section highlight">
        <h3>오늘의 일기</h3>
        {todayDiary ? (
          <>
            <h4 className="home-title-ellipsis">{todayDiary.title}</h4>
            <Button
              text="일기 보기"
              type="Basic"
              onClick={() => navigate(`/diary/${todayDiary.id}`)}
            />
          </>
        ) : (
          <>
            <p className="empty">오늘의 일기를 아직 쓰지 않았어요</p>
            <Button
              text="오늘의 일기 쓰기"
              type="New"
              onClick={() => navigate("/diary/new")}
            />
          </>
        )}
      </section>

      {/* 최신 기록 */}
      <section className="home-grid">
        {/* 내 추억 */}
        <div className="home-panel">
          <div className="home-panel-header">
            <h3>내 추억</h3>
            <Button
              text="더보기"
              type="Basic"
              onClick={() => navigate("/mymemory")}
            />
          </div>

          {latestMemory.length === 0 ? (
            <p className="empty">최근 내 추억이 없어요</p>
          ) : (
            <div className="home-cards">
              {latestMemory.map((item) => (
                <HomePanelItem
                  key={item.id}
                  {...item}
                  onClick={() => navigate(`/mymemory/${item.id}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/mymemory/${item.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* 독서 기록 */}
        <div className="home-panel">
          <div className="home-panel-header">
            <h3>독서 기록</h3>
            <Button
              text="더보기"
              type="Basic"
              onClick={() => navigate("/bookreport")}
            />
          </div>

          {latestBookReport.length === 0 ? (
            <p className="empty">최근 독서 기록이 없어요</p>
          ) : (
            <div className="home-cards">
              {latestBookReport.map((item) => (
                <HomePanelItem
                  key={item.id}
                  title={item.bookName}
                  {...item}
                  onClick={() => navigate(`/bookreport/${item.id}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/bookreport/${item.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ScrollTopButton />
    </div>
  );
};

export default HomeViewer;
