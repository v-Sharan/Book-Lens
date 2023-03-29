import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { Login, Signup } from "./components/contents/index";

function App() {
  return (
    <React.Fragment>
      <Navbar>
        <Routes>
          <Route path="/" element={<>Home</>} />
        </Routes>
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Navbar>
    </React.Fragment>
  );
}

export default App;
