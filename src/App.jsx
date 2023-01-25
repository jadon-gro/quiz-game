import { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import Question from "./components/Question"
import Confetti from "react-confetti"


export default function App() {
  let [gameStarted, setGameStarted] = useState(false)

  let [questions, setQuestions] = useState([])

  let [isGameOver, setGameOver] = useState(false)

  let [score, setScore] = useState(0)

  let [difficulty, setDifficulty] = useState("easy")

  useEffect(() => {
    let score = 0;
    for (const q of questions) {
      if (q.selectedAnswer === q.correctAnswer) score++;
    }
    setScore(score)
  }, [questions])

  function startGame() {
    setGameStarted(true)
    loadQuestions(difficulty)
  }

  async function loadQuestions(difficulty) {
    const data = await fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`)
      .then(response => response.json())
    setQuestions(data.results.map(question => {
      return({
        id: nanoid(),
        question: decodeHtml(question.question),
        options: shuffle([
          ...question.incorrect_answers.map((coded => decodeHtml(coded))),
          decodeHtml(question.correct_answer)
        ]),
        correctAnswer: decodeHtml(question.correct_answer),
        selectedAnswer: "",
        status: "unchecked"
      })
    }))
  }

  function shuffle(qs) {
    return qs.sort(() => Math.random() - 0.5)
  }

  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  function selectAnswer(id, answer) {
    if(!isGameOver) {
      setQuestions(prevQuestions => prevQuestions.map(question => question.id === id ?
        {
          ...question,
          selectedAnswer: question.selectedAnswer === answer ? "" : answer
        } : question))
    }

  }

  function handleEndClick() {
    if (isGameOver){
      loadQuestions(difficulty)
      setGameOver(false)
    }
    //check if there has been a selection for all questions
    else if (questions.every(question => question.selectedAnswer !== "")) {
      //check questions
      setQuestions(prevQuestions => prevQuestions.map(question => {return({
        ...question,
        status: question.selectedAnswer === question.correctAnswer ? "correct" : "incorrect"
      })}))
      setGameOver(true)
    } else {
      //TODO: make waring for not having everything be selected

    }
  }
  function handleBack() {
    setGameOver(false);
    setGameStarted(false);
  }

  let questionElements = questions.map((question) => <Question 
    key={question.id}
    question={question.question}
    options={question.options}
    selectedAnswer={question.selectedAnswer}
    correctAnswer={question.correctAnswer}
    status={question.status}
    selectAnswer={(answer) => selectAnswer(question.id, answer)}/>)

  function difficultyChange(newDifficulty) {
    setDifficulty(newDifficulty)
  }

  return(<main>
    {!gameStarted && <div className="title-card">
      <h1 className="main--title">Quizzdingle</h1>
      <h3 className="main--description">A silly goofy quiz game!</h3>
      <button className="main--button" onClick={startGame}>Start Quiz</button>
      <h3 className="main--difficulty">Choose difficulty:</h3>
      <div className="main--difficulty-buttons">
        <button className={`question--option ${difficulty === "easy" && "unchecked"}`} onClick={() => difficultyChange("easy")}>easy</button>
        <button className={`question--option ${difficulty === "medium" && "unchecked"}`} onClick={() => difficultyChange("medium")}>medium</button>
        <button className={`question--option ${difficulty === "hard" && "unchecked"}`} onClick={() => difficultyChange("hard")}>hard</button>
      </div>
    </div>}
    {gameStarted && <div className="main--game">
      <p className="back" onClick={handleBack}><i className="fa fa-chevron-left" aria-hidden="true"></i> back</p>
      <div className="main--questions">{questionElements}</div>
      <div className="main--game-bottom">
        {isGameOver && <p className="score">Score: {score}/{questions.length}</p>}
        <button className="main--button check" onClick={handleEndClick}>{isGameOver ? "Play again" : "Check answers"}</button>
      </div>
    </div>}
    {isGameOver && score === questions.length && <Confetti />}
    
  </main>)
}