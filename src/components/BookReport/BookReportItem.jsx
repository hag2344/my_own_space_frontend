import "./BookReportItem.css";

import { formatKoreanDateShort } from "../../utils/dateFormat";

const BookReportItem = ({
  id,
  bookName,
  thumbnailUrl,
  realization,
  createdAt,
  onClick,
}) => {
  const summary = realization.slice(0, 80);

  return (
    <div className="bookreport-item-card" onClick={onClick}>
      <div className="bookreport-item-thumb">
        <img src={thumbnailUrl || "/myownspace.png"} alt={bookName} />
      </div>

      <div className="bookreport-item-body">
        <h3>{bookName}</h3>
        <p className="bookreport-item-summary">{summary}</p>
        <p>{formatKoreanDateShort(createdAt)}</p>
      </div>
    </div>
  );
};

export default BookReportItem;
