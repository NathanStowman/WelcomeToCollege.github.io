var stage;
var eventContainer;
var player;
var time;

function timeCreate() {
    var time = {};
    time.hour = 00;
    time.day = 00;

    function changeHour(hours) {
        time += hours;
        if (time > 24) {
            day++;
            time -= 24;
            //decay function
            player.newDay();
        }
    }
    return time;
}


function playerCon() {
	var player = {};
    //player subjects
    player.math = new subjectConst("Math", 00, 00);
    player.science = new subjectConst("Science", 00, 100);
    player.literature = new subjectConst("Literature", 00, 200);
    player.history1 = new subjectConst("History", 00, 300); //for some reason history is already a variable? Potentially from createjs so use history1 to avoid conflicting variables. Or I could be crazy.

    //I'm expecting mods to be upgraded with levels and money. The mods are floats so we can change either the gain or the decay by a percentage.

    //sleeping mods
    player.energy = 100;
    player.energyMod = 1; //for gaining energy
    player.energyDkmod = 1; //for the decay of energy
    //eating mods
    player.hunger =100;
    player.hungerMod = 1;
    player.hungerDkmod = 1;
    //social mods
    player.happiness=100;
    player.happymod=1;
    player.happyDkmod=1;
    //money mods
    player.money= 500;
    player.moneyMod =1;
    player.moneyDkmod=1;
    //player xp for mods.
    player.xp =0;
    player.lvl = 1

    //Create fancy UI graphics for lvl, xp, energy, hunger, happiness, and money.


    //creates the subject and makes the graphics
    function subjectConst(subName, subx, suby) {
        var subject = {};
        subject.lvl = 1;
        subject.exp = 0;
        subject.dKmod = 20;
        subject.studMod = 20;
        //subject.studied = false;

        //graphics
        subject.display = new createjs.Container();
        subject.display.set({ x: subx, y: suby });
        var chargeBar = CJSS.createChargeBar({ emptyBar: true, height: 30, width: 100, xPos: 30, yPos: 55, borderColor: "#114852", borderStroke: 5, barColor: "#7A959A" });
        var box = CJSS.createBox({ width: 170, height: 100, backgroundColor: "#2C616B", borderColor: "#01343D", borderStroke: 10 });
        var text = new createjs.Text(subName + " " + subject.lvl, ("30px Geneva"), "#7A959A");
        text.set({ x: 40, y: 15 });

        subject.display.addChild(box);
        subject.display.addChild(chargeBar);
        subject.display.addChild(text);



        //funcitons beyond this point.
        subject.decay = function () {

                //subtracts the exp
                subject.exp = subject.exp - subject.lvl * subject.dKmod;

                //checks the exp for being too low and modifies the lvl
                if (subject.exp < 1 && subject.lvl > 1) {
                    subject.exp = subject.exp + 100;
                    subject.lvl -= 1;
                    //subject.studied = false;
                    chargeBar.setChargePercent(subject.exp);
                    text.text = subName + " " + subject.lvl;
                    return subject;
                }

                //makes sure the level doesn't drop below 1
                if (subject.lvl == 1 && subject.exp < 1) {
                    subject.exp = 1;

                }
                chargeBar.setChargePercent(subject.exp);


            return subject;
        }

        //the study
        subject.study = function (hours) {
            //subject.studied = true;
            //adds the xp
            subject.exp = subject.exp + ((subject.studMod*hours) / subject.lvl);

            //switches the char's level if the  xp is too high
            if (subject.exp > 100 && subject.lvl < 10) {
                subject.exp = subject.exp - 100;
                subject.lvl += 1;
                chargeBar.setChargePercent(subject.exp);
                text.text = subName + " " + subject.lvl;
                return subject;
            }
            //makes sure the character's level doesn't go ballistic.
            if (subject.lvl == 10 && subject.exp > 100) {
                subject.exp = 100;

            }
            chargeBar.setChargePercent(subject.exp);
            return subject;
        }

        return subject;
    }

    //Player Actions
    //eat allows player to go into debt
    player.eat = function(){
        player.hunger += Math.floor(30 * player.hungerMod);

        if (player.hunger > 100) {
            player.hunger = 100;
        }
        player.money -= Math.floor(5*player.moneyDkmod);
    }
    //study
    player.study = function (hours, sub) {
        if (player.energy > 7 * hours * player.energyDkmod && player.hunger > 4 * hours * player.hungerDkmod && player.happiness > 3 * hours * player.happyDkmod) {
            //will always be changed in this order
            player.energy -= Math.floor(hours * 7 * player.energyDkmod);
            player.hunger -= Math.floor(hours * 4 * player.hungerDkmod);
            player.happiness -= Math.floor(hours * 3 * player.happymod);
            time.changeHour(hours);
            //call study events
            if (subject == 1) {
                player.math.study(hours);
            }
            if(subject == 2){
                player.science.study(hours);
            }
            if(subject == 3){
                player.literature.study(hours);
            }
            if(subject == 4){
                player.history1.study(hours);
            }
        }
            //tells the player what's wrong.
        else {
            if (player.energy < 5 * hours * player.energyDkmod) {
                notEnoughEnergy();
            }
            if (player.hunger < 4 * hours * player.hungerDkmod) {
                notEnoughFood();
            }
            if (player.happiness < 3 * hours * player.happyDkmod) {
                notEnoughHappiness();
            }
        }
    }
    //work
    player.work = function (hours) {
        if (player.energy > 5 * hours * player.energyDkmod && player.hunger > 4 * hours * player.hungerDkmod && player.happiness > 7 * hours * player.happyDkmod) {
            player.money += Math.floor(hours * 8 * player.moneyMod);
            //will always be changed in this order
            player.energy -= Math.floor(hours * 5 * player.energyDkmod);
            player.hunger -= Math.floor(hours * 4 * player.hungerDkmod);
            player.happiness -= Math.floor(hours * 7 * player.happymod);
            time.changeHour(hours);
            //call work events once working
        }
            //tells the player what's wrong.
        else {
            if (player.energy < 5 * hours * player.energyDkmod) {
                notEnoughEnergy();
            }
            if (player.hunger < 4 * hours * player.hungerDkmod) {
                notEnoughFood();
            }
            if (player.happiness < 7 * hours * player.happyDkmod) {
                notEnoughHappiness();
            }
        }
    }
    //class
    player.goToClass = function(){
	if (player.energy > 7 * hours * player.energyDkmod && player.hunger > 4 * hours * player.hungerDkmod && player.happiness > 3 * hours * player.happyDkmod && time.hour = 9) {
	            //will always be changed in this order
	            player.energy -= Math.floor(hours * 7 * player.energyDkmod);
	            player.hunger -= Math.floor(hours * 4 * player.hungerDkmod);
	            player.happiness -= Math.floor(hours * 3 * player.happymod);
	            time.changeHour(5);

	            player.math.study(Math.floor(Math.random()*3 + 1));
			    player.science.study(Math.floor(Math.random()*3 + 1));
			    player.literature.study(Math.floor(Math.random()*3 + 1));
	    		player.history1.decay(Math.floor(Math.random()*3 + 1));
	    		//call class events
	        }
	            //tells the player what's wrong.
	        else {
	            if (player.energy < 7 * hours * player.energyDkmod) {
	                notEnoughEnergy();
	            }
	            if (player.hunger < 4 * hours * player.hungerDkmod) {
	                notEnoughFood();
	            }
	            if (player.happiness < 3 * hours * player.happyDkmod) {
	                notEnoughHappiness();
	            }
	            if(time.hour != 9) {
					notClass();
				}
        }
    }
    //social
    player.socialize = function(time){
		        if (player.energy > 2 * hours * player.energyDkmod && player.hunger > 4 * hours * player.hungerDkmod) {
		            player.money -= Math.floor(hours * 6 * player.moneyDkmod);
		            //will always be changed in this order
		            player.energy -= Math.floor(hours * 2 * player.energyDkmod);
		            player.hunger -= Math.floor(hours * 4 * player.hungerDkmod);
		            player.happiness += Math.floor(hours * 8 * player.happymod);
		            time.changeHour(hours);
		            //call social events
		        }
		            //tells the player what's wrong.
		        else {
		            if (player.energy < 5 * hours * player.energyDkmod) {
		                notEnoughEnergy();
		            }
		            if (player.hunger < 4 * hours * player.hungerDkmod) {
		                notEnoughFood();
		            }
		        }

	   }

    //sleep
	player.sleep = function(hours){
				if (player.hunger > 4 * hours * player.hungerDkmod) {
		            //will always be changed in this order
		            player.energy += Math.floor(hours * 10 * player.energyMod);
		            player.hunger -= Math.floor(hours * 4 * player.hungerDkmod);
		            player.happiness += Math.floor(hours * 2 * player.happymod);
		            time.changeHour(hours);
		            //call social events
		        }
		            //tells the player what's wrong.
		        else {
		            if (player.hunger < 4 * hours * player.hungerDkmod) {
		                notEnoughFood();
		            }
		        }
	}





    //new day function to deal with daily decay of knowledge
	player.newDay = function () {
	    player.math.decay();
	    player.science.decay();
	    player.literature.decay();
	    player.history1.decay();
	}





    return player;

}

function init() {
    stage = new createjs.Stage("canvas");
    //allows for asset library
    CJSS.setStage({ stage: stage });

    //create the player and the time!
    player = playerCon();
    time = timeCreate();


    //display the subject chargebars and whatnot
    stage.addChild(player.math.display);
    stage.addChild(player.science.display);
    stage.addChild(player.literature.display);
    stage.addChild(player.history1.display);

    //create ticker for updating animations and whatnot.
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', tick);

    //create a container for the event system.
    eventContainer = new createjs.Container();
    stage.addChild(eventContainer);

    //test event
    testEvent();

}

function tick() {
    //math.study is temporary for checking. Soon to be replaced with fun buttons for play testing.
    player.math.study();
    stage.update();
}

