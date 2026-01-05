import "./BookReportDetailViewer.css";
import Button from "../common/Button";
import { formatKoreanDateTimeShort } from "../../utils/dateFormat";

const BookReportDetailViewer = ({ item, onBack, onEdit, onDelete }) => {
  if (!item) return null;

  const {
    bookName,
    publisher,
    author,
    motive,
    plot,
    realization,
    thumbnailUrl,
    createdAt,
    updatedAt,
  } = item || {};

  return (
    <div className="bookreport-detail-viewer-wrapper">
      <div className="bookeport-detail-meta">
        <span>작성: {formatKoreanDateTimeShort(createdAt)}</span>
        {updatedAt && <span>수정: {formatKoreanDateTimeShort(updatedAt)}</span>}
      </div>
      <section className="bookreport-detail-header">
        {/* 표지 이미지 영역 */}
        <div className={"bookreport-detail-image"}>
          <img src={thumbnailUrl || "/myownspace.png"} alt="책 표지" />
        </div>

        {/* 오른쪽 도서 정보 */}
        <div className="bookreport-detail-bookinfo">
          <div className="bookreport-detail-field">
            <label htmlFor="bookName">도서명 : </label>
            <span>{bookName}</span>
          </div>
          <div className="bookreport-detail-field">
            <label htmlFor="publisher">출판사 : </label>
            <span>{publisher}</span>
          </div>
          <div className="bookreport-detail-field">
            <label htmlFor="author">저 자 : </label>
            <span>{author}</span>
          </div>
        </div>
      </section>
      <section className="bookreport-detail-content">
        <fieldset>
          <legend>책을 읽게 된 동기</legend>
          <p>{motive}</p>
        </fieldset>
        <fieldset>
          <legend>줄거리</legend>
          <p>{plot}</p>
        </fieldset>
        <fieldset>
          <legend>느낀점</legend>
          <p>{realization}</p>
        </fieldset>
      </section>
      <section className="bookreport-detail-action">
        <Button text="수정" type="New" onClick={onEdit} />
        <Button text="삭제" type="Del" onClick={onDelete} />
        <Button text="뒤로가기" type="Basic" onClick={onBack} />
      </section>
    </div>
  );
};

export default BookReportDetailViewer;
