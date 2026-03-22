
import './App.css';
import Login from './Components/Login'
import Signup from './Components/Signup';
import Forgot from './Components/Forgot';
import Otp from './Components/Otp';
import Reset from './Components/Reset';
import Home from './Components/Home';
import Product from './Components/products/Product';
import AddIndividualProduct from "./Components/products/AddIndividualProduct";
import Setting from './Components/Settings';
import Invoice from './Components/Invoice';
import Stats from './Components/Stats';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/add-individual" element={<AddIndividualProduct />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/invoice" element={<Invoice />}></Route>
          <Route path="/stats" element={<Stats />}></Route>
        </Routes>
      </Router>

      {/* <div style={{ background: "white", color: "black", padding: "20px" }}>
        <h1>APP IS WORKING</h1>
      </div> */}


    </>
  );
}

export default App;
