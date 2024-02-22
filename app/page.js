"use client";
import { useState, useRef, useEffect } from 'react';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(20).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [showResultSection, setShowResultSection] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerShowing, setTimerShowing] = useState(false);
  const [selectedNums, setSelectedNums] = useState(Array(19).fill(false).map((_, i) => i + 2 >= 6 && i + 2 <= 9 || i + 2 >= 12 && i + 2 <= 19));
  const [quizStarted, setQuizStarted] = useState(false); // Track if quiz has started

  const inputRef = useRef(null);

  useEffect(() => {
    startTimer(); // Start timer when the quiz starts
  }, []);

  const startTimer = () => {
    setTimerRunning(true);
    setTimerShowing(true);
  };

  const resetTimer = () => {
    setElapsedTime(0);
  };

  const toggleTimerPause = () => {
    setTimerRunning(!timerRunning);
  };

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleNumCheckboxChange = (index) => {
    const newSelectedNums = [...selectedNums];
    newSelectedNums[index] = !newSelectedNums[index];
    setSelectedNums(newSelectedNums);
  };

  const isAnyCheckboxSelected = selectedNums.includes(true);

  const generateQuestions = () => {
    const newQuestions = [];
    const selectedNumsArray = selectedNums.map((isSelected, index) => isSelected ? index + 2 : null).filter(num => num !== null);
    for (let i = 0; i < 20; i++) {
      const num1 = selectedNumsArray[Math.floor(Math.random() * selectedNumsArray.length)];
      const num2 = Math.floor(Math.random() * 8) + 2; // This will generate a random integer between 2 and 9
      const question = `${num1} x ${num2}`;
      const answer = num1 * num2;
      newQuestions.push({ question, answer });
    }
    setQuestions(newQuestions);
    setResults([]);
    setCurrentIndex(0);
    setUserAnswers(Array(20).fill(''));
    setShowResults(false);
    setCurrentAnswer(0);
    setShowResultSection(false);
    resetTimer(); // Reset timer for each question
    startTimer(); // Start timer when generating new questions
    setQuizStarted(true); // Quiz has started
  };

  const handleButtonClick = (value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] += value.toString(); // Concatenate button value
    setUserAnswers(updatedAnswers);
    setCurrentAnswer(updatedAnswers[currentIndex]); // Update current answer
  };

  const handleClearLastInput = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = updatedAnswers[currentIndex].slice(0, -1); // Remove last character
    setUserAnswers(updatedAnswers);
    setCurrentAnswer(updatedAnswers[currentIndex] || 0); // Update current answer or set it to 0 if empty
  };

  const handleClearAllInputs = () => {
    setUserAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentIndex] = ''; // Clear input for the current question
      setCurrentAnswer(0); // Set current answer to 0
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const question = questions[currentIndex];
    const userAnswer = userAnswers[currentIndex];
    const isCorrect = userAnswer == question.answer;
    setResults([...results, { question, userAnswer, isCorrect, timeTaken: elapsedTime }]);
    setShowResultSection(true); // Show answer section after submitting
    setTimerRunning(false); // Stop timer
    setTimerShowing(false); // Hide timer
  };

  const handleNextQuestion = () => {
    if (currentIndex < 19) {
      setCurrentIndex(currentIndex + 1);
      resetTimer(); // Reset timer for the next question
      setTimerRunning(true); // Start timer
      setTimerShowing(true); // Show timer
      setShowResultSection(false); // Hide result section for the next question
      setCurrentAnswer(0); // Set current answer to 0
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      handleFinishTest(); // Finish test if it's the last question
    }
  };

  const handleFinishTest = () => {
    setShowResults(true);
  };

  const handleRetakeTest = () => {
    setQuizStarted(false); // Reset quiz started state
    // setSelectedNums(Array(19).fill(false).map((_, i) => i + 2 >= 6 && i + 2 <= 9 || i + 2 >= 12 && i + 2 <= 19)); // Reset selectedNums
    setResults([]); // Clear previous results
    setShowResults(false); // Hide results
  };

  const calculateScore = () => {
    if (results.length === 0) {
      return 0;
    }
    return results.filter(result => result.isCorrect).length;
  };

  const calculateAverageTime = () => {
    if (results.length === 0) {
      return 0;
    }
    const totalTimes = results.reduce((acc, curr) => acc + curr.timeTaken, 0);
    // return Math.round(totalTimes / results.length);
    return (totalTimes / results.length);
  };

  return (
    <div className='text-center flex flex-col justify-center max-w-96 w-11/12 mx-auto'>
      <h1 className='font-sans font-medium text-2xl my-2'>Multiplication Tables Test</h1>
      <div className='bg-amber-100'>

        {!showResults ? (
          <div>
            {!quizStarted && (
              <div className='m-5'>
                <p className='text-lg font-serif'>Select tables you want to practice:</p>
                <div className="grid grid-cols-4" /*style={{display: 'grid', gridTemplateColumns: 'auto auto auto auto'}}*/>
                  {[...Array(19)].map((_, index) => (
                    <div key={index} className='checkbox-wrapper-26 my-2'>
                      <input
                        type="checkbox"
                        checked={selectedNums[index]}
                        onChange={() => handleNumCheckboxChange(index)}
                        id={`num${index + 2}`}
                      />
                      <label htmlFor={`num${index + 2}`}>
                        <p className="tick_mark"></p>
                      </label>
                      <p className='' style={{}}>{index + 2}</p>
                    </div>
                  ))}
                </div>
                {!isAnyCheckboxSelected && <p className="text-red-600 font-medium">Please select atleast one option!</p>}
                <button className='mt-4' onClick={generateQuestions} disabled={!isAnyCheckboxSelected}>Start Quiz</button>
              </div>
            )}

            {quizStarted && questions.length > 0 && (
              <div className="mx-auto border border-black rounded-lg" /*style={{border: '1px solid black'}}*/>
                <p className='pt-3 font-serif'>Question {currentIndex + 1} of 20:</p>
                <p className='py-2 text-lg'>{questions[currentIndex].question} =</p>
                <p className="text-xl border border-black p-2 mx-5 text-right rounded-2xl bg-yellow-50">{currentAnswer ? currentAnswer : 0}</p>

                <div>
                  {timerShowing && <p className='font-mono pt-4'>Time Elapsed: {elapsedTime} seconds</p>}
                </div>

                <div className='grid grid-cols-3 gap-3 items-center justify-center m-5'>
                  <button onClick={handleClearLastInput}>C</button>
                  <button onClick={() => handleButtonClick(0)}>0</button>
                  <button onClick={handleClearAllInputs}>AC</button>
                  {[...Array(9)].map((_, index) => (
                    <button key={index + 1} onClick={() => handleButtonClick(index + 1)}>
                      {index + 1}
                    </button>
                  ))}
                  <button className='bg-green-600 hover:bg-green-500' disabled={!currentAnswer} onClick={handleSubmit}>Submit</button>
                  <button className='bg-yellow-500 hover:bg-yellow-400' disabled={showResultSection} onClick={toggleTimerPause}>{!timerRunning ? 'Resume' : 'Pause'}</button>
                  <button className='bg-red-600 hover:bg-red-500' onClick={handleFinishTest}>Finish</button>
                </div>

                {results.length > 0 && showResultSection && (
                  <div className='my-3'>
                    <p className={currentAnswer == questions[currentIndex].answer ? 'text-green-600 text-lg' : 'text-red-600 text-lg'}>
                      {currentAnswer == questions[currentIndex].answer ? 'That\'s a correct answer' : `Sorry! the correct answer is ${questions[currentIndex].answer}`}
                    </p>
                    {/* <p>Question: {questions[currentIndex].question}</p>
                    <p>Your Answer: {currentAnswer}</p>
                    <p>Correct Answer: {questions[currentIndex].answer}</p> */}
                    <p className='font-mono'>Time Taken: {elapsedTime} seconds</p>
                    <button className='my-2' onClick={handleNextQuestion}>{currentIndex < 19 ? 'Next Question' : 'Finish test'}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className='text-xl my-2'>Test Results</h2>
            <p className='font-sans font-semibold text-lg'>Your score: {calculateScore()} out of {results.length}</p>
            <p className='font-sans'>(Average time taken: {calculateAverageTime()} seconds per question)</p>
            <ul className=''>
              {results.map((result, index) => (
                <>
                  <li key={index} className='m-2 inline-block p-3 rounded-xl' style={{ backgroundColor: `${result.isCorrect ? '#99e699' : '#ff8080'}` }}>
                    <p>Q{index + 1}: {result.question.question}</p>
                    <p>Your Answer: {result.userAnswer}</p>
                    <p>Correct Answer: {result.question.answer}</p>
                    <p className='font-semibold font-serif'>{result.isCorrect ? 'Correct' : 'Incorrect'}</p>
                    <p className='font-mono'>Time Taken: {result.timeTaken} seconds</p>
                  </li>
                  <br />
                </>
              ))}
            </ul>
            <button className='mt-2 mb-4' onClick={handleRetakeTest}>Retake Test</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
