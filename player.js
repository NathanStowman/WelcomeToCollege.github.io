function Player(character) {
    var player = {};
    player.character = character;
    //player subjects
    player.math = new Subject("Math", 0, 515);
    player.science = new Subject("Science", 230, 515);
    player.literature = new Subject("Literature", 0, 615);
    player.history1 = new Subject("History", 230, 615); //for some reason history is already a variable? Potentially from createjs so use history1 to avoid conflicting variables. Or I could be crazy.

    //I'm expecting mods to be upgraded with levels and money. The mods are floats so we can change either the gain or the decay by a percentage.

    //sleeping mods
    player.energy = new personalHealth("Energy", 1010, 515);

    //eating mods
    player.hunger = new personalHealth("Hunger", 1010, 615);
    //social mods
    player.happiness = new personalHealth("Happiness", 780, 615);
    //money mods
    player.money = Money(780, 515);
    //player xp for mods.
    player.xp =0;
    player.lvl = 1

    //Create fancy UI graphics for lvl, xp, energy, hunger, happiness;

    function personalHealth(healthName, healthX, healthY, needsBar) {
        var health = {};
        health.total = 100;
        health.dKmod = 1.0;
        health.helpMeMod = 1.0;



        //graphics
        health.display = new createjs.Container();
        health.display.set({ x: healthX, y: healthY });
            var chargeBar = CJSS.createChargeBar({ emptyBar: true, height: 30, width: 170, xPos: 30, yPos: 55, borderColor: "#114852", borderStroke: 5, barColor: "#7A959A" });
            var box = CJSS.createBox({ width: 230, height: 100, backgroundColor: "#2C616B", borderColor: "#01343D", borderStroke: 10 });
            var text = new createjs.Text(healthName, ("30px Geneva"), "#ddf");
            text.maxWidth = 120;
            text.textAlign = "center";
            text.set({ x: 115, y: 15 });




        health.display.addChild(box);
        health.display.addChild(chargeBar);
        health.display.addChild(text);

        chargeBar.setChargePercent(health.total);


        health.update = function () {
            chargeBar.setChargePercent(health.total);
        }


        return health;
    }

    player.updateCharge = function() {
        player.energy.update();
        player.hunger.update();
        player.happiness.update();
    }


    function Money(moneyX, moneyY) {
        var money = {};
        money.total = 500;
        money.dKmod = 1.0;
        money.helpMeMod = 1.0;

        money.display = new createjs.Container();
        money.display.set({ x: moneyX, y: moneyY });
        var box = CJSS.createBox({ width: 230, height: 100, backgroundColor: "#2C616B", borderColor: "#01343D", borderStroke: 10 });
        money.text = new createjs.Text( "$" + money.total, ("60px Geneva"), "#ddf");
        money.text.maxWidth = 100;
        money.text.set({ x: 45, y: 15 });

        money.display.addChild(box);
        money.display.addChild(money.text);

        money.updateMoney = function () {
            money.text.text = "$" + money.total;
        }

        return money;
    }

    //creates the subject and makes the graphics
    function Subject(subName, subx, suby) {
        var subject = {};
        subject.lvl = 1;
        subject.exp = 0;
        subject.dKmod = 15;
        subject.studMod = 20;
        subject.subName = subName;
        //subject.studied = false;

        //graphics
        subject.display = new createjs.Container();
        subject.display.set({ x: subx, y: suby });
        var chargeBar = CJSS.createChargeBar({ emptyBar: true, height: 30, width: 170, xPos: 30, yPos: 55, borderColor: "#114852", borderStroke: 5, barColor: "#7A959A" });
        var box = CJSS.createBox({ width: 230, height: 100, backgroundColor: "#2C616B", borderColor: "#01343D", borderStroke: 10 });
        subject.text = new createjs.Text(subName + " " + subject.lvl, ("30px Geneva"), "#ddf");
        subject.text.maxWidth = 120;
        subject.text.textAlign = "center";
        subject.text.set({ x: 115, y: 15 });

        subject.display.addChild(box);
        subject.display.addChild(chargeBar);
        subject.display.addChild(subject.text);



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

    player.updateCash = function () {
        player.money.text = "$" + player.money.total;
    }

    player.updateLvls = function () {
        player.math.text.text = player.math.subName + " " + player.math.lvl;
	    player.science.text.text = player.science.subName + " " + player.science.lvl;
	    player.literature.text.text = player.literature.subName + " " + player.literature.lvl;
        player.history1.text.text = player.history1.subName + " " + player.history1.lvl;
    }

    //Player Actions
    //eat allows player to go into debt
    player.eat = function(cost){
        player.hunger.total += Math.floor(cost * 5 * player.hunger.helpMeMod);

        if (player.hunger.total > 100) {
            player.hunger.total = 100;
        }
        player.money.total -= Math.floor(cost * player.money.dKmod);
        player.money.updateMoney();
        player.updateCharge();
    }
    player.drink = function (cost) {
        player.hunger.total += Math.floor(10 * player.hunger.helpMeMod);
        player.energy.total += Math.floor(5 * player.energy.helpMeMod);

        if (player.hunger.total > 100) {
            player.hunger.total = 100;
        }

        if (player.energy.total > 100) {
            player.energy.total = 100;
        }
        player.money.total -= Math.floor(cost * player.money.dKmod);
        player.money.updateMoney();
        player.updateCharge();
    }
    //study
    player.study = function (hours, subject) {
        if (player.energy.total >= 7 * hours * player.energy.dKmod && player.hunger.total >= 4 * hours * player.hunger.dKmod && player.happiness.total >= 3 * hours * player.happiness.dKmod) {
            //will always be changed in this order
            player.energy.total -= Math.floor(hours * 7 * player.energy.dKmod);
            player.hunger.total -= Math.floor(hours * 4 * player.hunger.dKmod);
            player.happiness.total -= Math.floor(hours * 3 * player.happiness.dKmod);
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
            if (player.energy.total < 7 * hours * player.energy.dKmod) {
                eventSystem.notEnoughEnergy();
            }
            if (player.hunger < 4 * hours * player.hunger.dKmod) {
                eventSystem.notEnoughFood();
            }
            if (player.happiness.total < 3 * hours * player.happiness.dKmod) {
                eventSystem.notEnoughHappiness();
            }
        }
        player.updateCharge();
    }
    //work
    player.work = function (hours) {
        if (player.energy.total >= 5 * hours * player.energy.dKmod && player.hunger.total >= 4 * hours * player.hunger.dKmod && player.happiness.total >= 7 * hours * player.happiness.dKmod) {
            player.money.total += Math.floor(hours * 8 * player.money.helpMeMod);
            //will always be changed in this order
            player.energy.total -= Math.floor(hours * 5 * player.energy.dKmod);
            player.hunger.total -= Math.floor(hours * 4 * player.hunger.dKmod);
            player.happiness.total -= Math.floor(hours * 7 * player.happiness.dKmod);
            time.changeHour(hours);
            player.money.updateMoney();
            //call work events once working

        }
            //tells the player what's wrong.
        else {
            if (player.energy.total < 5 * hours * player.energy.dKmod) {
                eventSystem.notEnoughEnergy();
            }
            if (player.hunger.total < 4 * hours * player.hunger.dKmod) {
                eventSystem.notEnoughFood();
            }
            if (player.happiness.total < 7 * hours * player.happiness.dKmod) {
                eventSystem.notEnoughHappiness();
            }
        }
        player.updateCharge();
    }
    //class
    player.goToClass = function () {
        hours = 5;
        if (player.energy.total >= 7 * hours * player.energy.dKmod && player.hunger.total >= 4 * hours * player.hunger.dKmod && player.happiness.total >= 3 * hours * player.happiness.dKmod && time.hour == 9 && (time.day % 7 != 0 || 6)) {
            //will always be changed in this order
            player.energy.total -= Math.floor(hours * 7 * player.energy.dKmod);
            player.hunger.total -= Math.floor(hours * 4 * player.hunger.dKmod);
            player.happiness.total -= Math.floor(hours * 3 * player.happiness.dKmod);
            time.changeHour(5);

            player.math.study(Math.floor(Math.random()*3 + 1));
            player.science.study(Math.floor(Math.random()*3 + 1));
            player.literature.study(Math.floor(Math.random()*3 + 1));
            player.history1.study(Math.floor(Math.random()*3 + 1));
            //call class events
        }
            //tells the player what's wrong.
        else {
            if (player.energy.total < 7 * hours * player.energy.dKmod) {
                eventSystem.notEnoughEnergy();
            }
            if (player.hunger.total < 4 * hours * player.hunger.dKmod) {
                eventSystem.notEnoughFood();
            }
            if (player.happiness.total < 3 * hours * player.happiness.dKmod) {
                eventSystem.notEnoughHappiness();
            }
            if(time.hour != 9) {
                eventSystem.notClass();
            }
        }
        player.updateCharge();
    }
    //social
    player.socialize = function(hours){
        if (player.energy.total >= 2 * hours * player.energy.dKmod && player.hunger.total >= 4 * hours * player.hunger.dKmod) {
            player.money.total -= Math.floor(hours * 6 * player.money.dKmod);
            player.money.updateMoney();
            //will always be changed in this order
            player.energy.total -= Math.floor(hours * 2 * player.energy.dKmod);
            player.hunger.total -= Math.floor(hours * 4 * player.hunger.dKmod);
            player.happiness.total += Math.floor(hours * 8 * player.happiness.dKmod);
            if (player.happiness.total > 100) {
                player.happiness.total = 100;
            }
            time.changeHour(hours);

            //call social events
        }
            //tells the player what's wrong.
        else {
            if (player.energy.total < 2 * hours * player.energy.dKmod) {
                eventSystem.notEnoughEnergy();
            }
            if (player.hunger.total < 4 * hours * player.hunger.dKmod) {
                eventSystem.notEnoughFood();
            }
        }
        player.updateCharge();
    }

    //sleep
    player.sleep = function(hours){
        if (player.hunger.total >= 4 * hours * player.hunger.dKmod) {
            //will always be changed in this order
            player.energy.total += Math.floor(hours * 10 * player.energy.dKmod);
            player.hunger.total -= Math.floor(hours * 4 * player.hunger.dKmod);
            player.happiness.total += Math.floor(hours * 1 * player.happiness.helpMeMod);
            time.changeHour(hours);
            if (player.energy.total > 100) {
                player.energy.total = 100;
            }
            if (player.happiness.total > 100) {
                player.happiness.total = 100;
            }
            //call sleep events
            eventSystem.sleepEvents();
        }
            //tells the player what's wrong.
        else {
            if (player.hunger.total < 4 * hours * player.hunger.dKmod) {
                eventSystem.notEnoughFood();
            }
        }
        player.updateCharge();
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