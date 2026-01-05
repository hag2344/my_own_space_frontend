import "./HomePanelItem.css";

import { formatKoreanDateShort } from "../../utils/dateFormat";

const HomePanelItem = ({
  id,
  title,
  thumbnailUrl,
  createdAt,
  onClick,
  onKeyDown,
}) => {
  return (
    <div
      className="home-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="home-thumb">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" loading="lazy" />
        ) : (
          <div className="home-thumb-fallback">No Image</div>
        )}
      </div>

      <div className="home-card-body">
        <div className="home-card-title">{title}</div>
        {createdAt && (
          <div className="home-card-sub">
            {formatKoreanDateShort(createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePanelItem;
