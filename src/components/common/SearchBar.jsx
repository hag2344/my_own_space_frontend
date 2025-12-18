import "./SearchBar.css";
import Button from "./Button";

const SearchBar = ({
  SearchBarName = "Search...",
  ButtonName = "새 글 작성하기",
  onClick,
  onSearch,
  value,
  onChange,
}) => {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-wrapper">
        <input
          className="search-bar"
          placeholder={SearchBarName}
          maxLength={100}
          value={value ?? ""}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch?.();
            }
          }}
        />
        <button type="button" onClick={onSearch}>
          <img src="./icon-search.svg" alt="search" />
        </button>
      </div>
      <Button type={"New"} text={ButtonName} onClick={onClick} />
    </div>
  );
};

export default SearchBar;
