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
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  
  const directors = directorsData.directors;
  
  useEffect(() => {
    const now = new Date();
    
    const houstonTimeString = now.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const datePart = houstonTimeString.split(',')[0];
    const [month, day, year] = datePart.split('/');
    
    const houstonDateString = `${year}-${month}-${day}`;
    
    const seed = houstonDateString.split('').reduce((a, b) => {
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
    if (isWin) return "bg-gradient-to-r from-pink-400 to-pink-500";
    return isCorrect ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getBoxColorClass = (isCorrect, isWin) => {
    if (isWin) return "bg-gradient-to-r from-blue-400 to-blue-500";
    return isCorrect ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getBoxColorFlag = (isCorrect, isWin) => {
    if (isWin) return "bg-gradient-to-r from-pink-400 to-pink-500";
    return isCorrect ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  const generateEmojiResults = () => {
    const now = new Date();
    const houstonTimeString = now.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const datePart = houstonTimeString.split(',')[0]; 
    const dateString = datePart;
    
    let resultText = `THWordle ${dateString}\n\n`;
    
    pastGuesses.forEach((guess, index) => {
      const isWinningGuess = guess.name && guess.gradDate && guess.flag;
      
      const nameEmoji = isWinningGuess ? "🩷" : (guess.name ? "🟢" : "🔴");
      const gradEmoji = isWinningGuess ? "🔵" : (guess.gradDate ? "🟢" : "🔴");
      const flagEmoji = isWinningGuess ? "🩷" : (guess.flag ? "🟢" : "🔴");
      
      resultText += `${nameEmoji}${gradEmoji}${flagEmoji}\n`;
    });
    
    if (gameWon) {
      resultText += `\n🎉 Won in ${pastGuesses.length}/5 tries! \n https://th-wordle.vercel.app/`;
    } else if (gameOver) {
      resultText += `\n😅 Failed in 5 tries \n https://th-wordle.vercel.app/`;
    }
    
    return resultText;
  };

  const copyResults = async () => {
    try {
      const results = generateEmojiResults();
      await navigator.clipboard.writeText(results);
      alert("Results copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy results. Please try again.");
    }
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
    "Spain": "&#127466;&#127480;",
    "Canada": "	&#x1f1e8;&#x1f1e6;"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            TH Wordle
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            v2.0
          </p>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            guess the director -  5 tries
          </p>
          
          {gameOver && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl bg-white shadow-lg border border-gray-200 max-w-md mx-auto">
              {gameWon ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-green-600 font-bold text-lg mb-3">
                    Winner winner nafis for dinner!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">😅</div>
                  <p className="text-red-600 font-bold text-lg mb-1">
                    that was embarrassing...
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    The director was: <span className="font-semibold">{targetDirector?.name}</span>
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowResultsPopup(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Share Results 📋
              </button>
            </div>
          )}
        </div>


        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="relative mb-6">
            <input 
              className="w-full p-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200 shadow-sm"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              placeholder={gameOver ? "Game Over" : "Type a director's name..."}
              disabled={gameOver}
            />
            
            {showSuggestions && filteredDirectors.length > 0 && !gameOver && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto mt-1">
                {filteredDirectors.slice(0, 10).map((director, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer text-gray-800 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    onMouseDown={() => handleSuggestionClick(director.name)}
                  >
                    <span className="font-medium text-sm sm:text-base">{director.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleGuess}
            disabled={!inputValue.trim() || gameOver}
            className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-400 to-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Guess ({5 - pastGuesses.length} left)
          </button>
            

          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
              Your Guesses
            </h2>

            {pastGuesses.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4">😛</div>
                <p className="text-gray-500 text-sm sm:text-base">no guesses yet - start guessing fool</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pastGuesses.map((guess, index) => {
                  const isWinningGuess = guess.name && guess.gradDate && guess.flag;
                  return (
                    <div key={index} className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div className={`p-3 sm:p-4 rounded-xl text-white font-semibold text-center shadow-md transition-all duration-300 hover:shadow-lg ${getBoxColorName(guess.name, isWinningGuess)}`}>
                        <div className="text-xs mb-1 opacity-90">NAME</div>
                        <div className="text-xs sm:text-sm font-bold break-words">{guess.director.name}</div>
                      </div>
                      
                      <div className={`p-3 sm:p-4 rounded-xl text-white font-semibold text-center shadow-md transition-all duration-300 hover:shadow-lg ${getBoxColorClass(guess.gradDate, isWinningGuess)}`}>
                        <div className="text-xs mb-1 opacity-90">GRAD DATE</div>
                        <div className="text-xs sm:text-sm font-bold">{guess.director.grad_date}</div>
                      </div>
                      
                      <div className={`p-3 sm:p-4 rounded-xl text-white font-semibold text-center shadow-md transition-all duration-300 hover:shadow-lg ${getBoxColorFlag(guess.flag, isWinningGuess)}`}>
                        <div className="text-xs mb-1 opacity-90">FLAG</div>
                        <div className="text-lg sm:text-xl" dangerouslySetInnerHTML={{ __html: getFlagEmoji(guess.director.flag) }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showResultsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              share Your results
            </h3>
            
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border text-sm font-mono text-gray-800 whitespace-pre-line mb-4 sm:mb-6 overflow-x-auto">
              {generateEmojiResults()}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyResults}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                copy to clipboard
              </button>
              <button
                onClick={() => setShowResultsPopup(false)}
                className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}