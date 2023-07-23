
// This part of the code is for the start button to get you right in the game
document.addEventListener("DOMContentLoaded", () => {
    let gamestate = new GameState()
   
    let btn = document.getElementById("start-button")
    btn.addEventListener("click", () =>{
        let body = document.getElementsByClassName("container")
        body[0].innerHTML = "<h1>Crazy Eights</h1> <h3 id='turn'>Turn: Player "+(gamestate.turn+1)+"</h3> <div id='pile'></div> <div id='current-player'><div class='hand' id='p1-hand'></div></div><h3 id='declared-suit'>Declared Suit: "+gamestate.declaredSuit+"</h3>"
        gamestate.round()
    })

})

// This class is to to represent a player in the game.
class Player{
    constructor(number){
        this.number = number
        this.hand = []
        this.points
    }
}
// Class card represent indivudal cards in the game
class Card{
    constructor(rank, suit, value)
    {
        this.suit = suit
        this.rank = rank
        this.value = value
        this.id = ""+rank+suit.charAt(0) // THis Generate a unique ID for the card.
    }
}

// Gamestate class mange the orverall state of the game
class GameState{
    constructor(){
        this.players = []
        this.deck = []
        this.pile = []
        this.finished = false
        this.turn = 0
        this.currentPlayer;
        this.declaredSuit = " ";
        this.topCard;
     
        // And those are for add players,creat the deck, shuffle it and to deal card to playrs
        this.addPlayers()
        this.createDeck()
        this.shuffle()
        this.deal()

        // Set the top card on the pile (discard pile) by taking cards from the deck until a non-eight card is found.
        while(!this.topCard || this.topCard.rank == "8"){
            this.topCard = this.deck.pop()
            this.pile.push(this.topCard)
        }
        
    }
    // This method is for add players to the game we did max 4 players
    addPlayers(){
        for(let i = 0; i < 4; i++){
            let p = new Player(i+1)
            this.players.push(p)
        }
    }
    //Method to shuffle the deck 
    shuffle() {
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }
    // Deal method is to deal card to players
    deal(){
       for(let i = 0; i<this.players.length; i++)
       {
           this.players[i].hand.push(deck.splice(deck.length-5))
       }
    }
    // This method is to create the deck of cards 
    createDeck(){
        let suits = ["Clubs", "Hearts", "Spades", "Diamonds"]
        for(let i = 0; i<4; i++)
        {
            for(let j = 1; j<14; j++)
            {
                let card;
                if(j == 1)
                {
                    card = new Card("A", suits[i], 1)
                }
                else if(j == 11)
                {
                    card = new Card("J", suits[i], 10)
                }
                else if(j == 12)
                {
                    card = new Card("Q", suits[i], 10)
                }
                else if(j == 13)
                {
                    card = new Card("K", suits[i], 10)
                }
                else{
                    card = new Card(""+j, suits[i], j)
                }
                this.deck.push(card)
            }
        }
    }

    deal(){
        for(let i = 0; i < this.players.length; i++) // Loop through each player in the players array
        {
            for(let j = 0; j<5; j++) //This loop 5 times so deal 5 cards to playrs
            {
                this.players[i].hand.push(this.deck.pop())
            }
            
        }
    }
    // Method to display the current player's hand in the game container.
    displayHands(){
            let addition = "" 
            let hand = this.currentPlayer.hand
            let currentHand = document.getElementById("current-player")
            for(let j = 0; j < hand.length; j++)
            {
                let file = hand[j].id+".png"
                addition += "<img class = 'card-image' id = '"+hand[j].id+"' src = 'assets/"+file+"' alt = '"+hand[j].id+"'>"
            }
            currentHand.innerHTML = addition
        }
    
        // Method to display the top card on the pile in the game container.
    displayPile()
    {
        let file = this.topCard.id+".png"
        let p = document.getElementById('pile')
        p.innerHTML = "<img class = 'card-image' id = '"+this.topCard.id+"' src = 'assets/"+file+"' alt = '"+this.topCard.id+"'>"
    }
    // This method updates the game state like corrent players turn 
    updates(){
        let pnum = document.getElementById('turn')
        pnum.innerHTML = "Player "+(this.turn+1)
        let points = document.getElementById('current-points')
        
        let suit = document.getElementById('declared-suit')
        if(this.topCard.rank == "8"){ // This updates if is a 8
            suit.innerHTML = "Declared Suit: "+this.declaredSuit
        }
        else{
            suit.innerHTML = " "
        }
    }

        // Method to handle a round of the game for the current player
    round(){
        this.currentPlayer = this.players[this.turn] //This get corrent player
        let num = this.turn+1
        let hand = this.currentPlayer.hand
        let id = "p"+num+"-hand"
        let count = 0
        this.updates() // This call the updates method
        this.displayHands() //This call DisplayHands method
        this.displayPile() //Call displaypile
        console.log(this.topCard)
        console.log(num)
        console.log(hand)
        for(let i = 0; i<hand.length; i++) //This loop through the players hand and check which cards can be played based on the current top card
        {
            let card = hand[i]
            let currentSuit;
            if(this.topCard.rank == "8")
            {
                currentSuit = this.declaredSuit.toUpperCase()               
            }
            else{
                currentSuit = this.topCard.suit.toUpperCase()    
            }

         // Check if the card's suit matches the current suit or if it has the same rank as the top card or if it's an eight.
            if(card.suit.toUpperCase() == currentSuit || card.rank == this.topCard.rank || card.rank == "8"){
                count++
                let cardID = card.id
                let cardElement = document.getElementById(cardID)
                cardElement.addEventListener('click', ()=>{
                    this.pile.push(card)
                    console.log("success")
                    let index = hand.indexOf(card)
                    hand.splice(index, 1)
                    // Check if the player has no cards left
                    if(hand.length == 0){
                        this.finished = true
                        this.declareWinner()//This delare the winer     
                    }
                    else if(card.rank == "8"){
                        this.declaredSuit = prompt("Declare a suit")// If an eight is played, prompt the player to declare a suit.
                        while (!(this.declaredSuit.toUpperCase() == "HEARTS" || this.declaredSuit.toUpperCase() == "SPADES" || this.declaredSuit.toUpperCase() == "DIAMONDS" || this.declaredSuit.toUpperCase() == "CLUBS")){
                            this.declaredSuit = prompt("That is not a valid suit. Please declare a suit.")
                        }
                        this.turn = (this.turn+1)%4 //This move to next players turn
                        this.topCard = this.pile[this.pile.length-1] //Update the top card on the pile.
                        this.round()  // Start the next round for the next player.
                    }
                    else{
                        this.turn = (this.turn+1)%4
                        this.topCard = this.pile[this.pile.length-1]
                        this.round()
                    }
                })

            }
        
        }
         // If no cards can be played, allow the player to draw a card.
        if(count == 0){
            let body = document.getElementsByClassName("container")
            let draw = document.createElement("button")
            draw.type = "input"
            draw.className = "btn btn-danger"
            draw.id = "draw"
            draw.innerHTML = "Draw"
            body[0].appendChild(draw)
            // Add a click event listener to the "Draw" button to handle drawing a card
            draw.addEventListener('click', ()=>{
                this.currentPlayer.hand.push(this.deck.pop())
                this.turn = (this.turn+1)%4
                body[0].removeChild(draw)
                this.round()
            })

            
        }
        
        
    }

    // This is  Method to declare the winner of the game and display it in the container.
    declareWinner(){
        document.getElementById('container').innerHTML = "<div class='winner'>Player "+this.currentPlayer.number+" is the winner!</div>"
        
    }

    

    
}


