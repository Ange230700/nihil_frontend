// src\App.tsx

import { Routes, Route } from "react-router-dom";
import Home from "@nihil_frontend/pages/Home";
import Header from "@nihil_frontend/components/Header";
import Footer from "@nihil_frontend/components/Footer";

function App() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
