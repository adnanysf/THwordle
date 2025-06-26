'use client'


import Image from "next/image";
import { useState, useEffect } from "react";
import directorsData from "./stuff/Directors.json";

export default function Home() {
  const [pastGuesses, setPastGuesses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [targetDirector, setTargetDirector] = useState(null);
  
  const directors = directorsData.directors;
  
  useEffect(() => {
    const today = new Date();
    const dateString = today.toDateString();
    const seed = dateString.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(seed) % directors.length;
    setTargetDirector(directors[index]);
  }, []);

  const compareGuess = (guessedDirector) => {
    if (!targetDirector) return null;
    
    return {
      name: guessedDirector.name === targetDirector.name,
      gradDate: guessedDirector.grad_date === targetDirector.grad_date,
      flag: guessedDirector.flag === targetDirector.flag,
      director: guessedDirector
    };
  };

  const handleGuess = () => {
    if (!inputValue.trim() || pastGuesses.length >= 5 || gameOver) return;
    
    const guessedDirector = directors.find(d => 
      d.name.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (!guessedDirector) {
      alert("Please select a valid director from the list");
      return;
    }

    const result = compareGuess(guessedDirector);
    const newGuess = { ...result, guessNumber: pastGuesses.length + 1 };
    
    setPastGuesses([...pastGuesses, newGuess]);
    setInputValue("");
    setShowSuggestions(false);
    
    if (result.name && result.gradDate && result.flag) {
      setGameWon(true);
      setGameOver(true);
    } else if (pastGuesses.length >= 4) {
      setGameOver(true);
    }
  };
  
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
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const getBoxColorName = (isCorrect, isWin) => {
    if (isWin) return "bg-pink-400";
    return isCorrect ? "bg-green-500" : "bg-red-500";
  };

    const getBoxColorClass = (isCorrect, isWin) => {
    if (isWin) return "bg-blue-400";
    return isCorrect ? "bg-green-500" : "bg-red-500";
  };

      const getBoxColorFlag = (isCorrect, isWin) => {
    if (isWin) return "bg-pink-400";
    return isCorrect ? "bg-green-500" : "bg-red-500";
  };

  const getFlagEmoji = (flagName) => {
    return flagEmojis[flagName] || flagName;
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
    <div className="mb-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">TH Wordle</h1>
      <p className="text-gray-600">Guess the TH Director, u have 5 tries.</p>
      {gameOver && (
        <div className="mt-4 p-4 rounded-lg bg-gray-800 text-white">
          {gameWon ? (
            <p className="text-green-400 font-bold">winner winner nafis for dinner</p>
          ) : (
            <p className="text-red-400 font-bold">
               that was embarassing, the director was: {targetDirector?.name}
            </p>
          )}
        </div>
      )}
    </div>

    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-2xl w-full">
      <div className="relative w-full max-w-md mb-6">
        <input 
          className="w-full p-4 mb-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
          placeholder={gameOver ? "Game Over" : "Type a director's name..."}
          disabled={gameOver}
        />
        
        {showSuggestions && filteredDirectors.length > 0 && !gameOver && (
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
      
      <button 
        onClick={handleGuess}
        disabled={!inputValue.trim() || gameOver}
        className="w-full max-w-md px-4 py-2 text-lg font-semibold text-white bg-blue-600 flex items-center justify-center
        rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Guess ({5 - pastGuesses.length} left)
      </button>
        
        <div className="w-full mt-6">
          <h2 className="text-xl font-bold text-center mb-4 text-black">Your Guesses</h2>

          {pastGuesses.length === 0 ? (
            <p className="text-center text-gray-500">No guesses yet. Start guessing!</p>
          ) : (
            <div className="space-y-4">
              {pastGuesses.map((guess, index) => {
                const isWinningGuess = guess.name && guess.gradDate && guess.flag;
                return (
                  <div key={index} className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded text-white font-semibold text-center ${getBoxColorName(guess.name, isWinningGuess)}`}>
                      <div className="text-xs mb-1">NAME</div>
                      <div className="text-sm">{guess.director.name}</div>
                    </div>
                    
                    <div className={`p-3 rounded text-white font-semibold text-center ${getBoxColorClass(guess.gradDate, isWinningGuess)}`}>
                      <div className="text-xs mb-1">GRAD DATE</div>
                      <div className="text-sm">{guess.director.grad_date}</div>
                    </div>
                    
                    <div className={`p-3 rounded text-white font-semibold text-center ${getBoxColorFlag(guess.flag, isWinningGuess)}`}>
                      <div className="text-xs mb-1">FLAG</div>
                      <div className="text-lg" dangerouslySetInnerHTML={{ __html: getFlagEmoji(guess.director.flag) }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
    </div>


   </div>
  );
}
