import axios from "axios";
import React, { useState } from "react";


function Card({ name, image }) {
    // async function picture () {
    // const altImg = await axios.get(`https://deckofcardsapi.com/static/img/back.png`)
    // }
    // picture();
    return <img src={image} alt={name} className="Card" />
}

export default Card;
