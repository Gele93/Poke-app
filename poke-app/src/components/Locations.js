import React, { useState, useEffect } from 'react';

function Locations({ setPossibleEncounters, setShopOrMedic, setCombatLog, combatLog, setCurrentLocation, isBattle, setIsBattle, setNar, capitalize, activePanel, setActivePanel, locations, setLocations, setIsGameWon, isGameWon }) {
/*
    const [isLocationChosen, setIsLocationChosen] = useState(false)

    useEffect(() => {
        setActivePanel("location")
        const fetchLocations = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/location/');
                if (!response.ok) {
                    throw new Error("fetching locations went wrong")
                }
                const data = await response.json();
                let allLocations = data.results
                allLocations = allLocations.map(l => {
                    return { ...l, visited: false }
                })

                setNar("Choose a location to travel!")
                setLocations(allLocations);

            } catch (error) {

            }
        }
        fetchLocations();
    }, [])

    const handleLocationClick = async (e) => {
        if (isBattle) return
        const target = e.target

        const clickedLocation = target.textContent
        let updatedLocations = [...locations]
        updatedLocations.find(l => l.name === clickedLocation).visited = true
        setLocations(updatedLocations)

        let updatedCombatLog = [...combatLog]

        updatedCombatLog.push({
            pokemon: "",
            text: `${clickedLocation}`
        })

        let clickedLocationNr = e.target.id
        
        const fetchLocationInfo = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/location-area/${clickedLocationNr}/`)
                if (!response.ok) {
                    throw new Error ("fetching location info went wrong")
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
        setCurrentLocation(clickedLocation)
        setActivePanel("mypokemons")
        setShopOrMedic(0)
        setIsBattle(true)
    }

    return (
        <div className={`${activePanel === "location" ? "active" : null} location-container`}>
        <h1 className="location-title">Locations</h1>
        <ul className="locations">
        {locations.map((location, i) => (
            <li key={location.name} className="location">
            <button id={i+1} disabled={location.visited} onClick={(e) => { handleLocationClick(e) }} className="location-button" type="button">{location.name}</button>
            </li>
        ))}
        </ul>
        
        </div>
        
        
    )
    */
   return <></>
}

export default Locations