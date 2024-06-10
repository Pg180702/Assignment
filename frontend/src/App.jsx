import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Audience from "./pages/Audience";
import Campaigns from "./pages/Campaigns";
import AddCampaign from "./pages/AddCampaign";
import RedirectHandler from "./components/RedirectHandler";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/audience" element={<Audience />} />
            <Route path="/campaign" element={<Campaigns />} />
            {/* <Route path="/newCampaign" element={<AddCampaign />} /> */}
            <Route path="/oauth/callback" element={<RedirectHandler />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
