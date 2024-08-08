import React, { useEffect, useState } from 'react'
import Abilitymodal from './Abilitymodal'
import Combatmodal from './Combatmodal'
import Pokedexmodal from './Pokedexmodal'
import Enemydexmodal from './Enemydex'
import Shop from "./Shop"
import Medic from './Medic'

function Battle({ shopOrMedic, setShopOrMedic, isSound, battleAudio, setBattleAudio, idleAudio, setIdleAudio, setIsPokedexModalOpen, isPokedexModalOpen, enemy, setEnemy, setCombatLog, combatLog, isCombatModalOpen, setIsCombatModalOpen, boostDuration, setBoostDuration, isMendDisabled, setIsMendDisabled, mendCd, setMendCd, defenseDuration, setDefenseDuration, capitalize, currentLocation, isSpecialDisabled, setIsSpecialDisabled, specialCd, setSpecialCd, isGameWon, setIsGameWon, locations, setLocations, setIsMenu, isBattle, setIsBattle, isPlayerChoosen, setIsPlayerChoosen, nar, setNar, choosenPokemon, setChoosenPokemon, activePanel, setActivePanel, playerPokemons, setPlayerPokemons }) {

    const [enemyDmg, setEnemyDmg] = useState(0)
    const [enemyCurHp, setEnemyCurHp] = useState(0)
    const [playerDmg, setPlayerDmg] = useState(0)
    const [playerCurHp, setPlayerCurHp] = useState(0)
    const [isAttackDisabled, setIsAttackDisabled] = useState(false)
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [isGameOver, setIsGameOver] = useState(false)
    const [defendModif, setDefendModif] = useState(0)
    const [boostModif, setBoostModif] = useState(0)
    const [hpPotAmount, setHpPotAmount] = useState(0)
    const [boostPotAmount, setBoostPotAmount] = useState(0)
    const [isAbilityModalOpen, setIsAbilityModalOpen] = useState(false)
    const [isEnemydexModalOpen, setIsEnemydexModalOpen] = useState(false)
    const [enemyFloatText, setEnemyFloatText] = useState()
    const [isEnemyfloatText, setIsEnemyFloatText] = useState(false)
    const [playerFloatText, setPlayerFloatText] = useState()
    const [isPlayerfloatText, setIsPlayerFloatText] = useState(false)
    const [isFloatDmg, setIsFloatDmg] = useState(true)
    const [gold, setGold] = useState(0)
    const [isFirstFightDone, setIsFirstFightDone] = useState(false)
    const [isMiss, setIsMiss] = useState(false)

    useEffect(() => {
        const idle = new Audio('./idle.mp3');
        const battle = new Audio('./battle.mp3');

        idle.loop = true;
        battle.loop = true;
        idle.volume = 0.05
        battle.volume = 0.05

        setIdleAudio(idle);
        setBattleAudio(battle);

    }, []);

    useEffect(() => {
        if (battleAudio) {
            if (isBattle && isSound) {
                idleAudio.pause();
                battleAudio.currentTime = 0;
                battleAudio.play();
            } else if (isSound) {
                battleAudio.pause();
                idleAudio.currentTime = 0;
                idleAudio.play()
            }
        }
    }, [isBattle, idleAudio, battleAudio]);



    const updateCombatLog = (poke, logText) => {
        let updatedCombatLog = [...combatLog]
        const log = {
            pokemon: poke,
            text: logText
        }
        updatedCombatLog.push(log)
        setCombatLog(updatedCombatLog)
    }

    const drawPlayerHpBar = (currentHp) => {
        let greenPercent = (currentHp / choosenPokemon.hp) * 100
        if (greenPercent < 0) greenPercent = 0
        const redPercent = 100 - greenPercent
        document.querySelector(".hp-left").style.width = `${greenPercent}%`
        document.querySelector(".hp-damage").style.width = `${redPercent}%`
    }

    useEffect(() => {
        if (choosenPokemon && isPlayerChoosen) {
            //   setPlayerCurHp(choosenPokemon.hp) #START FROM MAX HP
            setPlayerCurHp(choosenPokemon.remainingHp)
            drawPlayerHpBar(choosenPokemon.remainingHp)
        }
    }, [isPlayerChoosen])

    useEffect(() => {
        if (isBattle) {
            const enemyAppear = async () => {
                const fetchData = async (url) => {
                    try {
                        const response = await fetch(url)
                        if (!response.ok) {
                            throw new Error("Fetching run into error")
                        }
                        const data = await response.json()
                        return data

                    } catch (error) {
                        console.error(error)
                    }
                }
                const fetchRandomPokemon = async (number) => {
                    try {
                        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
                        const data = await response.json();
                        let pokeData = {
                            name: data.species.name,
                            picFront: data.sprites.front_default,
                            picBack: data.sprites.back_default,
                            hp: data.stats[0].base_stat,
                            remainingHp: data.stats[0].base_stat,
                            attack: data.stats[1].base_stat,
                            defense: data.stats[2].base_stat,
                            special: data.stats[3].base_stat,
                            type: data.types[0].type.name,
                            typeUrl: data.types[0].type.url
                        }

                        const damageRelations = await fetchData(pokeData.typeUrl)
                        pokeData = {
                            ...pokeData,
                            dmgRel: damageRelations["damage_relations"]
                        }

                        setEnemy(pokeData);
                        setEnemyCurHp(pokeData.hp)
                        setNar(`A wild ${pokeData.name} appeared!
                            Choose your pokemon!`)
                    } catch (error) {
                        console.error('Error fetching Pokémon:', error);
                    };
                }

                const randomNumber = Math.ceil(Math.random() * 1025)
                await fetchRandomPokemon(randomNumber)

            }
            enemyAppear()
        }
    }, [isBattle])


    const applyDmgModifier = (normalDmg, targetType, attackerDmgRel) => {

        let updatedDmg = normalDmg
        const dblDmgTo = []
        const halfDmgTo = []

        attackerDmgRel["double_damage_to"].map(r => {
            dblDmgTo.push(r.name)
        })
        attackerDmgRel["half_damage_to"].map(r => {
            halfDmgTo.push(r.name)
        })

        if (dblDmgTo.includes(targetType)) {
            updatedDmg = normalDmg * 2
        }
        if (halfDmgTo.includes(targetType)) {
            updatedDmg = normalDmg / 2
        }

        updatedDmg = Math.round(updatedDmg)

        return updatedDmg
    }



    useEffect(() => {
        if (enemy && !isPlayerTurn) {

            let enemyCalculatedDmg = enemyDmg
            let updatedBoostDuration

            if (boostDuration > 0) {
                updatedBoostDuration = boostDuration - 1
            }

            /*
                        if (boostDuration > 0) {
                            enemyCalculatedDmg = Math.round(enemyCalculatedDmg * boostModif)
                            updatedBoostDuration = boostDuration - 1
                        }
            */
            //   enemyCalculatedDmg = applyDmgModifier(enemyCalculatedDmg, enemy.type, choosenPokemon.dmgRel)

            const updatedCurHp = enemyCurHp - enemyCalculatedDmg

            //3 => max defenseduration 
            if (defenseDuration === 3) {
                setEnemyFloatText("")
            } else if (enemyCalculatedDmg > 0) {
                setEnemyFloatText(enemyCalculatedDmg)
            } else if (isMiss) {
                setEnemyFloatText("Miss")
                setIsMiss(false)
            }

            setIsEnemyFloatText(true)
            setTimeout(() => {
                setIsEnemyFloatText(false)
            }, 2000)



            if (updatedCurHp <= 0) {
                if (locations.filter(l => l.visited).length === locations.length) {
                    setIsGameWon(true)
                }
            }

            let greenPercent = (updatedCurHp / enemy.hp) * 100
            if (greenPercent < 0) greenPercent = 0
            const redPercent = 100 - greenPercent
            document.querySelector(".enemy-hp-left").style.width = `${greenPercent}%`
            document.querySelector(".enemy-hp-damage").style.width = `${redPercent}%`

            const { hp, attack, special } = enemy

            let defense = choosenPokemon.defense
            let updatedDuration
            if (defenseDuration > 0) {
                defense += defendModif
                updatedDuration = defenseDuration - 1
            }

            const Z = 217 + Math.floor(Math.random() * 38)
            let dmg = 0
            let nar = ""
            const hitChance = Math.ceil(Math.random() * 100)

            if (hitChance > 80) {
                dmg = ((((2 / 5 + 2) * attack * 60 / defense) / 50) + 2) * Z / 255
                dmg = dmg * 2
                dmg = Math.round(dmg)
                dmg = applyDmgModifier(dmg, choosenPokemon.type, enemy.dmgRel)

                nar = `Critical hit! ${dmg} dmg`
            } else if (hitChance < 20) {
                dmg = 0
                nar = "Miss!"
            } else {
                dmg = ((((2 / 5 + 2) * attack * 60 / defense) / 50) + 2) * Z / 255
                dmg = Math.round(dmg)
                dmg = applyDmgModifier(dmg, choosenPokemon.type, enemy.dmgRel)
                nar = `Normal hit ${dmg} dmg`
            }

            setEnemyCurHp(updatedCurHp)

            let goldDrop = 0
            let updatedBoostPotAmount = boostPotAmount
            let updatedHpPotAmount = hpPotAmount
            if (updatedCurHp <= 0) {
                nar = `${enemy.name} has been defeated`

                const hpDropChance = Math.floor(Math.random() * 100)
                const boostDropChance = Math.floor(Math.random() * 100)
                goldDrop = Math.round(enemy.hp / 10)

                nar += ` You gained ${goldDrop} gold!`

                if (hpDropChance < 30) {
                    updatedHpPotAmount++
                    nar += " You gained 1 Health Potion!"
                }
                if (boostDropChance < 100) {
                    updatedBoostPotAmount++
                    nar += " You gained 1 Boost Potion!"
                }

                if (playerCurHp > 0) {
                    let updatedPlayerPokemons = [...playerPokemons]
                    updatedPlayerPokemons = updatedPlayerPokemons.map(p => {
                        if (p.name === choosenPokemon.name) {
                            p.remainingHp = playerCurHp
                            return { ...p, }
                        } else {
                            return { ...p }
                        }
                    })
                    setPlayerPokemons(updatedPlayerPokemons)

                }
            }

            if (specialCd > 0) {
                const updatedSpecialCd = specialCd - 1
                setSpecialCd(updatedSpecialCd)
                if (updatedSpecialCd === 0) {
                    setIsSpecialDisabled(false)
                }
            }
            if (mendCd > 0) {
                const updatedMendCd = mendCd - 1
                setMendCd(updatedMendCd)
                if (updatedMendCd === 0) {
                    setIsMendDisabled(false)
                }
            }

            setTimeout(() => {
                if (updatedCurHp > 0) {
                    setPlayerDmg(dmg)
                }
                setGold(prev => prev + goldDrop)
                setIsFirstFightDone(true)
                updateCombatLog(enemy.name, nar)
                setIsPlayerTurn(true)
                setHpPotAmount(updatedHpPotAmount)
                setBoostPotAmount(updatedBoostPotAmount)
                setDefenseDuration(updatedDuration)
                setBoostDuration(updatedBoostDuration)
                setNar(nar)
                setIsAttackDisabled(false)
            }, 1500)
        }
    }, [isPlayerTurn])

    useEffect(() => {
        if (isPlayerChoosen && isPlayerTurn && (enemyCurHp > 0)) {

            let curPlayerDmg = playerDmg

            //   curPlayerDmg = applyDmgModifier(curPlayerDmg, choosenPokemon.type, enemy.dmgRel)

            const updatedCurHp = playerCurHp - curPlayerDmg

            setIsFloatDmg(true)
            if (curPlayerDmg > 0) {
                setPlayerFloatText(curPlayerDmg)
            } else if (curPlayerDmg === 0) {
                setPlayerFloatText("Miss")
            }
            setIsPlayerFloatText(true)
            setTimeout(() => {
                setIsPlayerFloatText(false)
            }, 2000)

            drawPlayerHpBar(updatedCurHp)

            setPlayerCurHp(updatedCurHp)
        }

    }, [playerDmg, isPlayerTurn])


    const handleAttack = (e) => {
        const { hp, attack, defense, special } = choosenPokemon
        const Z = 217 + Math.floor(Math.random() * 38)
        let dmg = 0
        let nar = ""
        const hitChance = Math.ceil(Math.random() * 100)
        if (hitChance > 80) {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = dmg * 2
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Critical hit! ${dmg} dmg`
        } else if (hitChance < 20) {
            setIsMiss(true)
            dmg = 0
            nar = "Miss!"
        } else {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Normal hit ${dmg} dmg`
        }

        //        dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)

        setIsAttackDisabled(true)
        setIsPlayerTurn(false)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setEnemyDmg(dmg)
    }

    const handleHeavyAttack = () => {
        const { hp, attack, defense, special } = choosenPokemon
        const Z = 217 + Math.floor(Math.random() * 38)
        let dmg = 0
        let nar = ""
        const hitChance = Math.ceil(Math.random() * 100)
        if (hitChance > 60) {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = dmg * 2
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Critical hit! ${dmg} dmg`
        } else if (hitChance < 40) {
            setIsMiss(true)
            dmg = 0
            nar = "Miss!"
        } else {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Heavy hit ${dmg} dmg`
        }



        setIsAttackDisabled(true)
        setIsPlayerTurn(false)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setEnemyDmg(dmg)
    }

    const handlePrecisionAttack = () => {
        const { hp, attack, defense, special } = choosenPokemon
        const Z = 217 + Math.floor(Math.random() * 38)
        let dmg = 0
        let nar = ""
        const hitChance = Math.ceil(Math.random() * 100)
        if (hitChance > 95) {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = dmg * 2
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Critical hit! ${dmg} dmg`
        } else if (hitChance < 5) {
            setIsMiss(true)
            dmg = 0
            nar = "Miss!"
        } else {
            dmg = ((((2 / 5 + 2) * attack * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Precision hit ${dmg} dmg`
        }

        dmg = dmg * 10000

        setIsAttackDisabled(true)
        setIsPlayerTurn(false)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setEnemyDmg(dmg)
    }

    const handleSpecialAttack = () => {
        const { hp, attack, defense, special } = choosenPokemon
        const Z = 217 + Math.floor(Math.random() * 38)
        let dmg = 0
        let nar = ""
        const hitChance = Math.ceil(Math.random() * 100)
        if (hitChance > 80) {
            dmg = ((((2 / 5 + 2) * special * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = dmg * 2
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Critical hit! ${dmg} dmg`
        } else if (hitChance < 5) {
            setIsMiss(true)
            dmg = 0
            nar = "Miss!"
        } else {
            dmg = ((((2 / 5 + 2) * special * 60 / enemy.defense) / 50) + 2) * Z / 255
            dmg = Math.round(dmg)
            dmg = applyDmgModifier(dmg, enemy.type, choosenPokemon.dmgRel)
            if (boostDuration > 0) {
                dmg = Math.round(dmg * boostModif)
            }
            nar = `Special hit ${dmg} dmg`
        }

        dmg += 2

        setSpecialCd(3)
        setIsSpecialDisabled(true)
        setIsAttackDisabled(true)
        setIsPlayerTurn(false)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setEnemyDmg(dmg)
    }


    const handleDefend = () => {
        const defense = choosenPokemon.defense
        let defMod = defense * 2
        let dmg = 0

        nar = `${choosenPokemon.name}'s defense increased for 3 turns.`

        setDefendModif(defMod)
        setDefenseDuration(3)
        setIsAttackDisabled(true)
        setIsPlayerTurn(false)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setEnemyDmg(dmg)
    }

    const handleMend = () => {

        let updatedPlayerCurHp = playerCurHp
        const maxHp = choosenPokemon.hp
        const heal = Math.round(maxHp * 0.3)
        updatedPlayerCurHp += heal
        if (updatedPlayerCurHp > maxHp) updatedPlayerCurHp = maxHp
        let dmg = 0
        let nar = `${choosenPokemon.name} is healed for ${updatedPlayerCurHp - playerCurHp}.`
        const updatedCurHp = updatedPlayerCurHp

        drawPlayerHpBar(updatedCurHp)

        setEnemyDmg(dmg)
        setEnemyFloatText("")
        setIsFloatDmg(false)
        setPlayerFloatText(updatedPlayerCurHp - playerCurHp)
        setIsPlayerFloatText(true)
        setTimeout(() => {
            setIsPlayerFloatText(false)
        }, 2000)


        setTimeout(() => {
            setMendCd(5)
            setIsMendDisabled(true)
            setPlayerCurHp(updatedPlayerCurHp)
            setIsAttackDisabled(true)
            setIsPlayerTurn(false)
            setNar(nar)
            updateCombatLog(choosenPokemon.name, nar)
        }, 2000)
    }

    const handleHpPotion = () => {
        let updatedPlayerCurHp = playerCurHp
        const maxHp = choosenPokemon.hp
        const heal = 15
        updatedPlayerCurHp += heal
        if (updatedPlayerCurHp > maxHp) updatedPlayerCurHp = maxHp

        let nar = `${choosenPokemon.name} used a Health Potion: healed for ${updatedPlayerCurHp - playerCurHp}.`

        setIsFloatDmg(false)
        setPlayerFloatText(updatedPlayerCurHp - playerCurHp)
        setIsPlayerFloatText(true)
        setTimeout(() => {
            setIsPlayerFloatText(false)
        }, 2000)

        const updatedCurHp = updatedPlayerCurHp

        drawPlayerHpBar(updatedCurHp)

        let updatedHpPotAmount = hpPotAmount - 1

        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
        setHpPotAmount(updatedHpPotAmount)
        setPlayerCurHp(updatedCurHp)
    }

    const handleBoostPotion = () => {

        let nar = ""

        if (boostDuration > 0) {
            nar = "One Boost Potion is already active!"
            setNar(nar)
            return
        }

        let boostMod = 1.5

        nar = `${choosenPokemon.name}'s Attack damage increased for 3 turns.`

        let updatedBoostPotAmount = boostPotAmount - 1
        setBoostPotAmount(updatedBoostPotAmount)
        setBoostModif(boostMod)
        setBoostDuration(3)
        setNar(nar)
        updateCombatLog(choosenPokemon.name, nar)
    }



    useEffect(() => {
        if (isPlayerChoosen) {
            if (playerCurHp <= 0) {
                let updatedPlayerPokemons = [...playerPokemons]
                const chosenName = choosenPokemon.name
                updatedPlayerPokemons.find(p => p.name === chosenName).dead = true
                updatedPlayerPokemons.find(p => p.name === chosenName).remainingHp = 0

                if (updatedPlayerPokemons.filter(p => p.dead).length === updatedPlayerPokemons.length) {
                    setIsGameOver(true)
                } else {
                    setPlayerPokemons(updatedPlayerPokemons)
                    setNar(`${choosenPokemon.name} has fallen
                        Choose another pokemon!`)
                    updateCombatLog(choosenPokemon.name, `${choosenPokemon.name} has fallen`)
                    setIsPlayerChoosen(false)
                }
            }
        }
    }, [playerCurHp])


    const handleCatch = () => {
        document.querySelector(".battle-container").style.backgroundImage = ""
        let nar = ""
        const catchChance = Math.floor(Math.random() * 100)


        if (catchChance > 49) {
            nar = `You catched ${enemy.name}! You can use him in your next fights!
            Choose another location!`
            let updatedPlayerPokemons = [...playerPokemons]
            let catchedEnemy = {
                ...enemy,
                choosen: false,
                dead: false,
            }
            updatedPlayerPokemons.push(catchedEnemy)

            setPlayerPokemons(updatedPlayerPokemons)
            setIsPlayerChoosen(false)
            setIsBattle(false)
            setEnemy("")
            setNar(nar)
            updateCombatLog(choosenPokemon.name, `You catched ${enemy.name}!`)
            setActivePanel("location")

        } else {
            nar = `${enemy.name} has slipped away..
            Choose another location!`
            setIsPlayerChoosen(false)
            setIsBattle(false)
            setEnemy("")
            setNar(nar)
            updateCombatLog(choosenPokemon.name, `${enemy.name} has slipped away..`)
            setActivePanel("location")
        }

    }


    const handleLeave = () => {
        document.querySelector(".battle-container").style.backgroundImage = ""

        let nar = `You set ${enemy.name} free.
        Choose another location!`
        setNar(nar)
        updateCombatLog(choosenPokemon.name, `You set ${enemy.name} free.`)
        setIsPlayerChoosen(false)
        setIsBattle(false)
        setEnemy("")
        setActivePanel("location")
    }

    const handleRestart = () => {
        setIsMenu(true)
        setPlayerPokemons("")
        setIsBattle("false")
        setNar("")
        setIsPlayerChoosen(false)
        setChoosenPokemon({})
        setActivePanel("")
        setEnemy("")
        setEnemyDmg(0)
        setEnemyCurHp(0)
        setPlayerDmg(0)
        setPlayerCurHp(0)
        setIsAttackDisabled(false)
        setIsPlayerTurn(true)
        setIsGameOver(false)
    }





    const toggleSpecialDisabled = () => {
        if (isAttackDisabled === false && isSpecialDisabled === false) {
            return false
        } else {
            return true
        }
    }

    const toggleMendDisabled = () => {
        if (isAttackDisabled === false && isMendDisabled === false) {
            return false
        } else {
            return true
        }
    }

    const toggleHpPotDisabled = () => {
        if (isAttackDisabled === false && hpPotAmount !== 0) {
            return false
        } else {
            return true
        }
    }

    const toggleBoostPotDisabled = () => {
        if (isAttackDisabled === false && boostPotAmount !== 0) {
            return false
        } else {
            return true
        }
    }

    const toggleAbilityModal = () => {
        setIsAbilityModalOpen(!isAbilityModalOpen)
    }

    const handleShopClick = () => {
        setShopOrMedic("Shop")
    }

    const handleMedicClick = () => {
        setShopOrMedic("Medic")
    }

    return (
        <div className={`${activePanel === "battle" ? "active" : null} battle-container`}>
            <div className='inventory'>
                <div className='inv-slot'>
                    <img className="inv-pic" src="./gold.png" />
                    <div className='inv-amount'>x {gold}</div>
                </div>
                <div className='inv-slot'>
                    <img className="inv-pic" src="./hppot.png" />
                    <div className='inv-amount'>x {hpPotAmount}</div>
                </div>
                <div className='inv-slot'>
                    <img className="inv-pic" src="./boostpot.png" />
                    <div className='inv-amount'>x {boostPotAmount}</div>
                </div>
            </div>
            {isGameOver ? (
                <>
                    <div className='game-over'>Game over</div>
                    <button onClick={handleRestart} className='restart' type='button'>Restart</button>
                    <img className='game-over-pic' src='./gameover.png' />
                </>
            ) : (
                <>
                    {isGameWon ? (
                        <>
                            <div className='game-won'>You catched them all!</div>
                            <button onClick={handleRestart} className='restart' type='button'>Restart</button>
                            <img className='game-won-pic' src='./gamewon.png' />
                        </>) : (
                        <>
                            {isBattle ? (
                                <>
                                    {isPlayerChoosen ? (
                                        <>
                                            <div className="current-player-poke-container">
                                                <img className={`${defenseDuration > 0 ? "defend" : null} current-player-poke-img ${boostDuration > 0 ? "boost" : null}`} src={choosenPokemon.picBack} />
                                                {isPlayerfloatText ? (
                                                    <div className={`${isFloatDmg ? "float-dmg" : "float-heal"} player-float-text`}>{playerFloatText}</div>
                                                ) : (null)}
                                                <div className="hp">
                                                    <div className="hp-percent">{playerCurHp}/{choosenPokemon.hp}</div>
                                                    <div className="hp-left"></div>
                                                    <div className="hp-damage"></div>
                                                </div>
                                                <div className='boost-sword'> {boostDuration > 0 ? "⚔️" : null} </div>
                                            </div>
                                            {enemyCurHp <= 0 ? (null) : (
                                                <>
                                                    <div className="button-container">
                                                        <div className='ability-container'>
                                                            <div className='ability-title'>Abilities</div>
                                                            <button disabled={isAttackDisabled} onClick={(e) => handleAttack(e)} className="attack-button" type="button">Attack</button>
                                                            <button disabled={isAttackDisabled} onClick={(e) => handleHeavyAttack(e)} className="attack-button" type="button">Heavy Attack</button>
                                                            <button disabled={isAttackDisabled} onClick={(e) => handlePrecisionAttack(e)} className="attack-button" type="button">Precision Attack</button>
                                                            <button disabled={toggleSpecialDisabled()} onClick={(e) => handleSpecialAttack(e)} className="attack-button" type="button">Special Attack {isSpecialDisabled ? `(${specialCd})` : null}</button>
                                                            <button disabled={isAttackDisabled} onClick={(e) => handleDefend(e)} className="attack-button" type="button">Defend</button>
                                                            <button disabled={toggleMendDisabled()} onClick={(e) => handleMend(e)} className="attack-button" type="button">Mend {isMendDisabled ? `(${mendCd})` : null}</button>
                                                        </div>
                                                        <div className='items-container'>
                                                            <div className='items-title'>Items</div>
                                                            <button disabled={toggleHpPotDisabled()} onClick={(e) => handleHpPotion(e)} className="attack-button" type="button">Health Potion {`(${hpPotAmount})`}</button>
                                                            <button disabled={toggleBoostPotDisabled()} onClick={(e) => handleBoostPotion(e)} className="attack-button" type="button">Boost Potion {`(${boostPotAmount})`}</button>
                                                        </div>
                                                    </div>
                                                    <div className='ability-book-container'>
                                                        <img onClick={toggleAbilityModal} className='ability-book' src='pokedex.gif' />
                                                    </div>
                                                </>
                                            )}

                                        </>
                                    ) : (
                                        null
                                    )}
                                    {enemy ? (
                                        <>
                                            <div className="enemy-poke-container">
                                                <img className="enemy-poke-img" src={enemy.picFront} />
                                                <img onClick={() => setIsEnemydexModalOpen(!isEnemydexModalOpen)} className="enemydex-icon" src="pokedex.gif" />
                                                {isEnemyfloatText ? (
                                                    <div className='enemy-float-text'>{enemyFloatText}</div>
                                                ) : (null)}
                                                <div className="enemy-hp">
                                                    <div className="enemy-hp-percent">{enemyCurHp}/{enemy.hp}</div>
                                                    <>
                                                        <div className="enemy-hp-left"></div>
                                                        <div className="enemy-hp-damage"></div>
                                                    </>
                                                </div>
                                            </div>
                                            {enemyCurHp <= 0 ? (
                                                <div className='catch-pokemon'>
                                                    <button onClick={handleCatch} className='catch' type='button'>Catch it</button>
                                                    <button onClick={handleLeave} className='leave' type='button'>Leave it</button>
                                                </div>) : (
                                                null
                                            )}
                                        </>

                                    ) : (
                                        null
                                    )}
                                </>
                            ) : (
                                <>
                                    {shopOrMedic === 0 ? (
                                        <div className='shop-medic-buttons'>
                                            <div className='shop-button-div'>
                                                <img onClick={handleShopClick} className='shop-button-pic' src="/shop.png" />
                                            </div>
                                            <div className='medic-button-div'>
                                                <img onClick={handleMedicClick} className="medic-button-pic" src="/medic.png" />

                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {shopOrMedic === "Shop" ? (
                                                <Shop setShopOrMedic={setShopOrMedic} isFirstFightDone={isFirstFightDone} gold={gold} setGold={setGold} setHpPotAmount={setHpPotAmount} setBoostPotAmount={setBoostPotAmount} />
                                            ) : (
                                                <Medic setShopOrMedic={setShopOrMedic} gold={gold} setGold={setGold} playerPokemons={playerPokemons} setPlayerPokemons={setPlayerPokemons} />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}


            {enemy ? (<div className='current-location'>{capitalize(currentLocation)}</div>) : null}
            {isAbilityModalOpen ? (
                <Abilitymodal choosenPokemon={choosenPokemon} setIsAbilityModalOpen={setIsAbilityModalOpen} />
            ) : null}
            {isCombatModalOpen ? (
                <Combatmodal combatLog={combatLog} setCombatLog={setCombatLog} choosenPokemon={choosenPokemon} enemy={enemy} setIsCombatModalOpen={setIsCombatModalOpen} />
            ) : null}
            {isPokedexModalOpen ? (
                <Pokedexmodal playerPokemons={playerPokemons} setIsPokedexModalOpen={setIsPokedexModalOpen} />
            ) : null}
            {isEnemydexModalOpen ? (
                <Enemydexmodal enemy={enemy} setIsEnemydexModalOpen={setIsEnemydexModalOpen} />
            ) : null}

        </div>
    )
}

export default Battle