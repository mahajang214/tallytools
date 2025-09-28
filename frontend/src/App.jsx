import { useState, useEffect } from "react";
import Depreciation from "./components/dayCalander/Depreciation";

function App() {
  const [showDepreciation, setShowDepreciation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is touch-enabled (mobile/tablet)
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (!("ontouchstart" in window)) {
      // Desktop / Laptop: listen for keyboard
      const handleKeyDown = (e) => {
        if (e.key === "d" || e.key === "D") {
          setShowDepreciation(true);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const unlockCalculator = () => {
    // Only allow click unlocking for mobile
    if (isMobile) setShowDepreciation(true);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
        Tally tools
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
        {/* Depreciation Card */}
        <div
          className={`bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-2xl transition duration-300 ${
            isMobile ? "cursor-pointer" : ""
          }`}
          onClick={unlockCalculator}
        >
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-3">
            💰 Depreciation Calculator{" "}
            {!showDepreciation &&
              (isMobile ? "(Tap to unlock)" : "(Press D to unlock)")}
          </h2>

          {showDepreciation ? (
            <Depreciation />
          ) : (
            <div className="text-gray-400 text-center py-8">
              🔒 Locked {isMobile ? "- Tap to unlock" : "- Press D to unlock"}
            </div>
          )}
        </div>

        {/* Add other cards here */}
      </div>
    </div>
  );
}

export default App;
