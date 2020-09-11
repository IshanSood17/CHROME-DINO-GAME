  //creating some variables
  var trex, trex_running, trex_collided;
  var ground, groundimage, invisibleground;
  var cloud, cloud_image;
  var obstacle, obs1, obs2, obs3, obs4, obs5, obs6;
  var score = 0;
  var jump, win;
  var obstaclesGroup, CloudsGroup;
  var START = 0;
  var PLAY = 1;
  var END = 2;
  var gameState = PLAY && START && END;
  var gameover_image, restart_image, gameover, restart;
  var checkPoint;  
  var playBtn, playBtn_image;
  var title, title_image;
  var Trex, Trex_running;

function preload() {
  
  //loading all the animations  
  trex_running=loadAnimation("trex1.png", "trex3.png",    "trex4.png"); 
  trex_collided=loadAnimation("trex_collided.png");  
  groundimage=loadImage("ground2.png");
  cloud_image=loadImage("cloud.png");
  obs1=loadImage("obstacle1.png");
  obs2=loadImage("obstacle2.png");
  obs3=loadImage("obstacle3.png");
  obs4=loadImage("obstacle4.png");
  obs5=loadImage("obstacle5.png");
  obs6=loadImage("obstacle6.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  gameover_image=loadImage("gameover2.png");
  restart_image=loadImage("restart.png");
  checkPoint = loadSound("checkPoint.mp3");
  playBtn_image = loadImage("Play Btn.png");
  title_image = loadImage("title.png");
  Trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  } 

function setup() {
  
//creating the canvas  
createCanvas(600, 200);  

  //creating the trex  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale=0.5;

  //setting a collider radius for trex
  trex.setCollider("circle", 0, 0, 40);
  trex.debug=false;
  
  //creating the ground
  ground = createSprite(200,180,400,20);  
  ground.addImage("Ground", groundimage); 
  
  //play button
  playBtn = createSprite(300, 150, 10, 10);    
  playBtn.addImage("start", playBtn_image);    
  playBtn.scale=0.1;    
  playBtn.visible=true;
 
  //Trex icon
  Trex = createSprite(160, 70, 100, 100); 
  Trex.addAnimation("running", Trex_running);
  Trex.scale=0.5;
    
 //Title 
  title = createSprite(300, 70, 10, 10); 
  title.addImage("start", title_image);
  title.scale=0.1; 
  
  //creating an invisible ground
  invisibleground = createSprite(200, 195, 400, 20);
  invisibleground.visible=false;
  
  
  //groups
  obstaclesGroup = new Group();
  CloudsGroup = new Group();
  } 


function draw() {
  
//background of the screen  
background("white");
  
  //displaying the score
  fill("black");
  textSize(20);
  text("HI , YOUR SCORE IS = " + score, 180, 20);
  
if (gameState===START) {
 
  //loading screen
  trex.visible=false;
  ground.visible=false;
  
  //creating a rectangle
  noStroke();
  fill("white");
  rect(0, 0, 1000, 30);
  
  //making the game start when mousePressed on play button
  if (mousePressedOver(playBtn)) {
  gameState=PLAY;    
 }
}
  
  //making the trex move on the invisible ground  
  trex.collide(invisibleground);  

  if (gameState===PLAY) {
  
  //making all the loading screen icons invisible  
  playBtn.visible=false;
  title.visible=false;
  Trex.visible=false;  
  rect.visible=false;
    
  //making the trex and ground visible when game starts  
  trex.visible=true;
  ground.visible=true;  
    
  //making the ground move  
  ground.velocityX=-(6+3*score/100);  
    
  //making the trex jump on pressing space key 
  if (keyDown("space") && trex.y >= 150) {
  trex.velocityY=-15;  
  jump.play();  
  }
    
  //adding a gravity to trex  
  trex.velocityY = trex.velocityY+1.5; 
  
  //making the ground reset if it crosses half its width  
  if (ground.x<0) {
  ground.x = ground.width / 2; 
  } 
  
  //checkPoint sound  
  if (score>0 && score%100===0) {
  checkPoint.play();
  }
    
  //spawn clouds and obstacles
  spawnClouds();
  spawnObstacles();  
   
  //updating the score  
  score=score+Math.round(getFrameRate()/60);  
  
  //making the game over   
  if (obstaclesGroup.isTouching(trex)) {
  gameState = END; 
  trex.changeAnimation("collided", trex_collided);
  restart = createSprite(300, 130, 30, 10); 
  restart.addImage("restart", restart_image); 
  restart.scale=0.5;
    
  gameover = createSprite(300, 80, 20, 20);
  gameover.addImage("over", gameover_image);
  gameover.scale = 0.9; 
  die.play();  
  }  
  }
  
  else if (gameState===END) {
  
  //making the ground stop  
  ground.velocityX=0; 
  
  //making velocity of groups = 0  
  obstaclesGroup.setVelocityXEach(0);  
  CloudsGroup.setVelocityXEach(0); 
  
  //lifetime   
  obstaclesGroup.setLifetimeEach(-1); 
  CloudsGroup.setLifetimeEach(-1);  
  
  //bugs  
  trex.veloctiyY=0; 
  trex.veloctiyX=0; 
  
  if (mousePressedOver(restart)) {
  reset();    
  }
  }        
  
  //displaying all the things on the screen  
  drawSprites();  
  }

//function to spawn clouds
function spawnClouds() {
  
  //making the cloud spawn at random heights  
  if (frameCount%60===0) {
  cloud = createSprite(600, 80, 20, 30);  
  cloud.addImage("cld", cloud_image);
  cloud.y=Math.round(random(60, 110));  
  cloud.scale=0.1;
  cloud.velocityX=-4;   
  cloud.lifetime=200;  
    
  //making the trex's depth more than the clouds  
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1;  
    
  CloudsGroup.add(cloud);  
  }    
  } 

//function to spawn obstacles
function spawnObstacles() {
  
if (frameCount%100===0) { 

  var obstacle = createSprite(600, 170, 10, 50);
  obstacle.velocityX=-(6+3*score/100);  

  var rand=Math.round(random(1, 6));  
  switch(rand) {
    case 1 :obstacle.addImage("obs", obs1);       
            break;
    case 2 :obstacle.addImage("obs", obs2);       
            break;
    case 3 :obstacle.addImage("obs", obs3);       
            break;
    case 4 :obstacle.addImage("obs", obs4);
            break;
    case 5 :obstacle.addImage("obs", obs5);
            break;
    case 6 :obstacle.addImage("obs", obs6);
            break;
   default:break;        
}  
obstacle.scale=0.7; 
obstacle.lifetime=150;  
obstaclesGroup.add(obstacle);  
console.log(rand);
}  
}  

function reset() {
score = 0;
gameState = PLAY;
obstaclesGroup.destroyEach();
CloudsGroup.destroyEach();  
gameover.destroy();
restart.destroy();  
trex.changeAnimation("running", trex_running);  
}