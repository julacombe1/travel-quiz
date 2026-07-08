import answers from "../data/answers";
import bgImage from "../assets/adventure-farniente.png";
const MIN_TEMP_BY_PROFILE = {
  aventure: 15,
  plusAventure: 18,
  mixte: 20,
  farniente: 24,
  plusFarniente: 22,
  fullfarniente: 26,
};


function AdventureVsFarniente({ onSelect }) {
  const handleClick = (key) => {
    const minTemp = MIN_TEMP_BY_PROFILE[key];
onSelect(
  answers[key],
  key,
  MIN_TEMP_BY_PROFILE[key]
);
  };
  return (
    <div className="screen">
      <div className="image-wrapper">
        <img src={bgImage} alt="" className="background-image" />

        <button
          className="btn btn--fullaventure"
          style={{ top: "0%", left: "2%" }}
          onClick={() => handleClick("fullAventure")}
        >
          AVENTURIER<br />DE l'EXTRÊME<br />
        </button>

        <button
          className="btn btn--adventure"
          style={{ top: "15%", left: "2%" }}
          onClick={() => handleClick("aventure")}
        >
          AVENTURIER
        </button>

        <button
          className="btn btn--relax"
          style={{ top: "15%", right: "2%" }}
          onClick={() => handleClick("farniente")}
        >
          FARNIENTE
        </button>

        <button
          className="btn btn--fullrelax"
          style={{ top: "0%", right: "2%" }}
          onClick={() => handleClick("fullFarniente")}
        >
          FARNIENTE<br />DE l'EXTRÊME<br />
        </button>

        <button
          className="btn btn--mixed"
          style={{ top: "70%", left: "50%", transform: "translateX(-50%)" }}
          onClick={() => handleClick("mixte")}
        >
          LES DEUX !
        </button>

        <button
          className="btn btn--neutral"
          style={{ top: "25%", left: "50%", transform: "translateX(-50%)" }}
          onClick={() => handleClick("aucundesdeux")}
        >
          AUCUN<br />DES DEUX
        </button>

        <button
          className="btn btn--adventure_more"
          style={{ top: "80%", left: "2%" }}
          onClick={() => handleClick("plusAventure")}
        >
          mais plus<br />AVENTURIER
        </button>

        <button
          className="btn btn--farniente_more"
          style={{ top: "80%", right: "2%" }}
          onClick={() => handleClick("plusFarniente")}
        >
          mais plus<br />FARNIENTE
        </button>
      </div>
    </div>
  );
}

export default AdventureVsFarniente;
