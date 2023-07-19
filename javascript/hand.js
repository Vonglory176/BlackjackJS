export {Hand}

class Hand {
    constructor() {
        this.cards = []
    }
    
    pointTally() {
        let total = 0, aces = 0

        this.cards.forEach(card => {
            if (card.value() === 11) aces++
            total += card.value()
        })

        while (this.total > 21 && aces > 0) {
            total -= 10
            aces -= 1
        }

        return total
    }

    
    isBusted() {return 21 < this.pointTally()}
    hasBlackjack() {return (this.cards.length === 2 && this.pointTally() === 21)}
    
    addCard(card) {this.cards.push(card)}
}