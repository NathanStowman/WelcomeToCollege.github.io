
function Events(player) {
    var eve = new createjs.Container();
    this.eventBox = eve;
    eve.visible = false;
    //tbd fixed and whatnot.
    stage.addChild(this.eventBox);

    var box = new createjs.Shape().set({ x: 0, y: 0 });
    box.graphics.beginFill("black").drawRect(0, 0, 1280, 720);
    box.alpha = .75;

    info = new createjs.Text("", ("30px Geneva"), "white");
    info.textAlign = "center";
    info.lineWidth = 1000;
    info.set({ x: 640, y: 220 });
    price1 = new createjs.Text("$100", ("40px Geneva"), "white");
    price1.textAlign = "center";
    price1.lineWidth = 1000;
    price1.set({ x: 1135, y: 250 });
    price2 = new createjs.Text("$200", ("40px Geneva"), "white");
    price2.textAlign = "center";
    price2.lineWidth = 1000;
    price2.set({ x: 95, y: 250 });
    //button to close event box
    var button = CJSS.createButton({
        text: "OK",
        action: function () {
            eve.visible = false;
            if (up1.visible == true) {
                eventSystem.setButtonsVisibility()
            };
            createjs.Sound.stop('WarIsHell');
            createjs.Sound.play('Fantasia', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);
        },
        xPos: 550,
        yPos: 360
    });

    //buttons for upgrades
    var up1 = CJSS.createButton({
        text: "Donepezil (What's My Name Again?)", action: function () {
            if (player.math.studMod < 30) {
                player.money.total -= 200;
                player.math.studMod += 1;
                player.science.studMod += 1;
                player.history1.studMod += 1;
                player.literature.studMod += 1;
                player.money.updateMoney();

            }
            else
            { this.modEvent();}

        }, xPos: 0, yPos: 300
    });
    var up2 = CJSS.createButton({
        text: "Adderall (Get Smart Fast!)", action: function () {
            if (player.math.dKmod > 5 ) {
                player.money.total -= 200;
                player.math.dKmod -= 1;
                player.science.dKmod -= 1;
                player.history1.dKmod -= 1;
                player.literature.dKmod -= 1;
                player.money.updateMoney();
            }
            else { this.modEvent(); }
        }, xPos: 0, yPos: 375
    });
    var up3 = CJSS.createButton({
        text: "Modafinil (Who Needs Sleep?)", action: function () {
            if (player.energy.helpMeMod < 2.0) 
            {
                player.money.total -= 100;
                player.energy.helpMeMod += .05;
                player.energy.dKmod -= .05;
                player.money.updateMoney();
            }
            else {
                this.modEvent();
            }
        }, xPos: 1040, yPos: 450
    });
    var up4 = CJSS.createButton({
        text: "Cocaine (Work Harder, Not Smarter!)", action: function () {
            if (player.money.helpMeMod < 2.0) {
                player.money.total -= 100;
                player.money.helpMeMod += .05;
                player.money.dKmod -= .05;
                player.money.updateMoney();
            }
            else {
                this.modEvent();
            }
        }, xPos: 1040, yPos: 525
    });
    var up5 = CJSS.createButton({ text: "Prozac (Makes You Happy!)", action: function () {
        if(player.happiness.helpMeMod < 2.0)
        {
            player.money.total -= 100;
            player.happiness.helpMeMod += .05;
            player.happiness.dKmod -= .05;
            player.money.updateMoney();
        }
        else {
            this.modEvent();
        }
    }, xPos: 1040, yPos: 300 });
    var up6 = CJSS.createButton({ text: "Amphetamine (What's Hunger?)", action: function () { 
        if(player.hunger.helpMeMod < 2.0)
        {
            player.money.total -= 100;
            player.hunger.helpMeMod += 0.05;
            player.hunger.dKmod -= 0.05;
            player.money.updateMoney();
        }
        else {
            this.modEvent();
        }
    }, xPos: 1040, yPos: 375 });

    //makes it so the upgrade buttons aren't visible in all event screens. Called in many places.
    up1.visible = false;
    up2.visible = false;
    up3.visible = false;
    up4.visible = false;
    up5.visible = false;
    up6.visible = false;
    price1.visible = false;
    price2.visible = false;

    //adds buttons and boxes to the event box
    this.eventBox.addChild(box);
    this.eventBox.addChild(up1, up2, up3, up4, up5, up6);
    this.eventBox.addChild(info, price1, price2);
    this.eventBox.addChild(button);

    //changes visibility for the upgrade buttons
    this.setButtonsVisibility = function () {
        up1.visible = !up1.visible;
        up2.visible = !up2.visible;
        up3.visible = !up3.visible;
        up4.visible = !up4.visible;
        up5.visible = !up5.visible;
        up6.visible = !up6.visible;
        price1.visible = !price1.visible;
        price2.visible = !price2.visible;
    }

    //allows player to modify their stats with moneyz
    this.upgradesEvent = function () {
        this.eventBox.visible = true;
        this.setButtonsVisibility();
        info.text = "UPGRADES!  \n \n Here you can buy upgrades to make your life easier... \n (Don't do drugs, kids!)";

    }

    //Tells the person that they maxed out mods
    this.modEvent = function () {
        this.eventBox.visible = true;
        info.text = "You have maxed out this mod. Cheater.";
    }


    //Test function
    this.testEvent = function(){
        //does the graphics stuff
        this.eventBox.visible = true;
        info.text = "You decided to literally try sleeping on it. Strangely enough the knowledge from your math textbook seeped into your brain. I call BS. \n (You gain a level in math!)";

    }
    
    //Sleep events
    this.sleepEvents = function() {

        if (Math.floor((Math.random() * 1) + 1) == 1) {
            var eventNum = Math.floor((Math.random() * 20) + 1);

            //set up the cases with all the text and stat modifiers
            //Stuff is going to need to be revamped.
            switch (eventNum) {
                case (1):
                    this.eventBox.visible = true;
                    info.text=("You had a great night of sleep and while dreaming of unicorns and rainbows somehow managed to get a full nights rest. \n(Full Energy!)  ");
                    player.energy.total = 100;

                    break;
                case (2):
                    this.eventBox.visible = true;
                    info.text=("You decided to literally try sleeping on it. Strangely enough the knowledge from your math textbook seeped into your brain. I call BS. \n(You gain a level in math!)");
                    player.math.lvl += 1;
                    player.updateLvls();
                    break;
                case (3):
                    this.eventBox.visible = true;
                    info.text=("The stuff you huffed today apperently was performance inhancing. Who knew? \n (You gain a level in science.)");
                    player.science.lvl += 1;
                    player.updateLvls();
                    break;
                case (4):
                    this.eventBox.visible = true;
                    info.text=("William Shakespeare decided to pay a visit to your dreams. \"Oh, had I but followed the arts!\" \n You gain a level in literature.)");
                    player.literature.lvl += 1;
                    player.updateLvls();
                    break;
                case (5):
                    this.eventBox.visible = true;
                    info.text=("Thomas Edison and Nikola Tesla duel it out in your dreams. \n (You gain a level in history.)");
                    player.history1.lvl += 1;
                    player.updateLvls();
                    break;
                case (6):
                    this.eventBox.visible = true;
                    info.text=("After waking up in the morning you check your mailbox and find a letter from G-Ma! She loves you and sends you cold hard cash. \n (You gain $200.)");
                    player.money.total += 200;
                    player.money.updateMoney();
                    break;
                case (7):
                    this.eventBox.visible = true;
                    info.text=("Oooh, a nigerian prince has sent you an email and needs a temporary loan! You are going to be rich! \n (You gain $10)");
                    player.money.total += 10;
                    player.money.updateMoney();
                    break;
                case (8):
                    this.eventBox.visible = true;
                    info.text=("Someone must have stumbled into your dorm last night after a heavy night of drinking. Pros: You found some of their cash. Cons: You also found some vomit.\n (You gain $100.)");
                    player.money.total += 100;
                    player.money.updateMoney();
                    break;
                case (9):
                    this.eventBox.visible = true;
                    info.text=("You wake up with a whole bunch of crumbs in your bed. You sigh heavily but realize you now don't have to pay for breakfast. You try not to think about where the food may have came from. \n (Your hunger bar is full.)");
                    player.hunger.total = 100;
                    break;
                case (10):
                    this.eventBox.visible = true;
                    info.text=("You had a great night of sleep and awake and refreshed ready for whatever college has to throw at you. \n (You gain a level!)");
                    player.lvl += 1;
                    break;
                case (11):
                    this.eventBox.visible = true;
                    info.text=("One student thought that their dorm room was the perfect place to use their Chemistry 1 skills and manufacture meth. It wasn't. The resulting explosion and emergency response services led to a poor night of sleep.\n (You have low energy.)");
                    player.energy.total = 15;
                    break;
                case (12):
                    this.eventBox.visible = true;
                    info.text=("You had a memory leak last night and forgot a fair amount about math. Woopies! \n (You lose a level in math.)");
                    if (player.math.lvl > 1) {
                        player.math.lvl -= 1;
                        player.updateLvls();
                    }
                    break;
                case (13):
                    this.eventBox.visible = true;
                    info.text=("One of you friends told you about pizzagate and you spent the night researching poorly written  conspiracy theories. \n (You lose a level in history.)");
                    if (player.history1.lvl > 1) {
                        player.history1.lvl -= 1;
                        player.updateLvls();
                    }
                    break;
                case (14):
                    this.eventBox.visible = true;
                    info.text = ("Who's Walden and why would I care about his pond? \n (You lose a level in literature.)");
                    if (player.literature.lvl > 1) {
                        player.literature.lvl -= 1;
                        player.updateLvls();
                    }
                    break;
                case (15):
                    this.eventBox.visible = true;
                    info.text=("You huffed way too many chemicals in chem class yesterday. \n (You lose a level in science.)");
                    if (player.science.lvl > 1) {
                        player.science.lvl -= 1;
                        player.updateLvls();
                    }
                    break;
                case (16):
                    this.eventBox.visible = true;
                    info.text=("You managed to screw up your taxes last year and now have to pay in. \n (You lose $200.)");
                    player.money.total -= 200;
                    player.money.updateMoney();
                    break;
                case (17):
                    this.eventBox.visible = true;
                    info.text=("A cat ran into your dorm room and ran out with a fat stack of cash. Literal cat burgaler. Who knew? \n (You lose $100)");
                    player.money.total -= 100;
                    player.money.updateMoney();
                    break;
                case (18):
                    this.eventBox.visible = true;
                    info.text=("You wake up in the morning spooned by a large intoxicated man. Huh... that's probably why you slept so poorly. \n (You are at half your usual energy.)");
                    player.energy.total = 50;
                    break;
                case (19):
                    this.eventBox.visible = true;
                    info.text=("You dropped out of your bed and slammed your head onto the hard ground. \n (You lose some xp)");
                    player.xp -= 20;
                    break;
                case (20):
                    this.eventBox.visible = true;
                    info.text=("In your dream you visit a \"club\" and decide to make it rain which turned out to be you throwing dollar bills into a toilet bowl. \n (You lose $150)");
                    player.money.total -= 200;
                    player.money.updateMoney();
                    break;
            }

        }

    }
    //Work Events
    this.workEvents = function() {

        if (Math.floor((Math.random() * 100) + 1) == 1) {
            var eventNum = Math.floor((Math.random() * 20) + 1);

            //set up the cases with all the text and stat modifiers
            switch (eventNum) {
                case (1):
                    this.eventBox.visible = true;
                    info.text=("You were the employee of the month and get a small bonus. \n (You gain $100)");
                    player.money.total += 100;
                    break;
                case (2):
                    this.eventBox.visible = true;
                    info.text=("The tontine you and your coworkers partook in paid out. Turns out there was a fire yesterday. \n (You gain $1000)");
                    player.money.total += 1000
                    break;
                case (3):
                    this.eventBox.visible = true;
                    info.text=("You gave a customers wallet back after he dropped it and walked off. \n (You gain 100 exp.)");
                    player.exp += 100;
                    break;
                case (4):
                    this.eventBox.visible = true;
                    info.text=("You flirted with a particularly cute customer today and it made the time fly by! \n (You gain full happiness.)");
                    player.happiness.total = 100;
                    break;
                case (5):
                    this.eventBox.visible = true;
                    info.text=("Your coworkers and boss were in a great mood today. Must have rubbed off on you or something. \n (You gain full energy.)");
                    player.energy.total = 100;
                    break;
                case (6):
                    this.eventBox.visible = true;
                    info.text=("One coworker brought in brownies. \n (You gain 20 happiness.)");
                    player.happiness += 20;
                    break;
                case (7):
                    this.eventBox.visible = true;
                    info.text=("One coworker brough in \"cosmic\" brownies. \n (You gain full happiness.) ");
                    player.happiness = 100;
                    break;
                case (8):
                    this.eventBox.visible = true;
                    info.text=("You were hit by a car on the way back from work. The driver said to keep this from going any further and handed you cash. \n (You gain $250)")
                    player.money += 250;
                    break;
                case (9):
                    this.eventBox.visible = true;
                    info.text=("One of your teachers was a customer and talked with you about your work. \n (You a level in SCIENCE!)");
                    player.science.lvl += 1;
                    break;
                case (10):
                    this.eventBox.visible = true;
                    info.text=("It was a good day. Sun was shining. Cthulu didn't show his face. Praise the sun! \n (You gain 40 happiness!)");
                    player.happiness += 40;
                    break;
                case (11):
                    this.eventBox.visible = true;
                    info.text=("You called a zim cowkin by the wrong pronoun and got chewed out by your boss. \n (You lose energy.)");
                    player.energy = 20;
                    break;
                case (12):
                    this.eventBox.visible = true;
                    info.text=("You met your doppleganger who stole your identity. What a small world. After confronting him he beat the bejeebers out of you. \n (You gained a ton of hunger.)");
                    player.hunger = 0;
                    break;
                case (13):
                    this.eventBox.visible = true;
                    info.text=("There was a riot at your workplace. It was a generally unhappy time. \n (You lose 20 happiness.)");
                    player.happiness -= 20;
                    break;
                case (14):
                    this.eventBox.visible = true;
                    info.text=("President Drumph was elected and you have to pay higher taxes. My advice is not to be poor. \n (You lose $200.)");
                    player.money -= 200;
                    break;
                case (15):
                    this.eventBox.visible = true;
                    info.text=("A man tried to rob the store but because the safe and drawer were locked he just stole your wallet. \n (You lose $50)");
                    player.money -= 50;
                    break;
                case (16):
                    this.eventBox.visible = true;
                    info.text=("There was an accident at work that involved a rodent, multiple shovels, a claymore, and the smell of burning flesh. \n (You lose happiness.)");
                    player.happiness = 5;
                    break;
                case (17):
                    this.eventBox.visible = true;
                    info.text=("A customer punched you so hard you swore you saw the back of your head. \n (You lose some experience.)");
                    player.exp -= 40;
                    break;
                case (18):
                    this.eventBox.visible = true;
                    info.text=("One of your coworkers decided to spew conspiracy theories the entire time you were working. \n (You lose a level in history)");
                    player.history1.lvl -= 1;
                    break;
                case (19):
                    this.eventBox.visible = true;
                    info.text=("The bosses child came in and tried flirting with you while your boss was in the room. You end up screaming and running out of the room. Smooth move X-lax. \n (Your boss took the tip jar's contents to buy something for his... spawn.)");
                    player.money -= 40;
                    break;
                case (20):
                    this.eventBox.visible = true;
                    info.text=("A customer threw up all over the bathroom and you got to clean it out. It wasn't all puke and you managed to add to the mess. \n (You lost your lunch.)");
                    player.hunger = 0;
                    break;
            }

        }

    }
    //Class Events
    this.classEvents = function() {

        if (Math.floor((Math.random() * 50) + 1) == 1) {
            var eventNum = Math.floor((Math.random() * 20) + 1);

            //set up the cases with all the text and stat modifiers
            switch (eventNum) {
                case (1):
                    this.eventBox.visible = true;
                    info.text = "You talked with a cute person while at the party. You touched the butt! \n (You gain full happiness) ";
                    player.happiness = 100;
                    break;
                case (2):
                    this.eventBox.visible = true;
                    info.text=("Well the party wasn't so much a party as a convention. Still you managed to have fun and even learn something! \n (You gain 50 experience.)");
                    player.exp += 50;
                    break;
                case (3):
                    this.eventBox.visible = true;
                    info.text = ("After a heavy night of drinking you somehow lost all social skills but became a savant in the process. \n (You gain a level in Math!)");
                    player.math.lvl += 1;
                    break;
                case (4):
                    this.eventBox.visible = true;
                    info.text = ("You meet a cat with $50 dollars in it's mouth. Strange. \n (You gain $50.)");
                    player.money += 50;
                    break;
                case (5):
                    this.eventBox.visible = true;
                    info.text = ("Somehow in your drunken state you ended up at the retirement home playing checkers with pensioners. They had some great stories and even better food! \n (You aren't hungry anymore.)");
                    player.hunger = 100;
                    break;
                case (6):
                    this.eventBox.visible = true;
                    info.text = ("Somehow you ended up making money over the course of the night... Don't think about it too hard. \n (You gain $40)");
                    player.money += 40;
                    break;
                case (7):
                    this.eventBox.visible = true;
                    info.text = ("Coke is a heck of a drug. \n (You gain full energy)");
                    player.energy = 100;
                    break;
                case (8):
                    this.eventBox.visible = true;
                    info.text = ("You raided the fridge of each house you visited last night. \n (You are nearly full. They are college students so obviously their fridges don't have much to raid.)");
                    player.hunger = 83;
                    break;
                case (9):
                    this.eventBox.visible = true;
                    info.text = ("You made good friends with a teaching assistant last night. \n (You gain a level in literature.)");
                    player.literature.lvl += 1;
                    break;
                case (10):
                    this.eventBox.visible = true;
                    info.text = ("You found a dog sitting party and even without a dog they welcomed you. \n (You gain full happiness.)");
                    player.happiness = 100;
                    break;
                case (11):
                    this.eventBox.visible = true;
                    info.text = ("Somehow you ended up speaking with a strange nihilistic dude just because you wanted to compliment his boots. \n (You lose some happiness)");
                    break;
                case (12):
                    this.eventBox.visible = true;
                    info.text = ("You somehow managed to get ghanaherpasiphilitis from a toilet seat.. It's a bad time. \n (You lose $200 in medical expenses.)");
                    break;
                case (13):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (14):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (15):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (16):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (17):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (18):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (19):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (20):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
            }

        }

    }
    //Study Events
    this.studyEvents = function() {

        if (Math.floor((Math.random() * 50) + 1) == 1) {
            var eventNum = Math.floor((Math.random() * 50) + 1);

            //set up the cases with all the text and stat modifiers
            switch (eventNum) {
                case (1):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (2):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (3):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (4):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (5):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (6):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (7):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (8):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (9):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (10):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (11):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (12):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (13):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (14):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (15):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (16):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (17):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (18):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (19):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (20):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
            }

        }

    }

    //Social Events
    this.socialEvents = function() {

        if (Math.floor((Math.random() * 50) + 1) == 1) {
            var eventNum = Math.floor((Math.random() * 20) + 1);

            //set up the cases with all the text and stat modifiers
            switch (eventNum) {
                case (1):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (2):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (3):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (4):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (5):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (6):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (7):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (8):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (9):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (10):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (11):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (12):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (13):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (14):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (15):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (16):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (17):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (18):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (19):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
                case (20):
                    this.eventBox.visible = true;
                    info.text = ("");
                    break;
            }

        }

    }


    this.notEnoughEnergy = function() {
        this.eventBox.visible = true;
        info.text = ("You cannot perform that action because you do not have the required amount of energy.");
    }
    this.notEnoughHappiness = function() {
        this.eventBox.visible = true;
        info.text = ("You cannot perform that action because you do not have the required amount of happiness.");
    }
   this.notEnoughFood = function() {
        this.eventBox.visible = true;
        info.text = ("You cannot perform that action because you do not have the required amount of food.");
    }
    this.notClass = function() {
        this.eventBox.visible = true;
        info.text = ("It's not time for class. Class starts at 9:00 am and get's out at 2:00 pm every day.");
    }

    //end of semester event. We could keep track of events and put all the information into graphs to show the player. WOAH Stats. It would be cool but take a lot of work.
    //Massive dialogue tree dependent upon debt and grades. Maybe on events?
    this.examEvent = function() {


        //Make this super smancy with a gpa calculator and multiple dialogue lines. It'll be great. Stroking out here.
        this.eventBox.visible = true;
        info.text = ("It's the end of the semester! The die has been cast and you see your final grades... \n\n\n\n\n\n\n Math " +
        checkGrade(player.math.lvl) +
        "\n Science " + checkGrade(player.science.lvl) +
        " \n Literature " + checkGrade(player.literature.lvl) +
        "\n History " + checkGrade(player.history1.lvl));


        function checkGrade(num) {
            if (num > 8) {
                return "A";
            }
            else if (num == 7) {
                return "B";
            }
            else if (num == 6) {
                return "C";
            }
            else if (num == 5) {
                return "D";
            }
            else {
                return "F";
            }
        }
    }
}