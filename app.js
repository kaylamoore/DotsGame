
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	var dotRadius = 10;
	var boardWidth = 5;
	var boardHeight = 5;
//width x height of the board 
	var startX = 200;
	var startY = 100;
	var DOTGAP = 100; 
//layout
	var player1IsPlaying = true;
	var g_PlayerScore = 0;
	var g_ComputerScore = 0;
	var g_GameOver = false;
//flag


//object literal notation 
	var fillStyles = {
		dots:  "black",
		player1 : "yellow",
		player2 : "blue"
	}


	function InitializeBoard(){

		ctx.fillStyle = fillStyles.dots;

		var pointList = [];

		for(var i=0; i< boardHeight; i++ ){


			pointList.push(new Array());
			

			for(var j=0; j < boardWidth; j++){
				ctx.beginPath();
				ctx.arc(startX + j*100, startY + i*100, dotRadius,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
				pointList[i][j] = ({x: startX + j*100, y: startY + i*100});
			}
		}

		return pointList;
	}

	function getCurrentColor(){
		if(player1IsPlaying) return fillStyles.player1;
		else return fillStyles.player2;
	}

	function Edge(start, end){
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
//functions as objetcts
//function constructor 
		this.edge1 = edge1;
		this.edge2 = edge2;
		this.edge3 = edge3;
		this.edge4 = edge4;
		this.start = start;
		this.end = end;
		this.id = id;
		this.owner = null;

		this.isReady = function(){

			var count = this.edge1.isVisible + this.edge2.isVisible + this.edge3.isVisible + this.edge4.isVisible;
			if(count === 3) return true;
			else return false;

		}

		this.autoComplete = function(){

			this.edge1.isVisible = this.edge2.isVisible = this.edge3.isVisible = this.edge4.isVisible = true;
			this.isComplete();

		}

		this.isComplete = function(){
			if(this.owner == null)
			{
				if(	this.edge1.isVisible && this.edge2.isVisible && this.edge3.isVisible && this.edge4.isVisible)
				{

						if(player1IsPlaying) g_PlayerScore++;
					//player2 not computer
						else g_ComputerScore++; 
					
						this.owner = player1IsPlaying ? "PLAYER1" : "PLAYER2";
//tern op 
						//console.log("Box " + this.id + " is Complete");
						return "checkForMore";
				}
				else return "no";
			}
			else return "yes";
			

		}

		this.drawBox = function(){
				ctx.fillStyle = (this.owner === "PLAYER1") ? fillStyles.player1 : fillStyles.player2; 
				ctx.beginPath();
				ctx.rect(this.start.x,this.start.y,DOTGAP,DOTGAP);
				ctx.fill();	
				ctx.closePath();
				
		}


	}


	function BuildHorzEdgeList(pointList){

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


	function BuildVertEdgeList(pointList){

		var edgeList = [];

		for(var j = 0; j < boardWidth; j++){

			for(var i = 0; i < boardHeight - 1; i++ ){

				edgeList.push(new Edge(pointList[i][j], pointList[i+1][j])); 

			}

		}

		return edgeList;

	}

	function BuildBoxList(){

		var boxList = [];
		var boxID = 0;
//multiply how many rows x number of elements in the row, + all the items in the row before point, (x,y) location 
		for(var i=0; i< boardHeight - 1; i++ ){
			for(var j=0; j < boardWidth - 1; j++){
				var horzEdge1Idx = (i * (boardWidth - 1)) + j;
//finding the edges, 2d rep 
				var horzEdge2Idx = (i + 1)* (boardWidth - 1) + j;

				var vertEdge1Idx = (j * (boardHeight - 1) + i);
				

				var vertEdge2Idx = ((j + 1 )* (boardHeight - 1)) + i;


				boxList.push(new Box( 	horzEdgeList[horzEdge1Idx] , horzEdgeList[horzEdge2Idx], 
										vertEdgeList[vertEdge1Idx], vertEdgeList[vertEdge2Idx],
										pointList[i][j], pointList[i+1][j+1], boxID)); 
//location in the list 
//last line, canvas 
//box ID, separates the boxes, indexing them 

				boxID++;
//run through all the boxes
			}
		}

		return boxList;
	}


	function checkForGameOver(){
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
		//	DisplayRandomEdge();

		displayScore();

		return closedNewBoxes;

	}

	function displayScore(){

		var el = document.getElementById('info');
		// Write the number into that element
		el.innerHTML = '<h2> You</h2><p>' + g_PlayerScore + '</p><h2> Computer </h2><p>' + g_ComputerScore + '</p>';

	}

	function displayGameOver(){

		if(g_PlayerScore > g_ComputerScore){
			msg = "Game Over. You Won"; 
		}
		else if(g_PlayerScore < g_ComputerScore)
			msg = "Game Over. You Lost"; 
		else
			msg = "Game Over. Its a tie!"; 

		alert(msg);

	}

	function PlayerMove(){

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

		return win;

	}


	function togglePlayer(){
		player1IsPlaying = !player1IsPlaying;
	}
//simpler way to write x%2 using 'toggle'/flag 

//gets called when you complete an edge 
	function nextMove(){
		do{
			var win = PlayerMove();
		}while(win);
		
		togglePlayer();
		
	   do{
			var win = PlayerMove();
		}while(win);
		
		
		
	}

	function toEdge(){

		if (g_GameOver) return;

		if(this.id.charAt(0) === 'h'){
//know whether or not it is horizontal or vetical, strip the first letter 
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
//must be on parent before removing child
		nextMove();
	}

	
//creating divs through javascript 
//dom manipulation 
	function InitializeDOM(horzEdgeList, vertEdgeList){

		displayScore();

		for(var i = 0; i< horzEdgeList.length; i++){

			var newDiv = document.createElement('div');

			newDiv.id = "h" + i;
			
			newDiv.className = "stitchedHorizontal";
			
			newDiv.style.position = "absolute";
			
			newDiv.style.left = horzEdgeList[i].start.x;
			
			newDiv.style.top = horzEdgeList[i].start.y;
			
			newDiv.addEventListener('click', toEdge, false);
			
			document.body.appendChild(newDiv);

		}

		for(var i = 0; i< vertEdgeList.length; i++){

			var newDiv = document.createElement('div');
			
			newDiv.id = "v" + i;
			
			newDiv.className = "stitchedVertical";
			
			newDiv.style.position = "absolute";
			
			newDiv.style.left = vertEdgeList[i].start.x;
			
			newDiv.style.top = vertEdgeList[i].start.y;
			
			newDiv.addEventListener('click', toEdge, false);
			
			document.body.appendChild(newDiv);

		}
		
	}


	var pointList = InitializeBoard();
	var horzEdgeList = BuildHorzEdgeList(pointList);
	var vertEdgeList = BuildVertEdgeList(pointList);
	InitializeDOM(horzEdgeList,vertEdgeList);
	var boxList = BuildBoxList();

