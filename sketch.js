var dog,sadDog,happyDog, database;
//buttons
var feedFood,addFood;
//bottles
var foodS,foodStock,foodObj;
//to show last fed time
var today = new Date();
var fed,lastFed;
var time = today.getHours() + ":" + today.getMinutes();

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  fed = database.ref("FeedTime");
  fed.on("value",function(data){
    lastFed = data.val();
  });

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedFood=createButton("Give Food");
  feedFood.position(900,95);
  feedFood.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
 
  textSize(25);
  fill(0);
  if(lastFed>=12) {
    text("Last Fed: "+lastFed%12, 10, 30);
  } else if(lastFed===0) {
    text("Last Fed:- 12 AM", 10, 30);
  } else {
    text("Last Fed:- "+lastFed, 10, 30);
  }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  
  food_stock_val = foodObj.getFoodStock(); 

  if(food_stock_val <= 0){ 
    foodObj.updateFoodStock(food_stock_val *0); 
  }else{ 
    foodObj.updateFoodStock(food_stock_val -1); 
  } 
  foodS = foodS-1;
  
  database.ref('/').update({
    Food:foodS,
    FeedTime: time
  })
}

function addFoods(){
  dog.addImage(sadDog);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
