
import './App.css';
import CustomMenu from './components/header.js';
import Minter from './components/minter';
import ListNFTs from './components/listNFT';

import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";

const App = () => (
  <>

    {/* <CustomMenu></CustomMenu> */}
    <div className='cardview'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Minter/>} />
          <Route path="/mint" element={<Minter/>} />
          <Route path="/list" element={<ListNFTs/>} />
        </Routes>
      </BrowserRouter>
    </div>
    <div className='footer'>
      MintOZ ©2022 Created by Pyi Thein Kyaw
    </div>
  </>
);

export default App;
