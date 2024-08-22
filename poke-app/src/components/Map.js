import React from 'react'
import { useState, useEffect, useRef } from 'react'

function Map({ setIsGuardianEncounter, setCurrentGuardianEncounter, guardians, setGuardians, visibleSliceOfAllMap, setVisibleSliceOfAllMap, visibleMap, setVisibleMap, locationsWithPositions, setLocationsWithPositions, setSteppedLocation, steppedLocation, setIsMapInit, playerPosition, setPlayerPosition, allMap, setAllMap, isMapInit, setActivePanel, setNar, setLocations, locations, combatLog, setPossibleEncounters, setCurrentLocation, setShopOrMedic, setIsBattle, isBattle, setCombatLog, activePanel }) {

    const rowLength = 18
    const colLength = 7

    const [midLocations, setMidLocations] = useState([])
    const [topLeftLocations, setTopLeftLocations] = useState([])
    const [topLocations, setTopLocations] = useState([])
    const [topRightLocations, setTopRightLocations] = useState([])
    const [leftLocations, setleftLocations] = useState([])
    const [rightLocations, setRightLocations] = useState([])
    const [bottomLeftLocations, setBottomLeftLocations] = useState([])
    const [bottomLocations, setBottomLocations] = useState([])
    const [bottomRightLocations, setBottomRightLocations] = useState([])
    const [loading, setLoading] = useState(false)



    const visibleMapRef = useRef(visibleMap)
    const playerPositionRef = useRef(playerPosition)


    //USEREFS
    useEffect(() => {
        visibleMapRef.current = visibleMap
    }, [visibleMap])
    useEffect(() => {
        playerPositionRef.current = playerPosition
    }, [playerPosition])

    //FETCH
    const getRandomRuinBackground = (backgroundType) => {
        const backgrounds = {
            "ruins": ["ruin1"],
            "glades": ["glade1", "glade2", "glade3", "glade4", "glade5", "glade6", "glade7", "glade8"]
        }
        return backgrounds[backgroundType][Math.floor(Math.random() * backgrounds[backgroundType].length)]
    }

    useEffect(() => {
        if (isMapInit) {
            setActivePanel("")

            const initAllLocations = async () => {

                const fetchLocations = async (pokeUrl, locationNrStart = 0, backgroundType = "glades", lakeNumbers = 0, rockNumbers = 0, flameNumbers = 0, bushNumbers = 0) => {
                    try {
                        setLoading(true)
                        const response = await fetch(pokeUrl);
                        if (!response.ok) {
                            throw new Error("fetching locations went wrong")
                        }
                        const data = await response.json();
                        let allLocations = await data.results
                        allLocations = allLocations.map((l, i) => {
                            return { ...l, visited: false, type: "location", locationNr: locationNrStart + i, background: getRandomRuinBackground(backgroundType) }
                        })

                        const pokeCenterLocation1 = {
                            name: "Medic1",
                            visited: false,
                            type: "Medic",
                            background: "medic"
                        }
                        const pokeCenterLocation2 = {
                            name: "Medic2",
                            visited: false,
                            type: "Medic",
                            background: "medic"
                        }
                        const merchantLocation1 = {
                            name: "Shop1",
                            visited: false,
                            type: "Shop",
                            background: "shop"
                        }
                        const merchantLocation2 = {
                            name: "Shop2",
                            visited: false,
                            type: "Shop",
                            background: "shop"
                        }

                        const lakes = []
                        for (let i = 0; i < lakeNumbers; i++) {
                            lakes.push({
                                name: `Lake${i}`,
                                visited: false,
                                type: "block",
                                background: "lake"
                            })
                        }

                        const rocks = []
                        for (let i = 0; i < rockNumbers; i++) {
                            rocks.push({
                                name: `Rock${i}`,
                                visited: false,
                                type: "block",
                                background: "rock"
                            })
                        }

                        const flames = []
                        for (let i = 0; i < flameNumbers; i++) {
                            flames.push({
                                name: `Flame${i}`,
                                visited: false,
                                type: "block",
                                background: "flame"
                            })
                        }

                        const bushes = []
                        for (let i = 0; i < bushNumbers; i++) {
                            bushes.push({
                                name: `Bush${i}`,
                                visited: false,
                                type: "block",
                                background: "bush"
                            })
                        }

                        allLocations.push(pokeCenterLocation1, pokeCenterLocation2, merchantLocation1, merchantLocation2, ...lakes, ...rocks, ...flames, ...bushes)

                        return allLocations;

                    } catch (error) {
                        console.error(error)
                    } finally {
                        setLoading(false)
                    }
                }
                setMidLocations(await fetchLocations('https://pokeapi.co/api/v2/location/', 0, "glades"))
                setTopLeftLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=100&limit=20", 100, "ruins"))
                setTopLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=20&limit=20", 20, "glades", 2, 36, 2, 2))
                setTopRightLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=120&limit=20", 120, "ruins"))
                setleftLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=40&limit=20", 40, "glades", 2, 2, 36, 2))
                setRightLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=60&limit=20", 180, "glades", 2, 2, 2, 36))
                setBottomLeftLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=140&limit=20", 140, "ruins"))
                setBottomLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=80&limit=20", 80, "glades", 36, 2, 2, 2))
                setBottomRightLocations(await fetchLocations("https://pokeapi.co/api/v2/location/?offset=160&limit=20", 160, "ruins"))

            }
            initAllLocations()
        }
    }, [])

    //INIT GUARDIANS
    useEffect(() => {
        if (isMapInit) {
            setGuardians({
                fire: {
                    position: 0,
                    toAwake: 0,
                    location: {
                        name: "Fire Guardian",
                        visited: false,
                        type: "guardian",
                        background: "fire-guardian"
                    },
                    guardianUrls: [
                        "https://pokeapi.co/api/v2/pokemon/charmander",
                        "https://pokeapi.co/api/v2/pokemon/charmeleon",
                        "https://pokeapi.co/api/v2/pokemon/charizard"
                    ]
                },
                water: {
                    position: 0,
                    toAwake: 0,
                    location: {
                        name: "Water Guardian",
                        visited: false,
                        type: "guardian",
                        background: "water-guardian"
                    },
                    guardianUrls: [
                        "https://pokeapi.co/api/v2/pokemon/squirtle",
                        "https://pokeapi.co/api/v2/pokemon/wartortle",
                        "https://pokeapi.co/api/v2/pokemon/blastoise"
                    ]
                },
                rock: {
                    position: 0,
                    toAwake: 0,
                    location: {
                        name: "Rock Guardian",
                        visited: false,
                        type: "guardian",
                        background: "rock-guardian"
                    },
                    guardianUrls: [
                        "https://pokeapi.co/api/v2/pokemon/geodude ",
                        "https://pokeapi.co/api/v2/pokemon/graveler ",
                        "https://pokeapi.co/api/v2/pokemon/golem "
                    ]
                },
                grass: {
                    position: 0,
                    toAwake: 0,
                    location: {
                        name: "Grass Guardian",
                        visited: false,
                        type: "guardian",
                        background: "grass-guardian"
                    },
                    guardianUrls: [
                        "https://pokeapi.co/api/v2/pokemon/bulbasaur ",
                        "https://pokeapi.co/api/v2/pokemon/ivysaur ",
                        "https://pokeapi.co/api/v2/pokemon/venusaur "
                    ]
                },
            })
        }
    }, [])


    //INITIALIZE MAP
    const fillLocations = (i, j) => {
        let areaNumber = i * 54 + j
        if (locationsWithPositions.some(l => l.position === areaNumber)) {
            return locationsWithPositions.find(l => l.position === areaNumber)
        } else {
            return {
                position: 397,
                type: "terrain",
                terrain: "grass"
            }
        }
    }

    useEffect(() => {
        if (locationsWithPositions.length > 0) {
            let updatedAllMap = [...allMap]
            if (isMapInit) {
                updatedAllMap = Array(21).fill().map(() => Array(54).fill(0))
            }
            updatedAllMap = updatedAllMap.map((c, i) => {
                return c.map((a, j) => {
                    return fillLocations(i, j)
                })
            })

            if (isMapInit) {
                updatedAllMap[playerPosition[0]][playerPosition[1]] = "X"
            }

            setAllMap(updatedAllMap)
        }
    }, [locationsWithPositions])




    useEffect(() => {
        if (allMap) {
            let updatedVisibleMap = allMap.slice(visibleSliceOfAllMap[0][0], visibleSliceOfAllMap[0][1])
            updatedVisibleMap = updatedVisibleMap.map(c => {
                return c.slice(visibleSliceOfAllMap[1][0], visibleSliceOfAllMap[1][1])
            })

            setVisibleMap(updatedVisibleMap)
        }
    }, [allMap])

    useEffect(() => {
        if (isMapInit && midLocations.length > 0 && topLeftLocations.length > 0 && topLocations.length > 0 && topRightLocations.length > 0 && leftLocations.length > 0 && rightLocations.length > 0 && bottomLeftLocations.length > 0 && bottomLocations.length > 0 && bottomRightLocations.length > 0) {


            let updatedLocations = []
            updatedLocations.push(...midLocations, ...topLeftLocations, ...topLocations, ...topRightLocations, ...leftLocations, ...rightLocations, ...bottomLeftLocations, ...bottomLocations, ...bottomRightLocations)
            setLocations(updatedLocations)

            if (locationsWithPositions.length === 0) {

                let possibleMidPositions = []
                for (let i = 7; i < 14; i++) {
                    for (let j = 18; j < 36; j++) {
                        possibleMidPositions.push(i * 54 + j)
                    }
                }

                setPlayerPosition([10, 26])
                possibleMidPositions = possibleMidPositions.filter(p => p !== 10 * 54 + 26)

                let initialLocationsWithPositions = []
                midLocations.map(l => {
                    const randomPos = possibleMidPositions.splice(Math.floor(Math.random() * possibleMidPositions.length), 1)
                    initialLocationsWithPositions.push({
                        position: randomPos[0],
                        location: l
                    })
                })
                possibleMidPositions.map(p => {
                    initialLocationsWithPositions.push({
                        position: p,
                        type: "terrain",
                        terrain: "grass"
                    })
                })

                const addPositionToLocations = (startI, startJ, section, background = "grass", guardian) => {
                    let possiblePositions = []
                    for (let i = startI; i < startI + 7; i++) {
                        for (let j = startJ; j < startJ + 18; j++) {
                            possiblePositions.push(i * 54 + j)
                        }
                    }
                    section.map(l => {
                        const randomPos = possiblePositions.splice(Math.floor(Math.random() * possiblePositions.length), 1)
                        initialLocationsWithPositions.push({
                            position: randomPos[0],
                            location: l,
                            guardianType: guardian
                        })
                    })

                    if (guardian) {
                        const randomPos = possiblePositions.splice(Math.floor(Math.random() * possiblePositions.length), 1)
                        let updatedGuardians = { ...guardians }
                        updatedGuardians[guardian].position = randomPos[0]
                        initialLocationsWithPositions.push({
                            position: randomPos[0],
                            type: "guardian",
                            toAwake: updatedGuardians[guardian].toAwake,
                            location: updatedGuardians[guardian].location,
                            guardianUrls: updatedGuardians[guardian].guardianUrls
                        })
                        setGuardians(updatedGuardians)
                    }

                    possiblePositions.map(p => {
                        initialLocationsWithPositions.push({
                            position: p,
                            type: "terrain",
                            terrain: background
                        })
                    })

                }

                addPositionToLocations(0, 0, topLeftLocations, "forest")
                addPositionToLocations(0, 18, topLocations, "grass", "rock")
                addPositionToLocations(0, 36, topRightLocations, "desert")
                addPositionToLocations(7, 0, leftLocations, "grass", "fire")
                addPositionToLocations(7, 36, rightLocations, "grass", "grass")
                addPositionToLocations(14, 0, bottomLeftLocations, "mud")
                addPositionToLocations(14, 18, bottomLocations, "grass", "water")
                addPositionToLocations(14, 36, bottomRightLocations, "winter")

                //  setLocations(initialLocationsWithPositions)
                setLocationsWithPositions(initialLocationsWithPositions)
            }

        }
    }, [bottomRightLocations])


    //MOVE VISIBLE MAP
    //[[7, 14], [18, 36]]
    const moveVisibleMapRight = () => {
        let updatedVisibleSlice = [...visibleSliceOfAllMap]
        if (updatedVisibleSlice[1][1] < 54) {
            updatedVisibleSlice[1][0] += 1
            updatedVisibleSlice[1][1] += 1
        }
        setVisibleSliceOfAllMap(updatedVisibleSlice)
    }

    const moveVisibleMapLeft = () => {
        let updatedVisibleSlice = [...visibleSliceOfAllMap]
        if (updatedVisibleSlice[1][0] > 0) {
            updatedVisibleSlice[1][0] -= 1
            updatedVisibleSlice[1][1] -= 1
        }
        setVisibleSliceOfAllMap(updatedVisibleSlice)
    }

    const moveVisibleMapDown = () => {
        let updatedVisibleSlice = [...visibleSliceOfAllMap]
        if (updatedVisibleSlice[0][1] < 21) {
            updatedVisibleSlice[0][0] += 1
            updatedVisibleSlice[0][1] += 1
        }

        setVisibleSliceOfAllMap(updatedVisibleSlice)
    }

    const moveVisibleMapUp = () => {
        let updatedVisibleSlice = [...visibleSliceOfAllMap]
        if (updatedVisibleSlice[0][0] > 0) {
            updatedVisibleSlice[0][0] -= 1
            updatedVisibleSlice[0][1] -= 1
        }
        setVisibleSliceOfAllMap(updatedVisibleSlice)
    }



    //HANDLE MOVEMENT
    const handleMoveKey = (e) => {
        let updatedPosition = [...playerPositionRef.current]
        let updatedVisibleMap = [...visibleMapRef.current]

        let curVisiblePosition = []

        updatedVisibleMap.map((r, i) => {
            if (r.includes("X")) {
                curVisiblePosition.push(i)
                r.map((c, j) => {
                    if (c === "X") {
                        curVisiblePosition.push(j)
                    }
                })
            }
        })

        if (e.key === "ArrowRight") {
            if (updatedPosition[1] === 53) return
            if (updatedVisibleMap[curVisiblePosition[0]][curVisiblePosition[1] + 1].location) {
                if (updatedVisibleMap[curVisiblePosition[0]][curVisiblePosition[1] + 1].location.type === "block") return
            }

            if (curVisiblePosition[1] >= 14) {
                moveVisibleMapRight()
            }
            setPlayerPosition([updatedPosition[0], updatedPosition[1] + 1,])

        }
        if (e.key === "ArrowLeft") {
            if (updatedPosition[1] === 0) return
            if (updatedVisibleMap[curVisiblePosition[0]][curVisiblePosition[1] - 1].location) {
                if (updatedVisibleMap[curVisiblePosition[0]][curVisiblePosition[1] - 1].location.type === "block") return
            }

            if (curVisiblePosition[1] <= 3) {
                moveVisibleMapLeft()
            }
            setPlayerPosition([updatedPosition[0], updatedPosition[1] - 1])

        }
        if (e.key === "ArrowDown") {
            if (updatedPosition[0] === 20) return
            if (updatedVisibleMap[curVisiblePosition[0] + 1][curVisiblePosition[1]].location) {
                if (updatedVisibleMap[curVisiblePosition[0] + 1][curVisiblePosition[1]].location.type === "block") return
            }

            if (curVisiblePosition[0] >= 4) {
                moveVisibleMapDown()
            }
            setPlayerPosition([updatedPosition[0] + 1, updatedPosition[1]])

        }
        if (e.key === "ArrowUp") {
            if (updatedPosition[0] === 0) return
            if (updatedVisibleMap[curVisiblePosition[0] - 1][curVisiblePosition[1]].location) {
                if (updatedVisibleMap[curVisiblePosition[0] - 1][curVisiblePosition[1]].location.type === "block") return
            }
            if (curVisiblePosition[0] <= 2) {
                moveVisibleMapUp()
            }
            setPlayerPosition([updatedPosition[0] - 1, updatedPosition[1]])
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleMoveKey)
        return () => {
            window.removeEventListener("keydown", handleMoveKey)
        }
    }, [])


    //UPDATE MAP

    const handleStepInLocation = async (curLocation) => {

        setLoading(true)

        let updatedLocationWithPosition = [...locationsWithPositions]
        updatedLocationWithPosition.find(l => l.position === curLocation.position).location.visited = true

        if (curLocation.guardianType) {
            let updatedGuardians = { ...guardians }
            updatedGuardians[curLocation.guardianType].toAwake--
            updatedLocationWithPosition.find(l => l.position === updatedGuardians[curLocation.guardianType].position).toAwake--
            setGuardians(updatedGuardians)
        }

        let updatedCombatLog = [...combatLog]
        updatedCombatLog.push({
            pokemon: "",
            text: `${curLocation.name}`
        })

        const fetchLocationInfo = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/location-area/${curLocation.location.locationNr}/`)
                if (!response.ok) {
                    throw new Error(`fetching went wrong -> https://pokeapi.co/api/v2/location-area/${curLocation.location.locationNr}/`)
                }
                const locationInfo = await response.json()
                const possibleEncounters = locationInfo.pokemon_encounters
                setPossibleEncounters(possibleEncounters)
            } catch (error) {
                console.error(error)
            }
        }
        await fetchLocationInfo()

        setCombatLog(updatedCombatLog)
        setCurrentLocation(curLocation.location.name)
        setActivePanel("mypokemons")
        setShopOrMedic(0)
        setIsBattle(true)
        setIsMapInit(false)
        setLocationsWithPositions(updatedLocationWithPosition)
        setLoading(false)
    }

    const handleStepInGuardian = (curLocation) => {
        if (curLocation.toAwake > 0) return
        console.log(curLocation)
        let updatedLocationWithPosition = [...locationsWithPositions]
        updatedLocationWithPosition.find(l => l.position === curLocation.position).location.visited = true

        let updatedCombatLog = [...combatLog]
        updatedCombatLog.push({
            pokemon: "",
            text: `${curLocation.location.name}`
        })


        setCurrentLocation(curLocation.location.name)
        setCurrentGuardianEncounter(curLocation)
        setCombatLog(updatedCombatLog)
        setActivePanel("mypokemons")
        setShopOrMedic(0)
        setIsMapInit(false)
        setLocationsWithPositions(updatedLocationWithPosition)
        setIsGuardianEncounter(true)
        setIsBattle(true)


    }


    useEffect(() => {
        if (allMap.length > 0) {
            let updatedMap = [...allMap]
            updatedMap = updatedMap.map((c, i) => {
                return c.map((a, j) => {
                    if (a === "X") {
                        return fillLocations(i, j)
                    } else {
                        return a
                    }
                })
            })

            let areaToMove = updatedMap[playerPosition[0]][playerPosition[1]]

            if (areaToMove.type !== "terrain") {

                if (areaToMove.location.type === "location" && !areaToMove.location.visited) {
                    handleStepInLocation(areaToMove)
                } else if ((areaToMove.location.type === "Medic" || areaToMove.location.type === "Shop") && !areaToMove.location.visited) {
                    //let updatedLocations = [...locations]
                    let updatedLocationWithPosition = [...locationsWithPositions]
                    updatedLocationWithPosition.find(l => l.position === areaToMove.position).location.visited = true
                    setLocationsWithPositions(updatedLocationWithPosition)
                    setShopOrMedic(areaToMove.location.type)
                } else if (areaToMove.location.type === "guardian" && !areaToMove.location.visited) {
                    handleStepInGuardian(areaToMove)
                }
            }
            else {
            }
            updatedMap[playerPosition[0]][playerPosition[1]] = "X"

            setAllMap(updatedMap)
        }
    }, [playerPosition])




    const fillArea = (mapContent) => {


        if (mapContent === 0) {
            return 0
        } else if (mapContent.location.type === "location") {
            return mapContent.location.name
        }

    }

    return (
        <div className={`${activePanel === "map" ? "active" : null} map`}>
            {loading ? (
                <div className='loading'></div>
            ) : (
                visibleMap.map((c, i) => (
                    <div key={i} className={`map-colum-${i + 1} map-colum`}>
                        {c.map((a, j) => (a === "X" ?
                            (
                                <img key={j} className={`map-area-${j + 1} ash`} src='./Ash.png' />
                            ) : (a.type === "terrain" ?
                                (
                                    <img key={j} className={`map-area-${j + 1} grass`} src={`./${a.terrain}.jpg`} />
                                ) : (a.type === "guardian" ?
                                    (
                                        <div key={j} className={`map-area-${j + 1} map-area ${a.location.visited ? "visited-location-area" : ""} ${a.location.background}`}>
                                            <img className={`location-background ${a.toAwake > 0 ? "" : "guardian"}`} src={a.toAwake > 0 ? "./grass.jpg" : `./${a.location.background}.png`} />
                                        </div>
                                    ) : (
                                        <div key={j} className={`map-area-${j + 1} map-area ${a.location.visited ? "visited-location-area" : ""} ${a.location.background} `}>
                                            <img className={`${a.location.type === "block" ? "location-block" : a.location.type === "Shop" || a.location.type === "Medic" ? "location-support" : "location-encounter"} location-background`} src={`./${a.location.background}.png`} />
                                        </div>
                                    )
                                )
                            )
                        ))}
                    </div>
                ))
            )}

        </div>
    )
}

export default Map


