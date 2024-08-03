import ChooseStarter from "./ChooseStarter"
import { useEffect } from "react";

function Menu({ themeAudio, setThemeAudio, setIsSound, isSound, battleAudio, idleAudio, setIsMenu, playerPokemons, setPlayerPokemons }) {

    useEffect(() => {
        const theme = new Audio('./theme.mp3');
        theme.loop = true;
        theme.volume = 0.05
        setThemeAudio(theme);
    }, []);


    const handleMuteClick = () => {
        themeAudio.pause()
        setIsSound(false)
    }

    const handleSoundClick = () => {
        themeAudio.play()
        setIsSound(true)
    }

    const handleStartClick = () => {
        setIsMenu(false)
        themeAudio.pause()
    }


    return (
        <div className="menu">
            <div className='background-container'>
                <img className="background" src="./menubg.jpg" />
                <img className="logo" src="./menulogo.png" />
            </div>
            <div className='description-container'>
                <img className="oak-prof" src="./oakprof.png" />
                <ul className='description'>
                    <li className="description-li">Choose 3 starting pokemon & press Start!</li>
                    <li className="description-li">Select a location to travel</li>
                    <li className="description-li">Defeat the enemy if you find one</li>
                    <li className="description-li">Catch them all!</li>
                </ul>
            </div>
            <div className='start-container'>
                {playerPokemons.length === 3 ? (
                    <button onClick={handleStartClick} className="start-button" type='button'>Start Game!</button>
                ) : (
                    null
                )}
            </div>
            <ChooseStarter playerPokemons={playerPokemons} setPlayerPokemons={setPlayerPokemons} />
            {isSound ? (
                <div onClick={handleMuteClick} className="sound-icon">🔊</div>
            ) : (
                <div onClick={handleSoundClick} className="sound-icon">🔇</div>
            )}

        </div>
    )
}

export default Menu