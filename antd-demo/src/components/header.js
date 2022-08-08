import './customMenu.css'
import {Link} from 'react-router-dom';

const CustomMenu = () => (
    <>
      <div className="container topBotomBordersOut">
         <a href='/mint'>MINT</a>
         <a href='/list'>LIST</a>
         <a>ABOUT</a>
      </div>
    </>
  );
  
  export default CustomMenu;
  