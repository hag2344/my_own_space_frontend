import "./Aside.css";
import { Link } from "react-router-dom";
import { menuMetaData } from "../../config/menuConfig";

const Aside = ({ onNavigate }) => {
  return (
    <aside className="Aside">
      <ul className="aside_list">
        <li className="menu_profile">
          <img src="/myownspace.png" />
          <div className="project_name">
            <Link to={menuMetaData.home.path} onClick={onNavigate}>
              {menuMetaData.home.title}
            </Link>
          </div>
          <div>test</div>
        </li>

        <li>
          <h2 className="aside_title">메뉴</h2>
          <ul className="menu_list">
            <li>
              <Link to={menuMetaData.home.path} onClick={onNavigate}>
                {menuMetaData.home.menuTitle}
              </Link>
            </li>
            <li>
              <Link to={menuMetaData.schedule.path} onClick={onNavigate}>
                {menuMetaData.schedule.title}
              </Link>
            </li>
            <li>
              <Link to={menuMetaData.diary.path} onClick={onNavigate}>
                {menuMetaData.diary.title}
              </Link>
            </li>
            <li>
              <Link to={menuMetaData.mymemory.path} onClick={onNavigate}>
                {menuMetaData.mymemory.title}
              </Link>
            </li>
            <li>
              <Link to={menuMetaData.bookreport.path} onClick={onNavigate}>
                {menuMetaData.bookreport.title}
              </Link>
            </li>
            <li>
              <Link to={menuMetaData.mymovielist.path} onClick={onNavigate}>
                {menuMetaData.mymovielist.title}
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
