import "./MyMemoryDetailViewer.css";
import Button from "../common/Button";
import { formatKoreanDateTimeShort } from "../../utils/dateFormat";

const MyMemoryDetailViewer = ({ item, onBack, onEdit, onDelete }) => {
  if (!item) return null;

  const { title, contentHtml, createdAt, updatedAt } = item;

  return (
    <div className="mymemory-detail-wrapper">
      <section className="mymemory-detail-header">
        <h2>{title}</h2>
        <div className="mymemory-detail-meta">
          <span>작성: {formatKoreanDateTimeShort(createdAt)}</span>
          {updatedAt && (
            <span>수정: {formatKoreanDateTimeShort(updatedAt)}</span>
          )}
        </div>
      </section>

      <section className="mymemory-detail-content">
        {/* Toast UI가 생성한 HTML을 그대로 렌더 */}
        <div
          className="mymemory-detail-html"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>

      <section className="mymemory-detail-action">
        <Button text="수정" type="New" onClick={onEdit} />
        <Button text="삭제" type="Del" onClick={onDelete} />
        <Button text="뒤로가기" type="Basic" onClick={onBack} />
      </section>
    </div>
  );
};

export default MyMemoryDetailViewer;
