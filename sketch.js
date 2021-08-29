//crea las variables del t-rex y del piso
var trex, trex_running, edges;
var groundImage;
var CloudImage;
var nube;
var cactusImage1,cactusImage2,cactusImage3,cactusImage4;
var cactusImage5;
var trexCollided;
var cactus;
var score;
var ground;
var gameOver1;
var restart1;
var cactusGroup;
var cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound;
var dieSound;
var checkPointSound;
var reset;
var sun;
var sunImg;
var skyImg;

//precarga las imagenes y animaciones
function preload(){
  trex_running = loadAnimation("trex/trex_1.png","trex/trex_2.png",
  "trex/trex_3.png");
  trexCollided =
  loadAnimation("trex/trex_collided.png");
  groundImage = loadImage("fondo/ground.png")
  CloudImage = loadImage("fondo/cloud.png");
  cactusImage1 = loadImage("obstacle/obstacle1.png");
  cactusImage2 = loadImage("obstacle/obstacle2.png");
  cactusImage3 = loadImage("obstacle/obstacle3.png");
  cactusImage4 = loadImage("obstacle/obstacle4.png");
  gameOver1 = loadImage("game over/gameOver.png");
  restart1 = loadImage("game over/restart.png");
  jumpSound = loadSound("sonidos/jump.wav");
  dieSound = loadSound("sonidos/collided.wav");
  checkPointSound = loadSound("sonidos/checkPoint.mp3");
  sunImg = loadImage("fondo/sun.png");
  skyImg = loadImage("fondo/backgroundImg.png");
}


function setup(){
  //crea el espacio de trabajo
  createCanvas(windowWidth,windowHeight);
   
  score = 0;
  
  //crea el sprite del piso y hace que parezca infinito
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  
  //crea piso invisible
  invisibleFloor = createSprite(width/2,height+25,width,
  125);
  invisibleFloor.visible = false;
  
  //crea el Trex
  trex = createSprite(75,height-70,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trexCollided);
  trex.scale = 0.2;
  
  edges = createEdgeSprites();
  
  cactusGroup = new Group();
  cloudsGroup = new Group();
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOver1);
  gameOver.scale = 0.7
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restart1);
  restart.scale = 0.09
  restart.visible = false;
  
  sun = createSprite(width-100,125,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.25;
  }


function draw(){
  console.time();
  
  //establece un color de fondo 
  background(skyImg);
  
  var mensaje = "textChain";
  console.log(mensaje);
  
  if(gameState === PLAY){
    ground.velocityX = -(5 + score/100);
  if(ground.x < 0){
       ground.x = ground.width/2;
      }
  fill("black");
    text("score:" + score,500,30);
  score = score + Math.round(frameCount/60);
    if(score > 0 && score % 100 === 0){
       checkPointSound.play();
       }
  if((touches.lenght > 0 || keyDown("space")) &&     trex.y >= 
        height-120){
        trex.velocityY = -13;
        jumpSound.play();
      touches = [];
      }
  trex.velocityY = trex.velocityY + 0.7;
    spawnClouds();
  spawnCactus();
    restart.visible = false;
  gameOver.visible = false;
    trex.changeAnimation("running",trex_running);
  if(cactusGroup.isTouching(trex)){
        dieSound.play();
        gameState = END;
        }
    }    
  else if(gameState === END){
      if(mousePressedOver(restart)){
        console.log("a.");  
        reset();
      }
    ground.velocityX = 0;
      trex.velocityY = 0;
    trex.changeAnimation("collided",trexCollided);
      gameOver.visible = true
    restart.visible = true
      cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
      cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
      if(touches.lenght || keyDown("SPACE")){
        reset();
        touches = [];
      }
    }  
  
  trex.collide(invisibleFloor);
  
  console.log("this is",gameState);
  
  //ingresa la posición y del Trex
  console.log(trex.y)
  
  //muestra la posicion en x del suelo
  console.log(ground.x);
  
  //mensajes para la consola
  console.warn("cactus incoming");
  console.error("error");
  console.info("hola");
    
  //dibuja los sprites
  drawSprites();
  
  console.log(1+"+"+1);
  
  //finaliza el conteo del codigo de console.time
  console.timeEnd();
  
  //cuenta cuantas veces se ejecuta la function draw
  console.count();
}

function spawnClouds(){
  if(frameCount%60 === 0){
    nube = createSprite(width+20,height-300,40,10);
    nube.addImage(CloudImage);
    nube.y = Math.round(random(100,220));
    nube.scale = 0.7;
    nube.velocityX = -4;
    nube.lifetime = 300;
    nube.depth = trex.depth;
    trex.depth = trex.depth+1;
    cloudsGroup.add(nube);
  }
}


function spawnCactus(){
   if(frameCount%60 === 0){
    cactus = createSprite(600,height-95,20,30);
    cactus.velocityX = -(7 + score/100);
     
    var number = Math.round(random(1,4));
     switch(number){
     case 1: cactus.addImage(cactusImage1);
         break;
         
     case 2: cactus.addImage(cactusImage2);
         break;
         
     case 3: cactus.addImage(cactusImage3);
         break;
         
     case 4: cactus.addImage(cactusImage4);
         break;    
    }
    cactus.scale = 0.3;
    cactus.lifetime = 200;
    cactus.depth = trex.depth;
    trex.depth = trex.depth+1;
    cactusGroup.add(cactus);
   }
}

function reset(){
   gameState = PLAY;
     trex.changeAnimation("running",trex_running);
   restart.visible = false;
     gameOver.visible = false;
   cactusGroup.destroyEach();
     cloudsGroup.destroyEach();
   score = 0;
   }
