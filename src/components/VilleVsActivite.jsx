import answers from "../data/answers2";
import bgImage from "../assets/ville-activite.png";

function VilleVsActivite({ onSelect, onBack }) {
  
  const handleClick = (key) => {
    const values = answers[key] ?? {};

    onSelect?.(values);
  };

  return (
    <div className="screen">
      <div className="image-wrapper">
        <img src={bgImage} alt="" className="background-image" />

        <button
          className="btn btn--fullville"
          style={{ top: "0%", left: "2%" }}
          onClick={() => handleClick("fullVille")}
        >
          100 % CITADIN
        </button>

        <button
          className="btn btn--ville"
          style={{ top: "15%", left: "2%" }}
          onClick={() => handleClick("ville")}
        >
          VILLE
        </button>

        <button
          className="btn btn--activite"
          style={{ top: "15%", right: "2%" }}
          onClick={() => handleClick("activite")}
        >
          ACTIVITÉS
        </button>

        <button
          className="btn btn--fullactivite"
          style={{ top: "0%", right: "2%" }}
          onClick={() => handleClick("fullActivite")}
        >
          ACTIVITÉS<br />DE L'EXTRÊME
        </button>

        <button
          className="btn btn--mixed2"
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
          className="btn btn--ville_more"
          style={{ top: "80%", left: "2%" }}
          onClick={() => handleClick("plusVille")}
        >
          mais plus<br />VILLE
        </button>

        <button
          className="btn btn--activite_more"
          style={{ top: "80%", right: "2%" }}
          onClick={() => handleClick("plusActivite")}
        >
          mais plus<br />ACTIVITÉS
        </button>

<button
  type="button"
  className="app-btn back"
  style={{
    position: "absolute",
    top: "90%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    width: "110px",
    minHeight: "52px",
    fontSize: "16px",
  }}
  onClick={onBack}
>
  BACK
</button>
      </div>
    </div>
  );
}

export default VilleVsActivite;