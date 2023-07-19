//const CardRanks = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"Jack":11,"Queen":12,"King":13,"Ace":14}
// const CardSuits = {"Spades": "♠", "Hearts": "♥", "Diamonds": "♦", "Clubs": "♣"}

import {Deck} from "./deck.js"
import {Hand} from "./hand.js"

// let dealerDeck = new Deck
// console.log(dealerDeck)

// let deck = new Deck
// console.log(deck)
// deck.shuffleDeck()
// console.log(deck.dealCard())

class BlackJack {
    constructor(startingMoney) {
        this.money = startingMoney
        this.bet = 0
    }

    getBet(bet) {
        if (bet > 0 && this.money >= bet) {
            this.bet = parseInt(bet)
            return true
        }
    }

    setupRound() {
        this.deck = new Deck
        this.deck.shuffleDeck()

        // Dealer
        this.dealerHand = new Hand
        this.dealerHand.addCard(this.deck.dealCard())

        // Player
        this.playerHand = new Hand
        for (let i = 0; i < 2; i++) this.playerHand.addCard(this.deck.dealCard())

        return [this.dealerHand.cards, this.playerHand.cards]
    }

    takePlayerTurn() {
        let newCard = this.deck.dealCard()
        this.playerHand.addCard(newCard)
        return newCard
    }

    takeDealerTurn() {
        let newCard = this.deck.dealCard()
        this.dealerHand.addCard(newCard)
        return newCard
    }

    determineOutcome() {
        if (this.playerHand.pointTally() === this.dealerHand.pointTally()) {
            return "You push"
        }
        else if (this.playerHand.hasBlackjack()) {
            this.money += 1.5 * this.bet
            return "Blackjack! You win!"
        }
        else if (this.dealerHand.hasBlackjack()) {
            this.money -= this.bet
            return "Dealer Blackjack. You lose!"
        }
        else if (this.playerHand.isBusted()) {
            this.money -= this.bet
            return "You busted. You lose!"
        }
        else if (this.dealerHand.isBusted()) {
            this.money += this.bet
            return "Dealer busted. You win!"
        }
        else if (this.playerHand.pointTally() > this.dealerHand.pointTally()) {
            this.money += this.bet
            return "You win!"
        }
        else if (this.playerHand.pointTally() < this.dealerHand.pointTally()) {
            this.money -= this.bet
            return "You lose!"
        }
    }
}

const startingMoney = 100
let money = 100
$(".moneyCounter span").html(money)

let gameState = false
let blackjack

//New Game Button Clicked
$("#newGame-button").on("click", () => {
    if (!gameState) blackjack = new BlackJack(money) //Change to on load?

    //Getting Bet
    if (!blackjack.getBet($("#betInput").val())) {
        $("#gameMessage").html("Invalid/Insufficient bet amount!!")
        return
    }
    else gameState = true

    //Updating Bet/Money/Cards
    $(".moneyCounter span").html(`${blackjack.money - blackjack.bet}`)
    $(".betCounter span").html(`${blackjack.bet}`)
    $(".card-div").html("")
    
    //Printing cards
    let tempArray = blackjack.setupRound()
    cardPrinter("#dealerCard-div", tempArray[0][0])
    for (let i = 0; i<2; i++) cardPrinter("#playerCard-div", tempArray[1][i])

    // Code to un/hide buttons
    $("#gameMessage").addClass("d-none")
    $("#gameControlButtonsAndMessage-div button").removeClass("d-none")

    //Disable bet input
    $("input").attr("disabled","disabled")
    $("input").val("")

    //Blackjack check
    if (blackjack.playerHand.hasBlackjack()) {
        cardPrinter("#dealerCard-div", blackjack.takeDealerTurn())
        if (!blackjack.dealerHand.hasBlackjack()) gameOver()
        else gameOver()
    }
})

//Stand Button Clicked
$("#stand-button").on("click", () => {
    if (gameState === true) {
        while(!blackjack.dealerHand.isBusted() && !blackjack.dealerHand.hasBlackjack() && blackjack.dealerHand.pointTally() < blackjack.playerHand.pointTally()) {
            cardPrinter("#dealerCard-div", blackjack.takeDealerTurn())
        }
        if (blackjack.dealerHand.hasBlackjack()) gameOver()
        else gameOver()
    }
})

$("#hit-button").on("click", () => {
    if (gameState === true) {
        //Player takes turn
        cardPrinter("#playerCard-div", blackjack.takePlayerTurn())

        //Dealer takes turn
        if (!blackjack.playerHand.isBusted()) cardPrinter("#dealerCard-div", blackjack.takeDealerTurn())
        if (blackjack.dealerHand.hasBlackjack()) gameOver()

        //Busted Check
        if (blackjack.playerHand.isBusted() || blackjack.dealerHand.isBusted()) gameOver()
    }
})

function cardPrinter(id, card) {
    let link = cardIdentifier(card)
    let elementImage = $(`<img src=${link}>`)
    $(`${id}`).append($(elementImage))
    pointUpdater()
}

function cardIdentifier (card) {
    if (card.suit === "Spades") {
        switch (card.rank) {
            case 2: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_2.png"
            case 3: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_3.png"
            case 4: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_4.png"
            case 5: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_5.png"
            case 6: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_6.png"
            case 7: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_7.png"
            case 8: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_8.png"
            case 9: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_9.png"
            case 10: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_10.png"
            case "Jack": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_jack.png"
            case "Queen": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_queen.png"
            case "King": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/spades_king.png"
            case "Ace": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/other/png_96_dpi/spades_ace_simple.png"
        }
    }
    if (card.suit === "Hearts") {
        switch (card.rank) {
            case 2: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_2.png"
            case 3: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_3.png"
            case 4: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_4.png"
            case 5: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_5.png"
            case 6: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_6.png"
            case 7: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_7.png"
            case 8: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_8.png"
            case 9: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_9.png"
            case 10: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_10.png"
            case "Jack": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_jack.png"
            case "Queen": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_queen.png"
            case "King": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_king.png"
            case "Ace": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/hearts_ace.png"
        }
    }
    if (card.suit === "Diamonds") {
        switch (card.rank) {
            case 2: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_2.png"
            case 3: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_3.png"
            case 4: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_4.png"
            case 5: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_5.png"
            case 6: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_6.png"
            case 7: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_7.png"
            case 8: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_8.png"
            case 9: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_9.png"
            case 10: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_10.png"
            case "Jack": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_jack.png"
            case "Queen": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_queen.png"
            case "King": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_king.png"
            case "Ace": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/diamonds_ace.png"
        }
    }
    if (card.suit === "Clubs") {
        switch (card.rank) {
            case 2: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_2.png"
            case 3: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_3.png"
            case 4: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_4.png"
            case 5: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_5.png"
            case 6: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_6.png"
            case 7: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_7.png"
            case 8: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_8.png"
            case 9: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_9.png"
            case 10: return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_10.png"
            case "Jack": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_jack.png"
            case "Queen": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_queen.png"
            case "King": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_king.png"
            case "Ace": return "https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_ace.png"
        }
    }
}

function pointUpdater() {
    $(`#dealerContainer-div .cardPoints`).html(`${blackjack.dealerHand.pointTally()}`)
    $(`#playerContainer-div .cardPoints`).html(`${blackjack.playerHand.pointTally()}`)
}

function gameOver() {
    $("#gameMessage").html(blackjack.determineOutcome())
    gameState = false

    // Code to un/hide buttons
    $("#gameMessage").removeClass("d-none")
    $("#gameControlButtonsAndMessage-div button").addClass("d-none")
    $("input").removeAttr("disabled")

    //Money/Bet update
    $(".moneyCounter span").html(`${money = blackjack.money}`)
    $(".betCounter span").html(`0`)
}