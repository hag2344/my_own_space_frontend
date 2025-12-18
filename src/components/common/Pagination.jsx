import "./Pagination.css";

/**
 * 공용 페이지네이션 컴포넌트
 *
 * props:
 * - page: 현재 페이지(0-based)
 * - totalPages: 전체 페이지 수
 * - onPageChange: 페이지 변경 시 호출 (newPage: number)
 * - groupSize: 한 번에 보여줄 페이지 버튼 개수 (기본 5)
 */

const Pagination = ({ page, totalPages, onPageChange, groupSize = 5 }) => {
  if (totalPages < 1) return null;
  const currentGroup = Math.floor(page / groupSize);
  const startPage = currentGroup * groupSize;
  const endPage = Math.min(startPage + groupSize - 1, totalPages - 1);

  const showPrevButtons = page > 0;
  const showNextButtons = page < totalPages - 1;

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        className={i === page ? "active" : ""}
        onClick={() => onPageChange(i)}
      >
        {i + 1}
      </button>
    );
  }

  return (
    <div className="pagination">
      {/* 처음 / 이전 - 첫 페이지에서는 안 보이게 */}
      {showPrevButtons && (
        <>
          <button onClick={() => onPageChange(0)}>{"<<"}</button>
          <button onClick={() => onPageChange(page - 1)}>{"<"}</button>
        </>
      )}

      {/* 페이지 번호 그룹 */}
      {pageButtons}

      {/* 다음 / 마지막 - 마지막 페이지에서는 안 보이게 */}
      {showNextButtons && (
        <>
          <button onClick={() => onPageChange(page + 1)}>{">"}</button>
          <button onClick={() => onPageChange(totalPages - 1)}>{">>"}</button>
        </>
      )}
    </div>
  );
};

export default Pagination;
