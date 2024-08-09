import React, { useEffect, useState } from 'react'
import Abilitymodal from './Abilitymodal'
import Combatmodal from './Combatmodal'
import Pokedexmodal from './Pokedexmodal'
import Enemydexmodal from './Enemydex'
import Shop from "./Shop"
import Medic from './Medic'

function Battle({ setBalls, balls, possibleEncounters, shopOrMedic, setShopOrMedic, isSound, battleAudio, setBattleAudio, idleAudio, setIdleAudio, setIsPokedexModalOpen, isPokedexModalOpen, enemy, setEnemy, setCombatLog, combatLog, isCombatModalOpen, setIsCombatModalOpen, boostDuration, setBoostDuration, isMendDisabled, setIsMendDisabled, mendCd, setMendCd, defenseDuration, setDefenseDuration, capitalize, currentLocation, isSpecialDisabled, setIsSpecialDisabled, specialCd, setSpecialCd, isGameWon, setIsGameWon, locations, setLocations, setIsMenu, isBattle, setIsBattle, isPlayerChoosen, setIsPlayerChoosen, nar, setNar, choosenPokemon, setChoosenPokemon, activePanel, setActivePanel, playerPokemons, setPlayerPokemons }) {

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
    const [hoverShopOrMedic, setHoverShopOrMedic] = useState("")
    const [isCatchHover, setIsCatchHover] = useState(false)
    const [isCatchPossible, setIsCatchPossible] = useState(false)
    const [isCatchTried, setIsCatchTried] = useState(false)
    const [isCatched, setIsCatched] = useState(false)
    const [isBattleEnd, setIsBattleEnd] = useState(false)
    const [goldDrop, setGoldDrop] = useState(0)
    const [hpPotDrop, setHpPotDrop] = useState(false)
    const [boostPotDrop, setBoostPotDrop] = useState(false)
    const [pokeballDrop, setPokeballDrop] = useState(false)

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
                const fetchPokemonFromLocation = async (randomEncounterUrl) => {
                    try {
                        const response = await fetch(randomEncounterUrl);
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

                const randomEncounterNr = Math.floor(Math.random() * possibleEncounters.length)
                const randomEncounterUrl = possibleEncounters[randomEncounterNr].pokemon.url

                await fetchPokemonFromLocation(randomEncounterUrl)

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

            if (isCatchTried) {
                setEnemyFloatText("Dodge")
            }
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

            if (updatedCurHp < enemy.hp * 0.5) {
                setIsCatchPossible(true)
            }

            let goldDrop = 0
            let updatedBoostPotAmount = boostPotAmount
            let updatedHpPotAmount = hpPotAmount
            let updatedBalls = [...balls]
            if (updatedCurHp <= 0) {
                nar = `${enemy.name} has been defeated`

                const hpDropChance = Math.floor(Math.random() * 100)
                const boostDropChance = Math.floor(Math.random() * 100)
                const pokeballDropChance = Math.floor(Math.random() * 100)
                goldDrop = Math.round(enemy.hp / 10)
                setGoldDrop(goldDrop)
                nar += ` You gained ${goldDrop} gold!`

                if (hpDropChance < 30) {
                    updatedHpPotAmount++
                    setHpPotDrop(true)
                    nar += " You gained 1 Health Potion!"
                }
                if (boostDropChance < 30) {
                    updatedBoostPotAmount++
                    setBoostPotDrop(true)
                    nar += " You gained 1 Boost Potion!"
                }
                if (pokeballDropChance < 10) {
                    console.log(pokeballDropChance)
                    updatedBalls.push(1)
                    setPokeballDrop(true)
                    nar += " You gained 1 Pokeball!"
                }

                setIsBattleEnd(true)

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
                setIsCatchTried(false)
                setGold(prev => prev + goldDrop)
                setIsFirstFightDone(true)
                updateCombatLog(enemy.name, nar)
                setIsPlayerTurn(true)
                setHpPotAmount(updatedHpPotAmount)
                setBoostPotAmount(updatedBoostPotAmount)
                setBalls(updatedBalls)
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

    const handleCatchClick = () => {
        let hpFraction = enemyCurHp / enemy.hp
        let k = 1
        const catchChance = 1 - Math.exp(-k * (1 - hpFraction));
        const drawChance = Math.random()
        const success = drawChance < catchChance
        let nar = ""
        let dmg = 0

        if (success) {
            nar = `You catched ${enemy.name}!`
            let goldGain = Math.round(enemy.hp / 5)
            setGold(prev => prev + goldGain)
            setGoldDrop(goldGain)
            setNar(nar)
            updateCombatLog(choosenPokemon.name, nar)
            setIsBattleEnd(true)
            setIsCatched(true)
        } else {
            nar = `${enemy.name} sliped away from your pokeball.`
            setIsCatchTried(true)
            setIsAttackDisabled(true)
            setIsPlayerTurn(false)
            setNar(nar)
            updateCombatLog(choosenPokemon.name, nar)
            setEnemyDmg(dmg)
        }
    }

    const handleBattleEndOk = () => {
        document.querySelector(".battle-container").style.backgroundImage = ""
        let nar = "Choose another location!"
        let updatedPlayerPokemons = [...playerPokemons]

        if (isCatched) {
            let catchedEnemy = {
                ...enemy,
                choosen: false,
                dead: false,
            }
            updatedPlayerPokemons.push(catchedEnemy)
        }


        updatedPlayerPokemons = updatedPlayerPokemons.map(p => {
            if (p.name === choosenPokemon.name) {
                p.remainingHp = playerCurHp
                return { ...p, }
            } else {
                return { ...p }
            }
        })
        setPlayerPokemons(updatedPlayerPokemons)

        setIsPlayerChoosen(false)
        setIsBattle(false)
        setHpPotDrop(false)
        setBoostPotDrop(false)
        setPokeballDrop(false)
        setIsBattleEnd(false)
        setEnemy("")
        setNar(nar)
        setIsCatchTried(false)
        setIsCatchPossible(false)
        setIsCatched(false)
        updateCombatLog(choosenPokemon.name, `You catched ${enemy.name}!`)
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
    const toggleCatchDisabled = () => {
        if (balls.length === playerPokemons.length) {
            return true
        }
        if (!isCatchPossible) {
            return true
        }
        if (isAttackDisabled) {
            return true
        }
        return false

    }



    const handleShopClick = () => {
        setShopOrMedic("Shop")
    }

    const handleMedicClick = () => {
        setShopOrMedic("Medic")
    }



    const handleHoverShop = () => {
        setHoverShopOrMedic("Merchant")
    }
    const handleHoverShopOff = () => {
        setHoverShopOrMedic("")
    }
    const handleHoverMedic = () => {
        setHoverShopOrMedic("Poke Center")
    }
    const handleHoverMedicOff = () => {
        setHoverShopOrMedic("")
    }
    const handleCatchHover = () => {
        setIsCatchHover(true)
    }
    const handleCatchHoverOff = () => {
        setIsCatchHover(false)
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
                                                            <button disabled={toggleCatchDisabled()} onClick={handleCatchClick} onMouseOver={handleCatchHover} onMouseOut={handleCatchHoverOff} className="attack-button catch-button" type="button">Catch!<img src='/pokeball.png' className={`${isCatchHover && "hover"} catch-pokeball`} /></button>
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
                                                <img onClick={handleShopClick} onMouseOver={handleHoverShop} onMouseOut={handleHoverShopOff} className='shop-button-pic' src="/shop.png" />
                                            </div>
                                            <div className='medic-button-div'>
                                                <img onClick={handleMedicClick} onMouseOver={handleHoverMedic} onMouseOut={handleHoverMedicOff} className="medic-button-pic" src="/medic.png" />

                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {shopOrMedic === "Shop" ? (
                                                <Shop setBalls={setBalls} balls={balls} setShopOrMedic={setShopOrMedic} isFirstFightDone={isFirstFightDone} gold={gold} setGold={setGold} setHpPotAmount={setHpPotAmount} setBoostPotAmount={setBoostPotAmount} />
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


            {enemy ? (
                <div className='current-location'>{capitalize(currentLocation)}</div>
            ) : (
                <div className='current-location'>{hoverShopOrMedic}</div>

            )}
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
            {isBattleEnd ? (
                <div className='battle-end-modal'>
                    {isCatched ? (
                        <h1 className='battle-end-modal-title'>You catched {enemy.name}!</h1>
                    ) : (
                        <h1 className='battle-end-modal-title'>You defeated {enemy.name}!</h1>
                    )}
                    <div className='drop-list'>
                        <div className='inv-slot'>
                            <img className="inv-pic" src="./gold.png" />
                            <div className='inv-amount'>x {goldDrop}</div>
                        </div>
                        {hpPotDrop &&
                            <div className='inv-slot'>
                                <img className="inv-pic" src="./hppot.png" />
                            </div>
                        }
                        {boostPotDrop &&
                            <div className='inv-slot'>
                                <img className="inv-pic" src="./boostpot.png" />
                            </div>
                        }
                        {pokeballDrop &&
                            <div className='inv-slot'>
                                <img className="inv-pic" src="./pokeball.png" />
                            </div>
                        }
                        {isCatched &&
                            <div className='inv-slot'>
                                <img className="inv-pic" src={enemy.picFront} />
                            </div>
                        }
                    </div>
                    <button onClick={handleBattleEndOk} className='battle-end-ok' type='button'>Ok</button>
                </div>
            ) : null}

        </div>
    )
}

export default Battle