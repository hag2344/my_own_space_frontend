import "./BookReportEditor.css";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookReportApi, unwrapResponse } from "../../api/bookreportApi";
import Button from "../common/Button";
import AutoResizeTextarea from "../common/AutoResizeTextarea";

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

const BookReportEditor = ({ initData, onSubmit }) => {
  const [form, setForm] = useState({
    bookName: "",
    publisher: "",
    author: "",
    motive: "",
    plot: "",
    realization: "",
  });

  // 표지 이미지 경로(백엔드에 저장할 값) + 미리보기 URL
  const [coverPath, setCoverPath] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!initData) return;

    setForm({
      bookName: initData.bookName || "",
      publisher: initData.publisher || "",
      author: initData.author || "",
      motive: initData.motive || "",
      plot: initData.plot || "",
      realization: initData.realization || "",
    });

    // 백엔드에서 표지 경로나 URL을 어떻게 내려주는지에 맞춰 사용
    setCoverPath(initData.imagePath || "");
    setCoverPreview(initData.thumbnailUrl || ""); // 없으면 "" 유지
  }, [initData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadCoverImage = async (file) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      alert("이미지 용량은 최대 50MB까지 업로드할 수 있습니다.");
      return;
    }

    try {
      const res = await bookReportApi.uploadImage(file);
      const { path, url } = unwrapResponse(
        res,
        "이미지 업로드에 실패했습니다."
      );

      setCoverPath(path);
      setCoverPreview(url);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert(err.message || "이미지 업로드에 실패했습니다.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    uploadCoverImage(file);
  };

  const handleImageAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    uploadCoverImage(file);
  };

  const handleSubmit = async () => {
    const trimmedBookName = form.bookName.trim();
    if (!trimmedBookName) {
      alert("도서명을 입력해 주세요.");
      return;
    }

    const trimmedRealization = form.realization.trim();
    if (!trimmedRealization) {
      alert("느낀점을 입력해 주세요.");
      return;
    }

    const payload = {
      ...form,
      imagePath: coverPath || "",
    };

    try {
      setIsSaving(true);
      await onSubmit?.(payload);
    } catch (err) {
      console.error("독서 기록 저장 실패:", err);
      alert(err.message || "독서 기록 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const clearCoverImage = () => {
    setCoverPath("");
    setCoverPreview("");

    // 같은 파일을 다시 선택해도 onChange가 동작하게 input도 초기화
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bookreport-editor-wrapper">
      <section className="bookreport-editor-header">
        {/* 표지 이미지 영역 */}
        <div
          className={
            "bookreport-editor-image" +
            (isDragOver ? " dragover" : "") +
            (coverPreview ? " has-image" : "")
          }
          onClick={handleImageAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {coverPreview ? (
            <>
              <img src={coverPreview} alt="책 표지" />
              {/* 우측 상단 X 버튼 */}
              <button
                type="button"
                className="cover-remove-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // 이미지영역 클릭 이벤트(파일 선택) 막기
                  clearCoverImage();
                }}
                aria-label="표지 이미지 삭제"
                title="삭제"
              >
                ×
              </button>
            </>
          ) : (
            <div className="bookreport-editor-image-placeholder">
              <p>책 표지 이미지를 등록해 주세요</p>
              <p className="hint">클릭하거나 파일을 드래그해서 업로드</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* 오른쪽 도서 정보 */}
        <div className="bookreport-editor-bookinfo">
          <div className="bookreport-field">
            <label htmlFor="bookName">도서명</label>
            <input
              id="bookName"
              name="bookName"
              value={form.bookName}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
          <div className="bookreport-field">
            <label htmlFor="publisher">출판사</label>
            <input
              id="publisher"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
          <div className="bookreport-field">
            <label htmlFor="author">저 자</label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
        </div>
      </section>
      <section className="bookreport-editor-content">
        <fieldset>
          <legend>책을 읽게 된 동기</legend>
          <AutoResizeTextarea
            name="motive"
            value={form.motive}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>줄거리</legend>
          <AutoResizeTextarea
            name="plot"
            value={form.plot}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>느낀점</legend>
          <AutoResizeTextarea
            name="realization"
            value={form.realization}
            onChange={handleChange}
          />
        </fieldset>
      </section>
      <section className="bookreport-editor-action">
        <Button
          text={isSaving ? "저장 중..." : initData ? "수정" : "등록"}
          type={"New"}
          onClick={handleSubmit}
        />
        <Button text={"뒤로가기"} type={"Basic"} onClick={() => navigate(-1)} />
      </section>
    </div>
  );
};

export default BookReportEditor;
