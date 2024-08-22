import { useEffect } from "react"

function MyPokemons({ balls, isPokedexModalOpen, setIsPokedexModalOpen, enemy, setBoostDuration, setIsMendDisabled, setMendCd, setDefenseDuration, setIsSpecialDisabled, setSpecialCd, playerPokemons, setPlayerPokemons, isBattle, isPlayerChoosen, setIsPlayerChoosen, setChoosenPokemon, setNar, activePanel, setActivePanel }) {

    const drawPlayerHpBarSide = (currentHp, maxHp, pokeName) => {
        let greenPercent = (currentHp / maxHp) * 100
        if (greenPercent < 0) greenPercent = 0
        const redPercent = 100 - greenPercent
        document.querySelector(`#${pokeName}hp-left`).style.width = `${greenPercent}%`
        document.querySelector(`#${pokeName}hp-damage`).style.width = `${redPercent}%`
    }

    useEffect(() => {
        if (!isPlayerChoosen) {

            let updatedPlayerPokemons = [...playerPokemons]
            updatedPlayerPokemons = updatedPlayerPokemons.map(p => {
                if (p.remainingHp !== 0) {
                    p.remainingHp += Math.round(p.hp * 0.1)
                }
                if (p.remainingHp > p.hp) {
                    p.remainingHp = p.hp
                }
                return { ...p }
            })

            updatedPlayerPokemons.map(p => {
                drawPlayerHpBarSide(p.remainingHp, p.hp, p.name)
            })

            setPlayerPokemons(updatedPlayerPokemons)

        }
    }, [isPlayerChoosen])

    const typeToColor = {
        normal: `rgba(168, 168, 120, 0.5)`,
        fighting: ` rgba(192, 48, 40, 0.5)`,
        flying: `rgba(168, 144, 240, 0.5)`,
        poison: `rgba(160, 64, 160, 0.5)`,
        ground: `rgba(224, 192, 104, 0.5)`,
        rock: `rgba(184, 160, 56, 0.5)`,
        bug: `rgba(168, 184, 32, 0.5)`,
        ghost: `rgba(112, 88, 152, 0.5)`,
        steel: `rgba(184, 184, 208, 0.5)`,
        fire: `rgba(255, 40, 0, 0.5)`,
        water: `rgba(0, 40, 255, 0.5)`,
        grass: `rgba(120, 200, 80, 0.5)`,
        electric: `rgba(248, 208, 48, 0.5)`,
        psychic: `rgba(248, 88, 136, 0.5)`,
        ice: `rgba(152, 216, 216, 0.5)`,
        dragon: `rgba(112, 56, 248, 0.5)`,
        dark: `rgba(112, 88, 72, 0.5)`,
        fairy: `rgba(238, 153, 172, 0.5)`
    }

    const handleMyPokemonClick = (e) => {
        if (isBattle && !isPlayerChoosen) {
            let updatedPlayerPokemons = [...playerPokemons]
            updatedPlayerPokemons = updatedPlayerPokemons.map(p => {
                p.choosen = false
                return p
            })
            const choosenName = e.target.getAttribute("pokename")
            updatedPlayerPokemons.find(p => p.name === choosenName).choosen = true
            const choosenPoke = playerPokemons.find(p => p.name === choosenName)

            if (choosenPoke.dead) return

            document.querySelector(".battle-container").style.backgroundImage = `linear-gradient(45deg, ${typeToColor[choosenPoke.type]} 0%, rgba(255, 255, 255, 0.5) 50%, ${typeToColor[enemy.type]} 100%)`

            setIsMendDisabled(false)
            setMendCd(0)
            setSpecialCd(0)
            setDefenseDuration(0)
            setBoostDuration(0)
            setIsSpecialDisabled(false)
            setActivePanel("battle")
            setNar(`${choosenName}, has been chosen. Attack the enemy!`)
            setPlayerPokemons(updatedPlayerPokemons)
            setChoosenPokemon(choosenPoke)
            setIsPlayerChoosen(true)
        }
    }

    return (
        <div className={`${activePanel === "mypokemons" ? "active" : null} player-poke-container`}>
            <h1 className="player-poke-title">My pokemons</h1>
            <div className="player-poke-list">
                {balls.map((b, i) => (
                    playerPokemons[i] ? (
                        <div key={playerPokemons[i].name} className="player-poke-wraper">
                            <h2 className="player-poke-name">{playerPokemons[i].name}</h2>
                            <img pokename={playerPokemons[i].name} onClick={(e) => handleMyPokemonClick(e)} className={`${playerPokemons[i].dead ? "dead" : null} player-poke-img`} src={playerPokemons[i].picFront} />
                            <div id={`${playerPokemons[i].name}hp`} className="hp-side">
                                <div id={`${playerPokemons[i].name}hp-left`} className="hp-left-side"></div>
                                <div id={`${playerPokemons[i].name}hp-damage`} className="hp-damage-side"></div>
                            </div>
                        </div>
                    ) : (
                        <div key={i}>
                            <img src='pokeball.png' className="pokeball" />
                        </div>
                    )
                ))}
            </div>
            <img onClick={() => setIsPokedexModalOpen(!isPokedexModalOpen)} className="pokekodex" src="pokedex.gif" />
        </div>
    )
}

export default MyPokemons

