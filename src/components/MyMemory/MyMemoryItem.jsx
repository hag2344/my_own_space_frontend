import "./MyMemoryItem.css";

import { formatKoreanDateShort } from "../../utils/dateFormat";

const MyMemoryItem = ({
  id,
  title,
  thumbnailUrl,
  contentHtml,
  createdAt,
  onClick,
}) => {
  // 간단 텍스트 요약용 (HTML 태그 제거)
  const getPlainText = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const summary = getPlainText(contentHtml).slice(0, 80);

  return (
    <div className="mymemory-item-card" onClick={onClick}>
      <div className="mymemory-item-thumb">
        <img src={thumbnailUrl || "/myownspace.png"} alt={title} />
      </div>

      <div className="mymemory-item-body">
        <h3>{title}</h3>
        <p className="mymemory-item-summary">{summary}</p>
        {/* createdAt 포맷은 나중에 util 있으면 거기 연결해도 됨 */}
        <p>{formatKoreanDateShort(createdAt)}</p>
      </div>
    </div>
  );
};

export default MyMemoryItem;
