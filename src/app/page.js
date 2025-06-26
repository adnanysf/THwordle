'use client'


import Image from "next/image";
import { useState } from "react";
import directorsData from "./stuff/Directors.json";

export default function Home() {
  const [pastGuesses, setPastGuesses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Access the directors data
  const directors = directorsData.directors;
  
  // Filter directors based on input
  const filteredDirectors = directors.filter(director =>
    director.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (directorName) => {
    setInputValue(directorName);
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };
  
  const flagEmojis = {
    "China": "&#127464;&#127475;",
    "USA": "&#127482;&#127480;",
    "Bangladesh": "&#127463;&#127465;",
    "India": "&#127470;&#127475;",
    "Sri Lanka": "&#127473;&#127472;",
    "Mexico": "&#127474;&#127485;",
    "Nigeria": "&#127475;&#127468;",
    "Korea": "&#127472;&#127479;",
    "Philippines": "&#127477;&#127469;",
    "Netherlands": "&#127475;&#127473;",
    "Vietnam": "&#127483;&#127475;",
    "Spain": "&#127466;&#127480;"
};


  return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="relative w-full max-w-md">
        <input 
          className="w-full p-4 mb-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
          placeholder="Type a director's name..."
        />
        
        {showSuggestions && filteredDirectors.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b shadow-lg max-h-48 overflow-y-auto">
            {filteredDirectors.slice(0, 10).map((director, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
                onMouseDown={() => handleSuggestionClick(director.name)}
              >
                <span className="font-medium">{director.name}</span>
                <span className="text-sm text-gray-500 ml-2">({director.grad_date})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full max-w-md px-4 py-2 text-lg font-semibold text-white bg-blue-600 flex items-center justify-center
      rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        Guess
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg text-black">
          <h1>Past Guesses</h1>

          <ul className="w-full max-w-md mt-4">
            {pastGuesses.map((guess, index) => (
              <li key={index} className="p-2 mb-2 bg-gray-200 rounded">
                {guess}
              </li>
            ))}
          </ul>

        </div>
    </div>


   </div>
  );
}
