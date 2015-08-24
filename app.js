//1. take turns 
	//a-declare variables "player1" "player2" "counter"
var turn= 0;
	player1 = "";
	player2 = "";

function takeTurn(){
	if (turn%2 === 0){
		console.log("Player 1's turn");
	} else {
		console.log("Player 2's turn");
	}
	turn++
}
//need to fix because does not account for getting another turn if complete a box

//2.Create event listener for cliking a side 
	//a.event listener changes color to black
	//b.not able to be clicked twice 
	//c. skip to step three 
var sides = document.querySelectorAll("");
	button = document.querySelector("button");



//3.function to check if box is complete 
	//a. fill in box event listener different colors per player 
	//b. check if there is a winner (4)
	//c. if box is complete, then player who just completed box gets another turn 

//4 checkWinner
	//check for tie 
	//a.reset button 
$("#reset").on("click", function(){
  console.log(this);
  $(".box").empty();
});
	//b.alert winner 


