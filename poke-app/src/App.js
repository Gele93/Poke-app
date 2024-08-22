import './App.css';
import { useState, useEffect } from "react"
import Menu from './components/Menu';
import Main from './components/Main';

//  "homepage": "https://gele93.github.io/Poke-app",


function App() {

  const [isMenu, setIsMenu] = useState(true)
  const [playerPokemons, setPlayerPokemons] = useState([])
  const [battleAudio, setBattleAudio] = useState(null);
  const [idleAudio, setIdleAudio] = useState(null);
  const [themeAudio, setThemeAudio] = useState(null);
  const [isSound, setIsSound] = useState(false)

  //idle + battle zene


  /*
isMenu 
isBattle  -> location kiválasztva
isPlayerChoosen -> player pokemon választva
currentPlayerHp
currentEnemy {name, hp, ...} -> useEffect (enemy attakc setTimeout)
playerPokemons []
locations [
{name:
visited: false}
]
currentPlayerHp, currentEnemy.Hp -> useEffect(ha egyik 1 alá if(nyertünk vesztettünk) )
isBattleWon -> useEffect(flase -> ujraválaszttani (isPlayerChoosen) true-> location választás isBattle:false mypokemonshoz currentEnemy )

*/

  /*
  <audio id="audio" loop autoplay> 
    <source src="%PUBLIC_URL%/themesong.mp3" type="audio/mpeg">
  </audio> 
  const audio: Partial<HTMLAudioElement> = document.getElementById('audio')
  
  audio.pause()
  */



  return (
    <>
      {isMenu ? (
        <Menu
          themeAudio={themeAudio}
          setThemeAudio={setThemeAudio}
          setIsSound={setIsSound}
          isSound={isSound}
          idleAudio={idleAudio}
          battleAudio={battleAudio}
          setIsMenu={setIsMenu}
          playerPokemons={playerPokemons}
          setPlayerPokemons={setPlayerPokemons} />
      ) : (
        <Main
          setIsSound={setIsSound}
          isSound={isSound}
          setBattleAudio={setBattleAudio}
          setIdleAudio={setIdleAudio}
          idleAudio={idleAudio}
          battleAudio={battleAudio}
          setIsMenu={setIsMenu}
          playerPokemons={playerPokemons}
          setPlayerPokemons={setPlayerPokemons}
        />

      )}
    </>
  );
}

export default App;
