export default function Question(props) {
  console.log(props.selectedAnswer)

  let options = props.options.map((option) => <button
    key={option}
    className={`question--option ${props.selectedAnswer === option ? props.status : ""}
    ${props.correctAnswer === option && props.status === "incorrect" && " correct"}
    ${(props.status === "incorrect" || props.status === "correct") && option !== props.correctAnswer && option !== props.selectedAnswer && " unchosen"}`}
    
    onClick={() => props.selectAnswer(option)}>{option}</button>
  )

  return(<div>
    <h2 className="question--question">{props.question}</h2>
    <div className="question--options">{options}</div>
    <hr className="question--line"/>
  </div>)
}