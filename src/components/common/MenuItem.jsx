import { Link } from "react-router-dom";

const MenuItem = ({ path, title, onNavigate }) => {
  return (
    <Link to={path} onClick={onNavigate}>
      {title}
    </Link>
  );
};

export default MenuItem;
