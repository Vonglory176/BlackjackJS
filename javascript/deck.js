// const CardRanks = ["2","3","4","5","6","7","8","9","10","Jack","Queen","King","Ace"]
const CardRanks = [2,3,4,5,6,7,8,9,10,"Jack","Queen","King","Ace"]
const CardSuits = ["Spades","Hearts","Diamonds","Clubs"]

import {Card} from "./card.js"

export class Deck {
    constructor() {
        this.cards = []
        this.createNewDeck()
    }
    
    createNewDeck() {
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 13; j++) {
                this.cards.push(new Card(CardRanks[j], CardSuits[i]))
            }
        }
    }

    shuffleDeck() {
        let currentIndex = this.cards.length,  randomIndex;
        
        // While there remain elements to shuffle.
        while (currentIndex != 0) { 
        
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
        
            // And swap it with the current element.
            [this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]]
        }

        // // While there remain elements to shuffle.
        // let randomIndex
        // for (let i = this.cards.length; i != 0; i--) { 
        //     // Pick a remaining element.
        //     randomIndex = Math.floor(Math.random() * i)
        //     // And swap it with the current element.
        //     [this.cards[i], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[i]]
        // }
    }

    dealCard() {return this.cards.shift()}
}