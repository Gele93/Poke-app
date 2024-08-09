import React, { useEffect } from 'react'
import { useState } from 'react'

function Shop({ balls, setBalls, setShopOrMedic, setHpPotAmount, setBoostPotAmount, isFirstFightDone, gold, setGold }) {

    const [mercNar, setMercNar] = useState("")

    useEffect(() => {

        if (isFirstFightDone) {
            setMercNar(`Good fight! What you need now?`)
        } else {
            setMercNar(`Welcome to my store, traveller!
    Buy the best drinks you can find in the country!`)
        }

    }, [isFirstFightDone])


    const hpPotPrice = 10
    const boostPotPrice = 12
    const pokeballPrice = 30


    const handleBuyHpPot = () => {
        if (gold >= hpPotPrice) {
            setMercNar(`One Health potion for my friend!`)
            setGold(prev => prev - hpPotPrice)
            setHpPotAmount(prev => prev + 1)
        } else {
            setMercNar("No money - no potion")
        }
        
    }
    const handleBuyBoostPot = () => {
        if (gold >= boostPotPrice) {
            setMercNar(`This will make your pokemon pumped UP!!`)
            setGold(prev => prev - boostPotPrice)
            setBoostPotAmount(prev => prev + 1)
        } else {
            setMercNar("No money - no dance")
        }
    }
    const handleBuyPokeBall = () => {
        if (gold >= pokeballPrice) {
            let updatedBalls = [...balls]
            updatedBalls.push(1)
            setMercNar(`Catch all of them! But at least one more!`)
            setGold(prev => prev - pokeballPrice)
            setBalls(updatedBalls)
        } else {
            setMercNar("Those are expensive stuff!")
        }
    }

    const handleBackClick = () => {
        setShopOrMedic(0)
    }

    const handleHpPotHover = () => {
        setMercNar(`This will Heal your pokemon 15 HP anytime in fight.`)
    }
    const handleHpPotHoverOff = () => {
        setMercNar(`Look around my friend!`)
    }
    const handleBoostPotHover = () => {
        setMercNar(`Your pokemon will cause 1.5x damage for 3 turns.`)
    }
    const handleBoostPotHoverOff = () => {
        setMercNar(`What can I do for you?`)
    }
    const handlePokeballHover = () => {
        setMercNar(`You will need these to catch more pokemons.`)
    }
    const handlePokeballHoverOff = () => {
        setMercNar(`Wanna buy some?`)
    }


    return (
        <div className='shop'>
            <img className='shop-merc' src='https://images-ext-1.discordapp.net/external/pSRzn0xcHvciRsg-m5rvd00D26p1SbUI0d7qBT6b0bg/%3Fcb%3D20210709024610/https/static.wikia.nocookie.net/pokemon-xenoverse/images/1/19/Merchant.png/revision/latest?format=webp&width=500&height=480' />
            <div className='merc-nar'>{mercNar}</div>
            <div className='shop-desk'></div>
            <div className='shop-title'>Shop</div>
            <div className='shop-items'>
                <div className='shop-item'>
                    <div className='shop-item-price'>{hpPotPrice}🪙</div>
                    <img onMouseOver={handleHpPotHover} onMouseOut={handleHpPotHoverOff} className='shop-item-pic' src='./hppot.png' />
                    <button onClick={handleBuyHpPot} className='shop-buy'>Buy</button>
                </div>
                <div className='shop-item'>
                    <div className='shop-item-price'>{boostPotPrice}🪙</div>
                    <img onMouseOver={handleBoostPotHover} onMouseOut={handleBoostPotHoverOff} className='shop-item-pic' src='./boostpot.png' />
                    <button onClick={handleBuyBoostPot} className='shop-buy'>Buy</button>
                </div>
                <div className='shop-item'>
                    <div className='shop-item-price'>{pokeballPrice}🪙</div>
                    <img onMouseOver={handlePokeballHover} onMouseOut={handlePokeballHoverOff} className='shop-item-pic-ball' src='./pokeball.png' />
                    <button onClick={handleBuyPokeBall} className='shop-buy'>Buy</button>
                </div>
            </div>
            <button onClick={handleBackClick} className='back-from-shop' type='button'>Back</button>
        </div>
    )
}

export default Shop