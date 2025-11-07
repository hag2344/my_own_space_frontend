import "./Header.css";

const Header = ({ title, subTitle }) => {
  return (
    <header className="Header">
      <div className="header_center">
        <h1>{title}</h1>
        <span>{subTitle}</span>
      </div>
    </header>
  );
};

export default Header;
