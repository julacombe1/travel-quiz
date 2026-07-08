import startImage from "../assets/commencer-le-quizz.png"
function StartScreen({ onStart }) {
  return (
<div className="image-wrapper">

  <img
    src={startImage}
    alt="Commencer le quiz"
    className="start-image"
  />

  <button className="start-quiz-btn" onClick={onStart}>
    COMMENCER<br />LE QUIZZ
  </button>

</div>
  )
}

export default StartScreen