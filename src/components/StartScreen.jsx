function StartScreen({ onStart }) {
  return (
    <div
      className="screen"
      style={{ backgroundImage: "url('/src/assets/adventure-farniente.png')" }}
    >
      <button className="start-btn" onClick={onStart}>
        Commencer le quiz
      </button>
    </div>
  )
}

export default StartScreen