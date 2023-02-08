import React from "react";
import "./sass/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import ChatPage from "./pages/chat_page/ChatPage";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/chat_page" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
