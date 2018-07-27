var canvas = document.getElementById('Game');
var contetx = canvas.getContext('2d');
var dx = 2;
var dy = 5;

var ball = {
	x : 120,
	y : 250,
	radius: 20,
};

var space ={
	x : 165,
	y : canvas.height - 10,
	speed : 35,
	width: 70,
	height :20,
	isMoivingLeft: false,
	isMoivingRight: false,
};

var brick={
	offsetX: 25,
	offsetY: 25,
	margin:  25,
	width: 70,
	height: 15,
	totalRow: 3,
	totalCol: 5,
};

var brickList = [];

	for (var i = 0;  i < brick.totalRow; i++	) {
 		for( var j = 0; j < brick.totalCol; j++){
 			brickList.push({
 				x: brick.offsetX + j * (brick.width + brick.margin),
 				y: brick.offsetY + i * (brick.height + brick.margin),
 				isBroken: false,
 			});
 		}
 	}

var isGameOver = false;
var isGameWin = false;
var userPoint = 0;
var showingWinScreen = false;
var maxScore = brick.totalCol * brick.totalRow;


// stop moving - when unoress key
document.addEventListener('keyup', function(event){
	if (event.keyCode == 37) {
		space.isMoivingLeft = false;
	}else if( event.keyCode == 39){
		space.isMoivingRight = false;
		
	}
});

//move - when press key
document.addEventListener('keydown', function(event){
	if (event.keyCode == 37) {
		space.isMoivingLeft = true;
	}else if( event.keyCode == 39){
		space.isMoivingRight = true;
		
	}
});

//color  canvans
function colorRect(leftX,topY, width,height, drawColor) {
	contetx.fillStyle = drawColor;
	contetx.fillRect(leftX,topY, width,height);
}
//color userPoint
function colorPoint(name,leftX,topY,  drawColor){
	contetx.fillStyle = drawColor;
	contetx.fillText(name,leftX,topY);
}
//draw o
function DrawBall() {
	contetx.beginPath();
	contetx.arc(ball.x,ball.y, ball.radius,0 ,  Math.PI * 2);
	contetx.fillStyle = 'white';
	contetx.fill();
	contetx.closePath();
}

//draw -
function DrawSpace() {
	contetx.beginPath();
	contetx.rect(space.x,space.y, space.width , space.height);
	contetx.fillStyle = 'white';
	contetx.fill();
	contetx.closePath();
}

//draw brick
//2 * OFFSET + 5 * WIDTH + 4 * MAGRIN = CANVAS.WIDTH 
//ROW 3 COL 5
 function DrawBrick(){
 	brickList.forEach(function(b){
 		if (!b.isBroken) {
 			contetx.beginPath();
 			contetx.rect(b.x,b.y, brick.width,brick.height);
 			contetx.fillStyle = 'white';
 			contetx.fill();
 			contetx.closePath();
 			}
 		});
 }

//ball cannot move out from canvanm
function handleBallBounce(){
	if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
		dx = -dx;
	}
	if (ball.y < ball.radius) {
		dy = -dy;
	}
}
//space cannot move out from canvanm
function HandleSpaceLimit(){
	if (space.x > canvas.width-space.width) {
		space.x = canvas.width-space.width
	}else if(space.x <0){
		space.x = 0;
	}
}
// update ball position
function UpdateBallPosition(){
	ball.x += dx;
	ball.y += dy;
}
// update space position
function UpdateSpacePositon(){
	if (space.isMoivingLeft) {
		space.x -= space.speed;
	} else if (space.isMoivingRight) {
		space.x += space.speed;
	}
}

//handle ball touch  - 
function handleBallTouchSpace(){
	if (ball.radius + ball.x >= space.x && ball.radius + ball.x <= space.x + space.width && 
		ball.y >= canvas.height-space.height ) {
		dy = -dy
	}
}

//hanlde ball touch brick
function handleBallTouchBrick(){
	brickList.forEach(function(b){
		if(!b.isBroken){
			if(ball.x >= b.x && ball.x <= b.x + brick.width && 
				ball.y + ball.radius >= b.y && ball.y - ball.radius  <= b.y +brick.height){
				dy =- dy;
				b.isBroken = true;
				userPoint ++;
				if (userPoint >= maxScore) {
					isGameWin = true;
					contetx.fillText("You Win", 175, 200);
					contetx.fillText("F5 to continue", 169, 300);
				}
			}
		}
	});
}

//ball touch ground and you will lose
function ballTouchGround(){
	if(ball.y > canvas.height - ball.radius){
		isGameOver =true;
	}
}

//start new game
function handleMouseClick(evt) {
	if(showingWinScreen) {
		userScore = 0;
		showingWinScreen = false;
	}
}

function draw(){
	if (!isGameOver) {
	
	contetx.clearRect(0,0, canvas.width,canvas.height);
	colorRect(0,0,canvas.width,canvas.height,'black');
	DrawBrick();
	DrawBall();
	DrawSpace();

	UpdateBallPosition();
	UpdateSpacePositon();

	handleBallBounce();
	handleBallTouchSpace();
	HandleSpaceLimit();
	handleBallTouchBrick();
	colorPoint(userPoint,10,20,'white');
	ballTouchGround();
	requestAnimationFrame(draw);
	}
	else{
		contetx.fillStyle = 'white';
		contetx.fillText("Game Over", 175, 200);
		contetx.fillText("F5 to continue", 169, 300);
		return;
	}
}

draw();