import { useState } from "react"
import StartScreen from "./components/StartScreen"
import AdventureVsFarniente from "./components/AdventureVsFarniente"

function App() {
  const [step, setStep] = useState("start")
  const [profile, setProfile] = useState({
    aventure: 0,
    farniente: 0
  })

  const handleStart = () => {
    setProfile({ aventure: 0, farniente: 0 })
    setStep("adventure")
  }

  const handleAnswer = (effects) => {
    setProfile(prev => ({
      aventure: prev.aventure + (effects.aventure || 0),
      farniente: prev.farniente + (effects.farniente || 0)
    }))

    console.log("Profil actuel :", profile)
    // prochaine étape plus tard
  }

  return (
    <>
      {step === "start" && <StartScreen onStart={handleStart} />}
      {step === "adventure" && (
        <AdventureVsFarniente onAnswer={handleAnswer} />
      )}
    </>
  )
}

export default App