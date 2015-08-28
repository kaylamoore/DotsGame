
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
//canvas context
//create divs using javascript 
	var dotRadius = 10;
//make size of dots on board uniform 
	var boardWidth = 5;
	var boardHeight = 5;
//width x height of the board 
	var startX = 200;
	var startY = 100;
//lowers the starting point so it is not in the corner
	var DOTGAP = 100; 
//layout //evenly spaced dots not too close together 
	var player1IsPlaying = true;
//need this for taking turns 
	var g_PlayerScore = 0;
	var g_ComputerScore = 0;
	var g_GameOver = false;
//flag
//variable you define to have a value until a condition is true, and then the value is changed. allows checking of certain conditions while function happens 
//http://stackoverflow.com/questions/17402125/what-is-a-flag-variable


//object literal notation 
	var fillStyles = {
		dots:  "black",
		player1 : "yellow",
		player2 : "blue"
	}
//colors so that can only refer to names later on 

	function InitializeBoard(){
		console.log("running InitializeBoard()")

		ctx.fillStyle = fillStyles.dots;
//context ctx every time it uses canvas //canvas
		var pointList = [];
//need to make a new empty array to hold all the points 
		for(var i=0; i< boardHeight; i++ ){


			pointList.push(new Array());
			
//have to "push" a new array, no points given before this 
			for(var j=0; j < boardWidth; j++){
//supposed to use j ?? 
				ctx.beginPath();
				ctx.arc(startX + j*100, startY + i*100, dotRadius,0,2*Math.PI);
				//how to make a circle/arc 
				ctx.fill();
				ctx.closePath();
				pointList[i][j] = ({x: startX + j*100, y: startY + i*100});
//the location where it starts in the point list 
			}
		}

		return pointList;
	}

	function getCurrentColor(){
		console.log("running getCurrentColor()")
		if(player1IsPlaying) return fillStyles.player1;
		else return fillStyles.player2;
	}
//check to see if player 1 is playing and if so return fillStyles player 1
//if not return fillStyeles player 2 blue 

//?
	function Edge(start, end){
		console.log("running Edge()")
		this.start = start;
		this.end = end;
		this.isVisible = false;

		this.drawEdge = function(){
			ctx.strokeStyle = getCurrentColor();
			ctx.lineWidth=3;
			ctx.beginPath();
			ctx.moveTo(start.x,start.y);
			ctx.lineTo(end.x,end.y);
			ctx.stroke();
			ctx.closePath();
		}

	}

	function Box(edge1, edge2, edge3, edge4, start, end, id ){
		console.log("running Box()")
//functions as objetcts
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

//function constructor 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
		this.edge1 = edge1;
//this.edge identifying edge thtat has been clicked and defining edge 
// ".this" http://hangar.runway7.net/javascript/guide
//use function constructor to identify edge // give edge property ? 
		this.edge2 = edge2;
		this.edge3 = edge3;
		this.edge4 = edge4;
		this.start = start;
		this.end = end;
		this.id = id; // ? 
		this.owner = null;
//edge of box must not have an owner -- null -- to be clicked and listen for event listener,
//if not then a box can be clicked twice 

		this.isReady = function(){
			console.log("running Box.isReady()")

			var count = this.edge1.isVisible + this.edge2.isVisible + this.edge3.isVisible + this.edge4.isVisible;
			if(count === 4) return true;
			else return false;
//edge is ready to be filled when there is only one side  not visible 
		}

		this.autoComplete = function(){
			console.log("running Box.autoComplete()")

			this.edge1.isVisible = this.edge2.isVisible = this.edge3.isVisible = this.edge4.isVisible = true;
			this.isComplete();
//the box is complete when it checks all the edges 
		}

		this.isComplete = function(){
			console.log("running Box.isComplete()")
			if(this.owner == null) //not have an owner 
			{
				if(	this.edge1.isVisible && this.edge2.isVisible && this.edge3.isVisible && this.edge4.isVisible)
				{

						if(player1IsPlaying) g_PlayerScore++;
					//player2 not computer //leaving as computer so i dont have to change other varis //increase score by 1 
						else g_ComputerScore++; 
					
						this.owner = player1IsPlaying ? "PLAYER1" : "PLAYER2";
//tern op 
						//console.log("Box " + this.id + " is Complete");
						return "checkForMore";
			//are there other boxes to complete? check for box next door. dont know how to run function for it to check just the box next door
				}
				else return "no";
			}
			else return "yes";
			

		}

		this.drawBox = function(){
			console.log("running Box.drawBox()")
				ctx.fillStyle = (this.owner === "PLAYER1") ? fillStyles.player1 : fillStyles.player2; 
				//if the box is complete, fill it with player 1. is plaayer 1 playing? is so fillStyless.player1, if not fillStyles.play2
				ctx.beginPath();
				ctx.rect(this.start.x,this.start.y,DOTGAP,DOTGAP);
				// ?
				ctx.fill();	
				ctx.closePath();
				
		}

//?
	}


	function BuildHorzEdgeList(pointList){
		console.log("running BuildHorzEdgeList()")

		var edgeList = [];

		for(var i = 0; i < boardHeight; i++){
//for every row 
			for(var j = 0; j < boardWidth - 1; j++ ){
// for every collumn 
				edgeList.push(new Edge(pointList[i][j], pointList[i][j + 1])); 

			}

		}

		return edgeList;

	}
//same thing but for veritcal 

	function BuildVertEdgeList(pointList){
		console.log("running BuildVertEdgeList()")

		var edgeList = [];

		for(var j = 0; j < boardWidth; j++){

			for(var i = 0; i < boardHeight - 1; i++ ){

				edgeList.push(new Edge(pointList[i][j], pointList[i+1][j])); 

			}

		}

		return edgeList;

	}

	function BuildBoxList(){
		console.log("running BuildBoxList()")

		var boxList = [];
		var boxID = 0;
//multiply how many rows x number of elements in the row, + all the items in the row before point, (x,y) location 
// if it is a second one in a row, one row in fornt of it, it would be 3 + 1  so it would be 4 
		for(var i=0; i< boardHeight - 1; i++ ){
			for(var j=0; j < boardWidth - 1; j++){
				var horzEdge1Idx = (i * (boardWidth - 1)) + j;
//finding the edges, 2d rep 
				var horzEdge2Idx = (i + 1)* (boardWidth - 1) + j;
//have to figure out the location on the board. the math behind this  ^ 
				var vertEdge1Idx = (j * (boardHeight - 1) + i);
				

				var vertEdge2Idx = ((j + 1 )* (boardHeight - 1)) + i;


				boxList.push(new Box( 	horzEdgeList[horzEdge1Idx] , horzEdgeList[horzEdge2Idx], 
										vertEdgeList[vertEdge1Idx], vertEdgeList[vertEdge2Idx],
										pointList[i][j], pointList[i+1][j+1], boxID)); 
//location in the list 
//last line, canvas 
//box ID, separates the boxes, indexing them 

//need to know the diagonals so that it can create a square *** 

				boxID++;
//run through all the boxes
			}
		}

		return boxList;
	}


	function checkForGameOver(){
		console.log("running checkForGameOver()")
		var gameOver = true;
		for(var boxIdx = 0; boxIdx < boxList.length; boxIdx++){
			if(boxList[boxIdx].owner == null){
//null meaning box does not have an owner, therfore game is not over 
				gameOver = false;
				break;
			}
		}

		if(gameOver) { 
			displayGameOver();
		}

	}

	function HuntForClosure(){
		console.log("running HuntForClosure()")
//if a box is just completed, then needs to make sure that there is not another box to be closed 
		var closedNewBoxes = false;
		for(var searchIdx = 0; searchIdx < boxList.length; searchIdx++){
			
			if(boxList[searchIdx].isReady() === true)
			{
				boxList[searchIdx].autoComplete();
				boxList[searchIdx].drawBox();
				closedNewBoxes = true;
			}
		}

		//if(!closedNewBoxes && !player1IsPlaying)
		//DisplayRandomEdge();

		displayScore();

		return closedNewBoxes;

	}

	function displayScore(){
		console.log("running displayScore()")

		var el = document.getElementById('info');
		// Write the number into that element
		el.innerHTML = '<h2> You</h2><p>' + g_PlayerScore + '</p><h2> Computer </h2><p>' + g_ComputerScore + '</p>';

	}
//create an alert for the game to be over 
//msg makes alert come up way too many times ??? * 
	function displayGameOver(){
		console.log("running displayGameOver()")

		if(g_PlayerScore > g_ComputerScore){
			alert("Game Over. You Won!"); 
		}
//if player score is more than computer score, alert that they wont 
		else if(g_PlayerScore < g_ComputerScore)
			alert("Game Over. You Lost!"); 
//if computer score is greater than player score, alert that they won 
		else
			alert("Game Over. Its a tie!"); 
//if it does not meeet either of these conditions (aka it is a tie), alert that it is a tie  V 
		//alert(msg);

	}

	function PlayerMove(){
		console.log("running PlayerMove()")

		var win = false;

		for(var boxIdx = 0; boxIdx < boxList.length; boxIdx++)
		{
			if(boxList[boxIdx].isComplete() === "checkForMore")
			{
//if checkformore is true, hunt for other boxes to close 			
//bugg ** only need to check for box next to you rather than checking all sixteen boxes 
				win = HuntForClosure();

				boxList[boxIdx].drawBox();
				
			}

		}

		displayScore();

		checkForGameOver();
//check for game over every time boxes are complete 
		return win;

	}


	function togglePlayer(){
		console.log("running togglePlayer()")
		player1IsPlaying = !player1IsPlaying;
	}
//simpler way to write x%2 using 'toggle'/flag 
//player who completes a box needs to get to take another turn ***
//do not know how to make take another turn after completing box?? 


//if it is a win do not toggle player 
	function nextMove(){
		console.log("running nextMove()")
		if ( !PlayerMove() ){
			togglePlayer();
		}			
	}

	function toEdge(){
		console.log("running toEdge()")

		if (g_GameOver) return;
//flag usage; when this condition becomes true 
		console.log(this);
		if(this.id.charAt(0) === 'h'){
//know whether or not it is horizontal or vetical, strip the first letter 
//id.character.at h or v 
//char.at http://www.pageresource.com/jscript/jstring1.htm
			var stringIndex = this.id.substring(1);
			var index = Number(stringIndex);
			if(horzEdgeList[index].isVisible === false){
				horzEdgeList[index].drawEdge();
				horzEdgeList[index].isVisible = true;
			}
		}else if(this.id.charAt(0) === 'v'){
			var stringIndex = this.id.substring(1);
			var index = Number(stringIndex);
			if(vertEdgeList[index].isVisible === false){
				vertEdgeList[index].drawEdge();
				vertEdgeList[index].isVisible = true;
			}
		}

		var parent = this.parentNode;
		parent.removeChild(this);
//delete div from DOM so that it is not selectable again when hover
//must be on parent before removing child or else you would remove the thing that u are on 
		nextMove();
	}

	
//creating divs through javascript 
//http://stackoverflow.com/questions/6840326/how-can-i-create-and-style-a-div-using-javascript
//make edges appear through javascript when they are clicked on
//http://stackoverflow.com/questions/11395370/javascript-functions-to-show-and-hide-divs

//dom manipulation 
	function InitializeDOM(horzEdgeList, vertEdgeList){
		console.log("running InitializeDOM()")
//for each horizontal edge it is creating a new div 
		displayScore();

		for(var i = 0; i< horzEdgeList.length; i++){

			var newDiv = document.createElement('div');
//creates a div every time it clicks on an insibible edge 
			newDiv.id = "h" + i;
//gives divs an individual ID each time they are clicked on in order, so it starts at h0 and continues upwards i++ ex 
			newDiv.className = "stitchedHorizontal";
			
			newDiv.style.position = "absolute";
//gives all the divs an absolute position 			
			newDiv.style.left = horzEdgeList[i].start.x;
//divs need to start at the start point x and y, definied up top 			
			newDiv.style.top = horzEdgeList[i].start.y;
			
			document.body.appendChild(newDiv);

		}
//same notes as above for these 
		for(var i = 0; i< vertEdgeList.length; i++){

			//var newDivHTML = "<div id='v"+i+"' class='stitchedVertical' style='left:" + vertEdgeList[i].start.x + "; top:"+vertEdgeList[i].start.y + " ;' ></div>";
			//document.body.innerHTML += newDivHTML;

			var newDiv = document.createElement('div');
			
			newDiv.id = "v" + i;
			
			newDiv.className = "stitchedVertical";
			
			newDiv.style.position = "absolute";
			
			newDiv.style.left = vertEdgeList[i].start.x;
			
			newDiv.style.top = vertEdgeList[i].start.y;
			
			document.body.appendChild(newDiv);

		}

		//delegate event listener
		document.body.addEventListener("click", function (e) {
			if( e.target.classList.contains("stitchedVertical") || e.target.classList.contains("stitchedHorizontal") ) {
				toEdge.call( e.target );
			}
//e is event object 
		})
		
	}


	var pointList = InitializeBoard();
	var horzEdgeList = BuildHorzEdgeList(pointList);
	var vertEdgeList = BuildVertEdgeList(pointList);
	InitializeDOM(horzEdgeList,vertEdgeList);
	var boxList = BuildBoxList();

