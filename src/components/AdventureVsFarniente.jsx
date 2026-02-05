import answers from "../data/answers"
import bgImage from "../assets/adventure-farniente.png"

function AdventureVsFarniente({ onAnswer }) {
  return (
    <div className="screen">

      {/* CONTENEUR IMAGE */}
      <div className="image-wrapper">

        <img
          src={bgImage}
          alt=""
          className="background-image"
        />

        {/* BOUTONS RELATIFS À L’IMAGE */}
        <button className="btn btn-aventure" style={{ top: "25%", left: "8%" }}>
          Aventurier
        </button>

        <button className="btn btn-farniente" style={{ top: "25%", right: "8%" }}>
          Farniente
        </button>

        <button className="btn" style={{ top: "90%", left: "50%", transform: "translateX(-50%)" }}>
          Les deux
        </button>

        <button className="btn" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}>
          Aucun des deux
        </button>

        <button className="btn" style={{ top: "70%", left: "5%" }}>
          Les deux mais + aventure
        </button>

        <button className="btn" style={{ top: "70%", right: "5%" }}>
          Les deux mais + farniente
        </button>

      </div>
    </div>
  )
}


export default AdventureVsFarniente