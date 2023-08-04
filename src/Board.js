import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
// import "./Board.css";

//Link is for gathering data on the new deck, specifically the deck_id, but can also tell how many decks wanted as deck_count=x
//x is changeable as a const below for changign the number of decks desired.
const BASE_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count="
//               "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
const draw = "https://deckofcardsapi.com/api/deck/"
//            https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2

//x is the # of decks desired, used in deckIDInitial
let x = 1;
//This is a temporary deck_id for testing and should eventually be changed or removed.
let y = "3p40paa87x90";
//Thsi is the number of cards that can be drawn at one time, this is used in drawCard()
let z = 1;


function Board() {
    //the below useState is storing current deck_id # from the website
    const [boardID, setBoardID] = useState();

    //The below useState is for making an array of objects to include each card that is drawn as it is drawn. Basically the array is getting updated every time you draw a new card.
    const [drawn, setDrawn] = useState([]);

    //The below useState is for stating if the deck_id # has changed and thereform needs to reset the useEffect-deckIDInitial
    const [isShuffling, setIsShuffling] = useState(false)


    useEffect(function deckIDInitial() {
        async function deckID() {
            //Thsi is to get the deck_id, to be used to then draw cards later on.
            const deckResults = await axios.get(`${BASE_URL}${x}`);
            setBoardID(deckResults.data)
        }
        deckID();
    }, []);



    async function drawCard() {
        try {
            //This is to draw a specific number of cards at one time.
            const cardResults = await axios.get(`${draw}${boardID.deck_id}/draw/?count=${z}`)

            if (cardResults.data.remaining === 0) throw new Error("Deck empty!");

            //if the below variable had more than one card being drawn (see const cardResults ${z}) the [0] could be a different value depending on how many cards were drawn.
            const card = cardResults.data.cards[0];

            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
        } catch (err) {
            alert(err);
        }

    }

    /** Shuffle: change the state & effect will kick in. */
    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${draw}${boardID.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (err) {
            alert(err);
        } finally {
            setIsShuffling(false);
        }
    }
    /** Return draw button (disabled if shuffling) */
    function renderDrawBtnIfOk() {
        if (!boardID) return null;
        return (
            <button
                className="Deck-gimme"
                onClick={drawCard}
                disabled={isShuffling}>
                DRAW
            </button>
        );
    }
    /** Return shuffle button (disabled if already is) */
    function renderShuffleBtnIfOk() {
        if (!boardID) return null;
        return (
            <button
                className="Deck-gimme"
                onClick={startShuffling}
                disabled={isShuffling}>
                SHUFFLE DECK
            </button>
        );
    }
    return (
        <div className="Board"> Deck of Cards: Pile!!
            {drawn.map(c => (
                <Card key={c.id} name={c.name} image={c.image} />))}
            {renderDrawBtnIfOk()}
            {renderShuffleBtnIfOk()}
        </div>
    )
}



export default Board;