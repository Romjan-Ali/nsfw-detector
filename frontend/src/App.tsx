import React from "react";
import NSFWScanner from "./components/NSFWScanner";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <NSFWScanner />
    </div>
  );
};

export default App;
