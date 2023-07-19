export class Card {
    constructor(rank, suit){
        this.rank = rank
        this.suit = suit
    }

    value() {
        switch (this.rank) {
            case "Ace": return 11
            case "King": return 10
            case "Queen": return 10
            case "Jack": return 10
            default: return this.rank
        }
    }
}