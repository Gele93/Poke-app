import MyPokemons from "./MyPokemons"
import Battle from "./Battle"
import Locations from "./Locations"
import { useState } from "react"

function Main({ setIsSound, isSound, battleAudio, setBattleAudio, idleAudio, setIdleAudio, playerPokemons, setPlayerPokemons, setIsMenu }) {

    const [isBattle, setIsBattle] = useState(false)
    const [nar, setNar] = useState()
    const [isPlayerChoosen, setIsPlayerChoosen] = useState(false)
    const [choosenPokemon, setChoosenPokemon] = useState({})
    const [activePanel, setActivePanel] = useState("")
    const [locations, setLocations] = useState([]);
    const [isGameWon, setIsGameWon] = useState(false)
    const [specialCd, setSpecialCd] = useState(0)
    const [isSpecialDisabled, setIsSpecialDisabled] = useState(false)
    const [currentLocation, setCurrentLocation] = useState("")
    const [defenseDuration, setDefenseDuration] = useState(0)
    const [boostDuration, setBoostDuration] = useState(0)
    const [isMendDisabled, setIsMendDisabled] = useState(false)
    const [mendCd, setMendCd] = useState(0)
    const [isCombatModalOpen, setIsCombatModalOpen] = useState(false)
    const [combatLog, setCombatLog] = useState([])
    const [enemy, setEnemy] = useState()
    const [isPokedexModalOpen, setIsPokedexModalOpen] = useState(false)
    const [shopOrMedic, setShopOrMedic] = useState(0)
    const [possibleEncounters, setPossibleEncounters] = useState([])
    const [balls, setBalls] = useState([1,1,1,1,1])

    function capitalize(string) {
        let arr = string.split("-")
        arr = arr.map(a => a.charAt(0).toUpperCase() + a.slice(1))
        return arr.join("-");
    }

    const toggleCombatModal = () => {
        setIsCombatModalOpen(!isCombatModalOpen)
    }

    const handleMuteClick = () => {
        idleAudio.pause()
        battleAudio.pause()
        setIsSound(false)
    }
    const hadnleSoundClick = () => {
        if (isBattle) {
            battleAudio.play()
        } else {
            idleAudio.play()
        }
        setIsSound(true)

    }

    return (
        <div className='main'>
            <div className='main-background-container'>
                <img className="main-background" src="https://images-ext-1.discordapp.net/external/iSbMZhkLarMLz8uqBtoEVYXThcrkyUHCGjMo1bMoHzU/https/i.pinimg.com/originals/2b/3b/04/2b3b04771ccca26c3dd96d781b0117ca.jpg?format=webp&width=1177&height=662" />
                <img className="main-logo" src="mainlogo.png" />
            </div>
            <div className="panel-container">
                <MyPokemons
                    balls={balls}
                    isPokedexModalOpen={isPokedexModalOpen}
                    setIsPokedexModalOpen={setIsPokedexModalOpen}
                    enemy={enemy}
                    setMendCd={setMendCd}
                    setIsMendDisabled={setIsMendDisabled}
                    setIsSpecialDisabled={setIsSpecialDisabled}
                    setSpecialCd={setSpecialCd}
                    specialCd={specialCd}
                    isBattle={isBattle}
                    setIsBattle={setIsBattle}
                    setIsPlayerChoosen={setIsPlayerChoosen}
                    isPlayerChoosen={isPlayerChoosen}
                    choosenPokemon={choosenPokemon}
                    setChoosenPokemon={setChoosenPokemon}
                    playerPokemons={playerPokemons}
                    setPlayerPokemons={setPlayerPokemons}
                    nar={nar}
                    setNar={setNar}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    defenseDuration={defenseDuration}
                    setDefenseDuration={setDefenseDuration}
                    boostDuration={boostDuration}
                    setBoostDuration={setBoostDuration} />
                <Battle
                    balls={balls}
                    setBalls={setBalls}
                    possibleEncounters={possibleEncounters}
                    setShopOrMedic={setShopOrMedic}
                    shopOrMedic={shopOrMedic}
                    isSound={isSound}
                    setBattleAudio={setBattleAudio}
                    setIdleAudio={setIdleAudio}
                    idleAudio={idleAudio}
                    battleAudio={battleAudio}
                    isPokedexModalOpen={isPokedexModalOpen}
                    setIsPokedexModalOpen={setIsPokedexModalOpen}
                    enemy={enemy}
                    setEnemy={setEnemy}
                    combatLog={combatLog}
                    setCombatLog={setCombatLog}
                    setIsCombatModalOpen={setIsCombatModalOpen}
                    isCombatModalOpen={isCombatModalOpen}
                    mendCd={mendCd}
                    isMendDisabled={isMendDisabled}
                    setMendCd={setMendCd}
                    setIsMendDisabled={setIsMendDisabled}
                    currentLocation={currentLocation}
                    setIsSpecialDisabled={setIsSpecialDisabled}
                    isSpecialDisabled={isSpecialDisabled}
                    setSpecialCd={setSpecialCd}
                    specialCd={specialCd}
                    isGameWon={isGameWon}
                    setIsGameWon={setIsGameWon}
                    locations={locations}
                    setLocations={setLocations}
                    playerPokemons={playerPokemons}
                    setPlayerPokemons={setPlayerPokemons}
                    choosenPokemon={choosenPokemon}
                    setChoosenPokemon={setChoosenPokemon}
                    capitalize={capitalize}
                    isPlayerChoosen={isPlayerChoosen}
                    setIsPlayerChoosen={setIsPlayerChoosen}
                    isBattle={isBattle}
                    setIsBattle={setIsBattle}
                    nar={nar}
                    setNar={setNar}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    setIsMenu={setIsMenu}
                    defenseDuration={defenseDuration}
                    setDefenseDuration={setDefenseDuration}
                    boostDuration={boostDuration}
                    setBoostDuration={setBoostDuration}
                    setPossibleEncounters={setPossibleEncounters}
                    setCurrentLocation={setCurrentLocation}

                />
                <Locations
                    setPossibleEncounters={setPossibleEncounters}
                    setShopOrMedic={setShopOrMedic}
                    combatLog={combatLog}
                    setCombatLog={setCombatLog}
                    setCurrentLocation={setCurrentLocation}
                    isGameWon={isGameWon}
                    setIsGameWon={setIsGameWon}
                    locations={locations}
                    setLocations={setLocations}
                    capitalize={capitalize}
                    isBattle={isBattle}
                    setIsBattle={setIsBattle}
                    nar={nar}
                    setNar={setNar}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel} />
            </div>
            <div className="nar-container">
                <p className="nar">{nar}</p>
                <img onClick={toggleCombatModal} className='combat-modal-opener' src='pokedex.gif' />
            </div>
            {isSound ? (
                <div onClick={handleMuteClick} className="sound-icon">🔊</div>
            ) : (
                <div onClick={hadnleSoundClick} className="sound-icon">🔇</div>
            )}        </div>
    )
}

export default Main