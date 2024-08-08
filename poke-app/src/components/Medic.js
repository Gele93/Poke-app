import React, { useEffect } from 'react'
import { useState } from 'react'

function Medic({ setShopOrMedic, gold, setGold, playerPokemons, setPlayerPokemons }) {

    const [medicNar, setMedicNar] = useState("")
    const [medicIndex, setMedicIndex] = useState(0)
    const [isHealModal, setIsHealModal] = useState(false)
    const [isRevieveModal, setIsRevieveModal] = useState(false)
    const [calculatedHealPrice, setCalculatedHealPrice] = useState("")
    const [isHealFloat, setIsHealFloat] = useState(false)
    const [healFloat, setHealFloat] = useState("")

    setGold(2000)


    const drawPlayerHpBarSide = (currentHp, maxHp, pokeName) => {
        let greenPercent = (currentHp / maxHp) * 100
        if (greenPercent < 0) greenPercent = 0
        const redPercent = 100 - greenPercent
        document.querySelector(`#${pokeName}hp-left`).style.width = `${greenPercent}%`
        document.querySelector(`#${pokeName}hp-damage`).style.width = `${redPercent}%`
    }
    const drawPlayerHpBarMedic = (currentHp, maxHp, nr) => {
        let greenPercent = (currentHp / maxHp) * 100
        if (greenPercent < 0) greenPercent = 0
        const redPercent = 100 - greenPercent
        document.querySelector(`.medic-hp-left-${nr}`).style.width = `${greenPercent}%`
        document.querySelector(`.medic-hp-damage-${nr}`).style.width = `${redPercent}%`
    }

    const getPokemon1 = (attribute) => {
        if (medicIndex === 0) {
            return playerPokemons[playerPokemons.length - 1][attribute]
        } else {
            return playerPokemons[medicIndex - 1][attribute]
        }
    }
    const getPokemon2 = (attribute) => {
        if (medicIndex === playerPokemons.length - 1) {
            return playerPokemons[0][attribute]
        } else {
            return playerPokemons[medicIndex + 1][attribute]
        }
    }

    useEffect(() => {

        drawPlayerHpBarMedic(getPokemon1("remainingHp"), getPokemon1("hp"), "1")
        drawPlayerHpBarMedic(playerPokemons[medicIndex].remainingHp, playerPokemons[medicIndex].hp, "2")
        drawPlayerHpBarMedic(getPokemon2("remainingHp"), getPokemon2("hp"), "3")


    }, [medicIndex])

    useEffect(() => {
        const { name, hp, remainingHp, dead } = playerPokemons[medicIndex]
        const toHeal = hp - remainingHp
        let nar = ""
        if (dead) {
            nar = `
            Revieve ${name} for ${Math.round(hp / 2)} gold (Revieves with 1 hp).
            `
        } else {
            if (toHeal > 0) {
                nar = `
                Heal ${name}: ${toHeal} hp for ${toHeal * 2} gold.
                `
            } else {
                nar = `
                ${name} is on full health!
                `
            }
        }
        setMedicNar(nar)
    }, [medicIndex])

    const handleNextClick = () => {
        if (medicIndex === playerPokemons.length - 1) {
            const newMedicIndex = 0
            setMedicIndex(newMedicIndex)
        } else {
            const newMedicIndex = medicIndex + 1
            setMedicIndex(newMedicIndex)
        }
    }

    const handlePrevClick = () => {
        if (medicIndex === 0) {
            const newMedicIndex = playerPokemons.length - 1
            setMedicIndex(newMedicIndex)
        } else {
            const newMedicIndex = medicIndex - 1
            setMedicIndex(newMedicIndex)
        }
    }

    const handleHealClick = () => {
        const toHeal = playerPokemons[medicIndex].hp - playerPokemons[medicIndex].remainingHp
        const cost = toHeal * 2
        let hpForMoney = ""

        if (cost <= gold) {
            hpForMoney = `
            ${toHeal} ❤️ for ${cost} 🪙
            `
        } else {
            hpForMoney = `
            ${gold % 2 === 0 ? gold / 2 : (gold - 1) / 2} ❤️ for ${gold % 2 === 0 ? gold : gold - 1} 🪙
            `
        }

        setCalculatedHealPrice(hpForMoney)
        setIsHealModal(true)
    }

    const handleBackClick = () => {
        /*
        let test = [...playerPokemons]
        test[medicIndex].remainingHp = 1
        setPlayerPokemons(test)
        */
        setIsHealModal(false)
    }

    const handleConfirmHealClick = () => {
        const toHeal = playerPokemons[medicIndex].hp - playerPokemons[medicIndex].remainingHp
        const cost = toHeal * 2
        let healAmount = 0
        let updatedGold = 0
        let updatedPlayerPokemons = []

        if (cost <= gold) {
            healAmount = toHeal
            updatedPlayerPokemons = [...playerPokemons]
            updatedPlayerPokemons[medicIndex].remainingHp += healAmount
            updatedGold = gold - cost
        } else {
            updatedPlayerPokemons = [...playerPokemons]
            if (gold % 2 === 0) {
                healAmount = gold / 2
            } else {
                healAmount = (gold - 1) / 2
            }
            updatedPlayerPokemons[medicIndex].remainingHp += healAmount
            updatedGold = gold - (healAmount * 2)
        }


        drawPlayerHpBarSide(playerPokemons[medicIndex].remainingHp, playerPokemons[medicIndex].hp, playerPokemons[medicIndex].name)
        drawPlayerHpBarMedic(playerPokemons[medicIndex].remainingHp, playerPokemons[medicIndex].hp, "2")
        setGold(updatedGold)
        setPlayerPokemons(updatedPlayerPokemons)
        setIsHealFloat(true)
        setHealFloat(healAmount)
        setTimeout(() => {
            setIsHealFloat(false)
        }, 3000)
        setIsHealModal(false)
    }


    const handleRevieveClick = () => {
        setIsRevieveModal(true)
    }
    const handleConfirmRevieveClick = () => {
        let updatedPlayerPokemons = [...playerPokemons]
        updatedPlayerPokemons[medicIndex].dead = false
        updatedPlayerPokemons[medicIndex].remainingHp = 1
        let cost = Math.round(updatedPlayerPokemons[medicIndex].hp / 2)
        let updatedGold = gold - cost
        setGold(updatedGold)
        drawPlayerHpBarSide(playerPokemons[medicIndex].remainingHp, playerPokemons[medicIndex].hp, playerPokemons[medicIndex].name)
        drawPlayerHpBarMedic(playerPokemons[medicIndex].remainingHp, playerPokemons[medicIndex].hp, "2")
        setPlayerPokemons(updatedPlayerPokemons)
        setIsRevieveModal(false)
    }

    const handleBackToMenuClick = () => {
        setShopOrMedic(0)
    }
    return (
        <div className='medic'>
            <img className='joy' src='/joy.png' alt='joy' />
            <div className='medic-nar'>{medicNar}</div>
            <div className='medic-desk'></div>
            <div className='shop-title'>Poke Center</div>
            <div className='medic-poke-cont-1'>
                <img className={`${getPokemon1("dead") ? "dead" : null} medic-poke-img`} src={getPokemon1("picFront")} />
                <div className="medic-hp">
                    <div className="medic-hp-percent">{getPokemon1("remainingHp")}/{getPokemon1("hp")}</div>
                    <div className="medic-hp-left-1"></div>
                    <div className="medic-hp-damage-1"></div>
                </div>
            </div>
            <div className='medic-poke-cont-2'>
                <img className={`${playerPokemons[medicIndex].dead ? "dead" : null} medic-poke-img`} src={playerPokemons[medicIndex].picFront} />
                {isHealFloat ? (
                    <div className="medic-float-heal">{healFloat}</div>
                ) : (null)}
                <div className="medic-hp">
                    <div className="medic-hp-percent">{playerPokemons[medicIndex].remainingHp}/{playerPokemons[medicIndex].hp}</div>
                    <div className="medic-hp-left-2"></div>
                    <div className="medic-hp-damage-2"></div>
                </div>
            </div>
            <div className='medic-poke-cont-3'>
                <img className={`${getPokemon2("dead") ? "dead" : null} medic-poke-img`} src={getPokemon2("picFront")} />
                <div className="medic-hp">
                    <div className="medic-hp-percent">{getPokemon2("remainingHp")}/{getPokemon2("hp")}</div>
                    <div className="medic-hp-left-3"></div>
                    <div className="medic-hp-damage-3"></div>
                </div>
            </div>
            <div className='medic-buttons'>
                <button disabled={playerPokemons[medicIndex].remainingHp === 0} onClick={handleHealClick} className="medic-heal" type='button'>Heal</button>
                <button onClick={handleRevieveClick} disabled={!playerPokemons[medicIndex].dead} className="medic-revieve" type='button'>Revieve</button>
            </div>
            <div className='medic-move-buttons'>
                <button onClick={handlePrevClick} className="medic-next" type='button'>Previous</button>
                <button onClick={handleNextClick} className="medic-prev" type='button'>Next</button>
            </div>
            {isHealModal ? (
                <div className='heal-modal'>
                    {playerPokemons[medicIndex].remainingHp === playerPokemons[medicIndex].hp ? (
                        <>
                            <div className='heal-modal-title'>
                                {playerPokemons[medicIndex].name} is at full hp.
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='heal-modal-title'>
                                Do you want to heal {playerPokemons[medicIndex].name}?
                            </div>
                            <div>{calculatedHealPrice}</div>
                        </>
                    )}

                    <div className='heal-modal-button-container'>
                        <button onClick={handleBackClick} className='medic-back confirm-heal' type='button'>Back</button>
                        {playerPokemons[medicIndex].remainingHp !== playerPokemons[medicIndex].hp &&
                            <button onClick={handleConfirmHealClick} className='medic-heal confirm-heal' type='button'>Heal</button>
                        }
                    </div>
                </div>
            ) : (
                null
            )}
            {isRevieveModal ? (
                <div className='heal-modal'>

                    <div className='heal-modal-title'>
                        Do you want to revieve {playerPokemons[medicIndex].name}?
                    </div>
                    <div>{Math.round(playerPokemons[medicIndex].hp / 2)} 🪙</div>

                    <div className='heal-modal-button-container'>
                        <button onClick={handleBackClick} className='medic-back confirm-heal' type='button'>Back</button>
                        {Math.round(playerPokemons[medicIndex].hp / 2) < gold &&
                            <button disabled={Math.round(playerPokemons[medicIndex].hp / 2) > gold} onClick={handleConfirmRevieveClick} className='medic-heal confirm-heal' type='button'>Revieve</button>
                        }
                    </div>
                </div>
            ) : (
                null
            )}
            <button onClick={handleBackToMenuClick} className='back-from-shop' type='button'>Back</button>
        </div>
    )
}


export default Medic