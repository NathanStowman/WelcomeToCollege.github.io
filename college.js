//Game Global Variables
{
    var stage;
    var STAGE_WIDTH = 1240;
    var STAGE_HEIGHT = 720;

    var preload;
    var time;
    var cutscenes = new Cutscenes();
    var behindPlayer = new createjs.Container();
    var beforePlayer = new createjs.Container();
    var eventSystem;
    var startScreen;
}

//Player and Room Global Variables
{
    //Character Object and Customizer
    var player;
    var playerChar;
    var playerCustomization;
    //Room Object
    var room;
}

/**
* Loads art and sound assets. Assigns them into the preload var for accessing.
* Category: System
**/
function load() {
    //Load System Initialization
    {
        preload = new createjs.LoadQueue();
        preload.installPlugin(createjs.Sound);
        createjs.Sound.alternateExtensions = ["ogg"];
        preload.addEventListener("complete", init);
    }

    //Load Manifest
    preload.loadManifest([
    //Start Assets
    { id: "WelcomeBanner",  src: "/assets/start/WelcomeBanner.png" },
    { id: "Backpiece",      src: "/assets/start/Backpiece.png" },

    //Character Assets
 	{ id: "BodyBase",               src: "/assets/character/BodyBase.png" },
 	{ id: "BodyOutline",            src: "/assets/character/BodyOutline.png" },
    { id: "Eyes",                   src: "/assets/character/Eyes100x150.png" },
    { id: "Feet",                   src: "/assets/character/Feet.png" },
    { id: "HandsBase",              src: "/assets/character/HandsBase.png" },
    { id: "HandsOutline",           src: "/assets/character/HandsOutline.png" },
 	{ id: "HairShoulderBase",       src: "/assets/character/HairShoulderBase.png" },
    { id: "HairShoulderOutline",    src: "/assets/character/HairShoulderOutline.png" },
    { id: "HairSpikeBase",          src: "/assets/character/HairSpikeBase.png" },
    { id: "HairSpikeOutline",       src: "/assets/character/HairSpikeOutline.png" },
    { id: "EarringHoopsBase",       src: "/assets/character/EarringHoopsBase.png" },
    { id: "EarringHoopsOutline",    src: "/assets/character/EarringHoopsOutline.png" },
    { id: "EyebrowPiercingBase",    src: "/assets/character/EyebrowPiercingBase.png" },
    { id: "EyebrowPiercingOutline", src: "/assets/character/EyebrowPiercingOutline.png" },
 	{ id: "MouthSmirk",             src: "/assets/character/MouthSmirk.png" },
    { id: "MouthSmile",             src: "/assets/character/MouthSmile.png" },
    { id: "MouthNeutral",           src: "/assets/character/MouthNeutral.png" },
    { id: "MouthBigSmile",          src: "/assets/character/MouthBigSmile.png" },
    { id: "Sleep",                  src: "/assets/character/Sleep20x30.png" },

    //Clothes Assets
    { id: "LowerBody",              src: "assets/clothes/LowerBody.png" },
    { id: "LowerCollar",            src: "assets/clothes/LowerCollar.png" },
    { id: "LowerTankTop",           src: "assets/clothes/LowerTankTop.png" },
    { id: "UpperBow",               src: "assets/clothes/UpperBow.png" },
    { id: "UpperButtons",           src: "assets/clothes/UpperButtons.png" },
    { id: "UpperChestStripe",       src: "assets/clothes/UpperChestStripe.png" },
    { id: "UpperShoulderStripe",    src: "assets/clothes/UpperShoulderStripe.png" },
    { id: "UpperTie",               src: "assets/clothes/UpperTie.png" },
    { id: "UpperVestClosed",        src: "assets/clothes/UpperVestClosed.png" },
    { id: "UpperVestOpen",          src: "assets/clothes/UpperVestOpen.png" },

    //Room Assets
    { id: "Room",           src: "/assets/room/RoomBeige.png" },
    { id: "FridgeOpen",     src: "/assets/room/MiniFridgeOpen.png" },
    { id: "FridgeClosed",   src: "/assets/room/MiniFridgeClosed.png" },
    { id: "DoorOpen",       src: "/assets/room/DoorOpen.png" },
    { id: "DoorClosed",     src: "/assets/room/DoorClosed.png" },
    { id: "Bed",            src: "/assets/room/Bed.png" },
    { id: "BedSheet",       src: "/assets/room/BedSheet.png" },
    { id: "Desk",           src: "/assets/room/Desk.png" },
    { id: "DeskChair",      src: "/assets/room/DeskChair.png" },
    { id: "Calendar",       src: "/assets/room/Calendar.png" },
    { id: "Clock",          src: "/assets/room/Clock.png" },
    { id: "Poster",         src: "/assets/room/UpgradePoster.png" },

    //Sound Assets
    { id: "Bite", src: "/assets/sounds/Bite.mp3" },
    { id: "Door", src: "/assets/sounds/Door.mp3" },
    { id: "Pen", src: "/assets/sounds/Pen.mp3" },
    { id: "Snoring", src: "/assets/sounds/Snoring.mp3" },

    //Music Assets
    { id: "Fantasia", src: "/assets/sounds/Fantasia.mp3" },
    { id: "SnowyForest", src: "/assets/sounds/SnowyForest.mp3" },
    { id: "WarIsHell", src: "/assets/sounds/WarIsHell.mp3" }
    ]);
    preload.load();
}

/**
* Performs initilialization for the project by creating various objects and adding them to the stage.
* Category: System
**/
function init() {
    stage = new createjs.Stage("canvas");
    CJSS.setStage({ stage: stage });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', tick);

    createjs.Sound.play('SnowyForest', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);
    startScreen = new StartScreen();

    player = new Player(new Character(580, 750));
    playerChar = player.character;
    stage.addChild(behindPlayer);
    stage.addChild(playerChar.sprite);
    stage.addChild(beforePlayer);

    room = new Room();
    room.hide();
    beforePlayer.addChild(room.beforeContainer);
    behindPlayer.addChild(room.behindContainer);

    time = new Time();

    room.behindContainer.addChild(time.calendarMark, time.monthDisplay, room.night, time.clockDisplay);
    room.beforeContainer.addChild(player.math.display, player.science.display, player.history1.display, player.literature.display,
        player.energy.display, player.hunger.display, player.happiness.display, player.money.display,
        time.dayDisplay.box, time.dayDisplay);

    eventSystem = new Events(player);

    playerCustomization = new CharacterCustomizer(playerChar);
    beforePlayer.addChild(playerCustomization.menu);

    cutscenes.StartGame();
}

/**
* Updates the stage display and calls various recurring animations/checks.
* Category: System
**/
function tick() {
    //Idle Animations
    if (!playerChar.performingAction) {
        if (Math.floor(createjs.Ticker.getTime() / 1000) % 5 == 0) {
            playerChar.eyes.gotoAndPlay("blink");
        }
        if (Math.floor(createjs.Ticker.getTime() / 1000) % 15 == 0) {
            playerChar.eyes.gotoAndPlay("lookSides");
        }
    }
    
    
    stage.update();
}

/**
* Keeps track of the time and day, and updates the displays of the clock and calendar.
* Category: System
**/
function Time() {
    //Time Variables
    {
        this.hour = 8;
        this.day = 1;
        this.week = 1;
        this.month = 8;
        this.am = true;
    }

    //Clock Display Variables
    {
        this.clockText = "";
        this.clockDisplay = new createjs.Text(this.clockText, "50px Courier", "limegreen");
        this.clockDisplay.set({ x: 557, y: 32 });
        this.clockDisplay.maxWidth = 120;
    }

    //Calendar Display Variables
    {
        this.dayDisplay = new createjs.Container();
        var dayText = new createjs.Text("Day", "60px Arial", "#fff");
        dayText.textAlign = "center";
        dayText.set({ x: STAGE_WIDTH / 2, y: 100 });
        var dayBack = CJSS.createBox({ width: 400, height: 110, xPos: STAGE_WIDTH / 2 - 200, yPos: 80, backgroundColor: "#58E", borderColor: "#fff" });
        this.dayDisplay.addChild(dayBack, dayText);
        this.dayDisplay.alpha = 0;

        this.monthDisplay = new createjs.Text("Month", "15px Arial", "#000");
        this.monthDisplay.set({ x: 174, y: 42 });
        this.monthDisplay.textAlign = "center";

        this.calendarMark = new createjs.Container();

        var left = new createjs.Shape();
        left.graphics.beginStroke("red");
        left.graphics.moveTo(0, 0).lineTo(3, 0).lineTo(8, 9).lineTo(5, 9).lineTo(0, 0);

        var right = new createjs.Shape();
        right.graphics.beginStroke("red");
        right.graphics.moveTo(5, 0).lineTo(8, 0).lineTo(3, 9).lineTo(0, 9).lineTo(5, 0);

        this.calendarMark.addChild(left, right);
    }
    
    //Clock Functions
    {
        //Updates the clock time display to match the current hour value.
        this.updateTimeText = function () {
            if (this.hour < 10) {
                this.clockText = "0" + this.hour + ":00";
                if (this.am) {
                    this.clockText += "AM";
                } else {
                    this.clockText += "PM";
                }
                this.clockDisplay.text = this.clockText;
            }
            else {
                this.clockText = this.hour + ":00";
                if (this.am) {
                    this.clockText += "AM";
                } else {
                    this.clockText += "PM";
                }
                this.clockDisplay.text = this.clockText;
            }
        }

        //Darken room for night time.
        this.nightTime = function () {
            if(((this.hour > 8 && this.hour != 12) && !this.am) || ((this.hour < 7 || this.hour == 12) && this.am)){
                room.night.visible = true;
            }
            else{
                room.night.visible = false;
            }
        }
        //Increases the hour value by 1.
        this.increaseHour = function () {
            this.hour++;
            if (this.hour == 12 && this.am) {
                this.am = false;
            }
            else if (this.hour == 12 && !this.am) {
                this.am = true;
                this.day++;

                if (this.day % 7 == 1) {
                    this.increaseWeek();
                }
                this.updateCalendarMark();
                this.displayDay();

                player.newDay();
            }
            if (this.hour > 12) {
                this.hour = 1;
            }

            this.updateTimeText();
            this.nightTime();
        }

        //Increases the hour value by the change parameter amount. Functionally only supports up to 12 hour increases.
        this.changeHour = function (change) {
            for (var i = 0; i < change; i++) {
                this.increaseHour();
            }
        }
    }

    //Calendar Functions
    {
        this.updateCalendarMark = function () {
            switch(this.day % 7){
                case (1):
                    this.calendarMark.set({ x: 118, y: 91 }); break;
                case (2):
                    this.calendarMark.set({ x: 135, y: 91 }); break;
                case (3):
                    this.calendarMark.set({ x: 153, y: 91 }); break;
                case (4):
                    this.calendarMark.set({ x: 172, y: 91 }); break;
                case (5):
                    this.calendarMark.set({ x: 191, y: 91 }); break;
                case (6):
                    this.calendarMark.set({ x: 210, y: 91 }); break;
                case (0):
                    this.calendarMark.set({ x: 229, y: 91 }); break;
            }

            switch (this.week) {
                case (1):
                    break;
                case (2):
                    this.calendarMark.set({ x: this.calendarMark.x += 2, y: this.calendarMark.y += 20 }); break;
                case (3):
                    this.calendarMark.set({ x: this.calendarMark.x += 4, y: this.calendarMark.y += 41 }); break;
                case (4):
                    this.calendarMark.set({ x: this.calendarMark.x += 6, y: this.calendarMark.y += 62 }); break;
            }
        }

        this.updateMonthText = function () {
            switch (this.month) {
                case (1):
                    this.monthDisplay.text = "January"; break;
                case (2):
                    this.monthDisplay.text = "February"; break;
                case (3):
                    this.monthDisplay.text = "March"; break;
                case (4):
                    this.monthDisplay.text = "April"; break;
                case (5):
                    this.monthDisplay.text = "May"; break;
                case (6):
                    this.monthDisplay.text = "June"; break;
                case (7):
                    this.monthDisplay.text = "July"; break;
                case (8):
                    this.monthDisplay.text = "August"; break;
                case (9):
                    this.monthDisplay.text = "September"; break;
                case (10):
                    this.monthDisplay.text = "October"; break;
                case (11):
                    this.monthDisplay.text = "November"; break;
                case (12):
                    this.monthDisplay.text = "December"; break;
            }
        }

        this.increaseWeek = function(){
            this.week++;
            if (this.week > 4) {
                this.week = 1;
                this.day = 1;
                this.increaseMonth();
            }
        }

        this.increaseMonth = function () {
            this.month++;
            if (this.month > 12) {
                this.month = 1;
            }
            this.updateMonthText();
        }

        this.displayDay = function () {
            var temp = this.day % 7;
            switch (temp) {
                case (0):
                    dayText.text = "Sunday"; break;
                case (1):
                    dayText.text = "Monday"; break;
                case (2):
                    dayText.text = "Tuesday"; break;
                case (3):
                    dayText.text = "Wednesday"; break;
                case (4):
                    dayText.text = "Thursday"; break;
                case (5):
                    dayText.text = "Friday"; break;
                case (6):
                    dayText.text = "Saturday"; break;
            }

            createjs.Tween.get(this.dayDisplay).to({ alpha: 1 }, 1000).wait(1500).to({ alpha: 0 }, 1000);
        }
    }

    //Initial update of starting values.
    this.updateTimeText();
    this.updateCalendarMark();
    this.updateMonthText();
}

/**
* Applies a color filter to the art object within a certain amount of selections.
* WARNING: You must cache the image BEFORE using this function, since this function only calls for updates on the cache.
* Category: System
**/
function ColorChanger(t) {
    this.filter = t.filter == null ? new createjs.ColorFilter(0, 0, 0, 1, 255, 255, 255, 0) : t.filter;
    this.image = t.image == null ? null : t.image;
    this.type = t.type == null ? "GENERAL" : t.type.toString().toUpperCase();
    this.currentPosition = 0;

    this.skin = [
        new createjs.ColorFilter(0, 0, 0, 1, 255, 220, 177, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 229, 194, 152, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 228, 185, 142, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 226, 185, 143, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 227, 161, 115, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 217, 145, 100, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 204, 132, 67, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 199, 122, 88, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 165, 57, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 134, 4, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 113, 2, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 68, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 255, 224, 196, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 238, 207, 180, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 222, 171, 127, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 224, 177, 132, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 223, 166, 117, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 190, 114, 60, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 100, 25, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 91, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 253, 228, 200, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 239, 214, 189, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 234, 189, 157, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 227, 194, 124, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 223, 185, 151, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 208, 146, 110, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 189, 151, 120, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 187, 109, 74, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 148, 10, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 225, 173, 164, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 165, 136, 105, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 123, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 114, 0, 0, 0)
    ];
    
    this.hair = [
        new createjs.ColorFilter(0, 0, 0, 1, 44, 34, 43, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 59, 48, 36, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 78, 67, 63, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 90, 69, 69, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 106, 78, 66, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 85, 72, 56, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 167, 133, 106, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 184, 151, 120, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 220, 108, 186, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 222, 188, 153, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 151, 121, 97, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 230, 206, 168, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 229, 200, 168, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 165, 107, 70, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 145, 85, 61, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 83, 61, 58, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 113, 99, 90, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 183, 166, 158, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 214, 196, 194, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 255, 241, 225, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 201, 191, 177, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 141, 74, 67, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 181, 82, 57, 0)
    ];

    this.general = [
        new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 205, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 155, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 105, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 55, 0, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 255, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 205, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 155, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 105, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 55, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 255, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 205, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 155, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 105, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 55, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 255, 255, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 205, 205, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 155, 155, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 105, 105, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 55, 55, 0, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 255, 255, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 205, 205, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 155, 155, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 105, 105, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 0, 55, 55, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 255, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 205, 0, 205, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 155, 0, 155, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 105, 0, 105, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 55, 0, 55, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 255, 255, 255, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 205, 205, 205, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 155, 155, 155, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 105, 105, 105, 0),
        new createjs.ColorFilter(0, 0, 0, 1, 55, 55, 55, 0)
    ];

    this.set = function (o) {
        this.filter = o.filter == null ? this.filter : o.filter;
        this.image = o.image == null ? this.image : o.image;
        this.type = o.type == null ? this.type : o.type.toString().toUpperCase();
    }
    
    this.apply = function () {
        this.image.filters = [this.filter];
        this.image.updateCache();
    }

    this.next = function () {
        if (this.type == "GENERAL") {
            if(this.currentPosition + 1 == this.general.length){
                this.currentPosition = 0;
            }
            else{
                this.currentPosition += 1;
            }
            this.filter = this.general[this.currentPosition];
        }
        if (this.type == "SKIN") {
            if (this.currentPosition + 1 == this.skin.length) {
                this.currentPosition = 0;
            }
            else {
                this.currentPosition += 1;
            }
            this.filter = this.skin[this.currentPosition];
        }
        if (this.type == "HAIR") {
            if (this.currentPosition + 1 == this.hair.length) {
                this.currentPosition = 0;
            }
            else {
                this.currentPosition += 1;
            }
            this.filter = this.hair[this.currentPosition];
        }
        this.image.filters = [this.filter];
        this.image.updateCache();
    }

    this.previous = function () {
        if (this.type == "GENERAL") {
            if (this.currentPosition - 1 == -1) {
                this.currentPosition = this.general.length - 1;
            }
            else {
                this.currentPosition -= 1;
            }
            this.filter = this.general[this.currentPosition];
        }
        if (this.type == "SKIN") {
            if (this.currentPosition - 1 == -1) {
                this.currentPosition = this.skin.length - 1;
            }
            else {
                this.currentPosition -= 1;
            }
            this.filter = this.skin[this.currentPosition];
        }
        if (this.type == "HAIR") {
            if (this.currentPosition - 1 == -1) {
                this.currentPosition = this.hair.length - 1;
            }
            else {
                this.currentPosition -= 1;
            }
            this.filter = this.hair[this.currentPosition];
        }
        this.image.filters = [this.filter];
        this.image.updateCache();
    }

    this.random = function () {
        var rand;
        if (this.type == "GENERAL") {
            rand = Math.floor(Math.random() * this.general.length);
            this.filter = this.general[rand];
        }
        if (this.type == "SKIN") {
            rand = Math.floor(Math.random() * this.skin.length);
            this.filter = this.skin[rand];
        }
        if (this.type == "HAIR") {
            rand = Math.floor(Math.random() * this.hair.length);
            this.filter = this.hair[rand];
        }

        this.currentPosition = rand;
        this.image.filters = [this.filter];
        this.image.updateCache();
    }

    
}

/**
* Perform starting animations and beginning dialog.
* Category: Story and Animation
**/
function Cutscenes() {
    //Player walk off screen and room fade in animations.
    this.ExitThenEnterPlayer = function(){
        playerChar.move(playerChar.x, 800);
        setTimeout(function () {
            room.door.image = preload.getResult("DoorOpen");
            createjs.Sound.play('Door', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0, 0, 1000);
        }, 3500);
        setTimeout(function () { playerChar.move(playerChar.x, 350) }, 4000);
        setTimeout(function () { room.door.image = preload.getResult("DoorClosed"); }, 5000);
        room.fadeIn(2000, 1500);
        playerChar.inRoom = true;
    }
    this.ExitPlayer = function () {
        playerChar.move(580, 300);
        setTimeout(function () { room.door.image = preload.getResult("DoorOpen"); }, playerChar.rate);
        setTimeout(function () { playerChar.move(playerChar.x, 800) }, playerChar.rate);
        setTimeout(function () { room.door.image = preload.getResult("DoorClosed"); }, playerChar.rate + 1000);
        playerChar.inRoom = false;
    }
    this.EnterPlayer = function () {
        playerChar.move(playerChar.x, 350);
        room.door.image = preload.getResult("DoorOpen");
        setTimeout(function () { room.door.image = preload.getResult("DoorClosed"); }, 1000);
        playerChar.inRoom = true;
    }
    this.StartGame = function () {
        playerCustomization.hide();
        startScreen.fadeInScreen();
        setTimeout(function () { startScreen.fadeInBanner() }, 1000);
        playerChar.move(580, 550);
    }
}
/**
* Creates the starting screen display.
* Category: Animation
**/
function StartScreen() {
    this.screen = new createjs.Container();
    this.banner = new createjs.Bitmap(preload.getResult("WelcomeBanner"));
    this.backpiece = new createjs.Bitmap(preload.getResult("Backpiece"));

    this.banner.set({ alpha: 0, x: 260, y: 10 });
    this.backpiece.alpha = 1;

    this.startButton = CJSS.createButton({
        text: "Start",
        action: function () {
            buttonActions();
        },
        backgroundColor: "lightblue",
        xPos: 520,
        yPos: 380
    })

    this.fadeInBanner = function () {
        createjs.Tween.get(this.banner).to({ alpha: 1 }, 1500);
    }
    this.fadeOutBanner = function () {
        createjs.Tween.get(this.banner).to({ alpha: 0 }, 1500);
    }
    this.fadeInBackpiece = function () {
        createjs.Tween.get(this.backpiece).to({ alpha: 1 }, 1500);
    }
    this.fadeOutBackpiece = function () {
        createjs.Tween.get(this.backpiece).to({ alpha: 0 }, 1500);
    }
    this.fadeInButton = function () {
        createjs.Tween.get(this.startButton).to({ alpha: 1 }, 1500);
    }
    this.fadeOutButton = function () {
        createjs.Tween.get(this.startButton).to({ alpha: 0 }, 1500);
    }
    this.fadeInScreen = function () {
        createjs.Tween.get(this.screen).to({ alpha: 1 }, 2000);
    }
    this.fadeOutScreen = function () {
        createjs.Tween.get(this.screen).to({ alpha: 0 }, 1500);
    }

    function buttonActions() {
        startScreen.fadeOutBanner();
        startScreen.fadeOutButton();
        setTimeout(function(){playerCustomization.show()}, 1500);
    }

    this.screen.addChild(this.backpiece, this.banner, this.startButton);
    this.screen.alpha = 0;
    stage.addChild(this.screen);
}

/**
* Creates room assets and objects.
* Category: System and Animation
**/
function Room() {
    //Containers
    {
        this.container = new createjs.Container();
        this.beforeContainer = new createjs.Container();
        this.behindContainer = new createjs.Container();
        var menus = new createjs.Container();
        this.menuContainer = menus;
    }
    //Create Art Assets
    {
        this.background = new createjs.Bitmap(preload.getResult("Room"));
        this.fridge = new createjs.Bitmap(preload.getResult("FridgeClosed"));
        this.door = new createjs.Bitmap(preload.getResult("DoorClosed"));
        this.bed = new createjs.Bitmap(preload.getResult("Bed"));
        this.bedSheet = new createjs.Bitmap(preload.getResult("BedSheet"));
        this.desk = new createjs.Bitmap(preload.getResult("Desk"));
        this.deskChair = new createjs.Bitmap(preload.getResult("DeskChair"));
        this.clock = new createjs.Bitmap(preload.getResult("Clock"));
        this.calendar = new createjs.Bitmap(preload.getResult("Calendar"));
        this.poster = new createjs.Bitmap(preload.getResult("Poster"));
        
        var night = new createjs.Shape();
        night.graphics.beginFill("#000").drawRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        night.alpha = 0.4;
        night.visible = false;
        this.night = night;
    }
    //Position Art Assets
    {
        this.fridge.set({ x: 580, y: 100 });
        this.door.set({ x: 510, y: 540 });
        this.bed.set({ x: 940, y: 150 });
        this.bedSheet.set({ x: this.bed.x + 18, y: this.bed.y - 2});
        this.desk.set({ x: 100, y: 280 });
        this.deskChair.set({ x: this.desk.x, y: this.desk.y + 10 });
        this.clock.set({ x: 550, y: 20 });
        this.calendar.set({ x: 100, y: 30 });
        this.poster.set({ x: 1000, y: 15, scaleX: 0.5, scaleY: 0.5 });
    }
    //Control Functions
    {
        this.hide = function () {
            this.container.alpha = 0;
            this.beforeContainer.alpha = 0;
            this.behindContainer.alpha = 0;
        }
        this.show = function () {
            this.container.alpha = 1;
            this.beforeContainer.alpha = 1;
            this.behindContainer.alpha = 1;
        }

        this.bed.addEventListener("click", function () {
            activeMenu = bedMenu;
            bedMenu.showDropButtons();
        });
        this.bedSheet.addEventListener("click", function () {
            activeMenu = bedMenu;
            bedMenu.showDropButtons();
        });
        this.desk.addEventListener("click", function () {
            activeMenu = deskMenu;
            deskMenu.showDropButtons();
        });
        this.deskChair.addEventListener("click", function () {
            activeMenu = deskMenu;
            deskMenu.showDropButtons();
        });
        this.fridge.addEventListener("click", function () {
            activeMenu = fridgeMenu;
            fridgeMenu.showDropButtons();
        });
        this.door.addEventListener("click", function () {
            activeMenu = doorMenu;
            doorMenu.showDropButtons();
        });
    }
    //Action Dropbuttons
    {
        this.poster.addEventListener("click", function () {
            eventSystem.upgradesEvent();
            createjs.Sound.stop('Fantasia');
            createjs.Sound.play('WarIsHell', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);
        });

        var bedMenu = new CJSS.createDropButton({
            xPos: 740,
            yPos: 90,
            subButtons: [
                CJSS.createButton({
                    text: "Sleep (4 Hours)",
                    action: function () {
                        if (!playerChar.performingAction) {
                            sleep();
                            player.sleep(4);
                            bedMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Close",
                    action: function () {
                        bedMenu.hideDropButtons();
                    }
                })
            ]
        });
        bedMenu.hideMainButton();

        var fridgeMenu = new CJSS.createDropButton({
            xPos: 720,
            yPos: 20,
            subButtons: [
                CJSS.createButton({
                    text: "Chips - $3",
                    action: function () {
                        if (!playerChar.performingAction) {
                            eat();
                            player.eat(3);
                            fridgeMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Pizza - $8",
                    action: function () {
                        if (!playerChar.performingAction) {
                            eat();
                            player.eat(8);
                            fridgeMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Energy Drink - $3",
                    action: function () {
                        if (!playerChar.performingAction) {
                            eat();
                            player.drink(3);
                            fridgeMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Close",
                    action: function () {
                        fridgeMenu.hideDropButtons();
                    }
                })
            ]
        });
        fridgeMenu.hideMainButton();

        var deskMenu = new CJSS.createDropButton({
            xPos: 370,
            yPos: 20,
            subButtons: [
                CJSS.createButton({
                    text: "History",
                    action: function () {
                        if (!playerChar.performingAction) {
                            study();
                            player.study(1, 4);
                            deskMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Literature",
                    action: function () {
                        if (!playerChar.performingAction) {
                            study();
                            player.study(1, 3);
                            deskMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Science",
                    action: function () {
                        if (!playerChar.performingAction) {
                            study();
                            player.study(1, 2);
                            deskMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Math",
                    action: function () {
                        if (!playerChar.performingAction) {
                            study();
                            player.study(1, 1);
                            deskMenu.hideDropButtons();
                        }
                    }
                }),
                //CJSS.createButton({
                //    text: "Procrastinate",
                //    action: function () {
                //        if (!playerChar.performingAction) {
                //            study();
                //            player.socialize(1);
                //        }
                //    }
                //}),
                CJSS.createButton({
                    text: "Close",
                    action: function () {
                        deskMenu.hideDropButtons();
                    }
                })
            ]
        });
        deskMenu.hideMainButton();

        var doorMenu = new CJSS.createDropButton({
            xPos: 370,
            yPos: 100,
            subButtons: [
                CJSS.createButton({
                    text: "Work (3 Hours)",
                    action: function () {
                        if (!playerChar.performingAction) {
                            leave();
                            player.work(3);
                            doorMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Class (5 Hours)",
                    action: function () {
                        if (!playerChar.performingAction) {
                            if (time.hour == 9 && time.am) {
                                leave();
                            }
                            player.goToClass();
                            doorMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Socialize (3 Hours)",
                    action: function () {
                        if (!playerChar.performingAction) {
                            leave();
                            player.socialize(3);
                            doorMenu.hideDropButtons();
                        }
                    }
                }),
                CJSS.createButton({
                    text: "Close",
                    action: function () {
                        doorMenu.hideDropButtons();
                    }
                })
            ]
        });
        doorMenu.hideMainButton();
    }
    //Animation Functions
    {
        this.fadeIn = function (durationTime, waitTime) {
            durationTime = durationTime == null ? 2000 : durationTime;
            waitTime = waitTime == null ? 1000 : waitTime;
            createjs.Tween.get(this.container).wait(waitTime).to({ alpha: 1 }, durationTime);
            createjs.Tween.get(this.beforeContainer).wait(waitTime).to({ alpha: 1 }, durationTime);
            createjs.Tween.get(this.behindContainer).wait(waitTime).to({ alpha: 1 }, durationTime);
        };
        this.fadeOut = function (durationTime, waitTime) {
            durationTime = durationTime == null ? 2000 : durationTime;
            waitTime = waitTime == null ? 1000 : waitTime;
            createjs.Tween.get(this.container).wait(waitTime).to({ alpha: 0 }, durationTime);
            createjs.Tween.get(this.beforeContainer).wait(waitTime).to({ alpha: 0 }, durationTime);
            createjs.Tween.get(this.behindContainer).wait(waitTime).to({ alpha: 0 }, durationTime);
        };

        var sleep = function () {
            if (playerChar.inRoom) {
                playerChar.move(room.bed.x - 65, room.bed.y + 12);
                setTimeout(function () {
                    playerChar.move(room.bed.x + 65, playerChar.y);
                    playerChar.eyes.gotoAndPlay("close");
                    createjs.Sound.play('Snoring', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
                    setTimeout(function () {
                        playerChar.eyes.gotoAndPlay("normal");
                        standMiddle();
                    }, playerChar.rate + 1000);
                }, playerChar.rate);
                
            }
        }
        var study = function () {
            if (playerChar.inRoom) {
                playerChar.move(room.desk.x + 300, room.desk.y - 15);
                setTimeout(function () {
                    playerChar.move(room.desk.x + 150, playerChar.y);
                    createjs.Sound.play('Pen', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
                    setTimeout(function () { standMiddle(); }, playerChar.rate + 1000);
                }, playerChar.rate);
            }
        }
        var eat = function () {
            if (playerChar.inRoom) {
                playerChar.move(room.fridge.x + 60, room.fridge.y + 100);
                setTimeout(function () {
                    playerChar.hands.gotoAndPlay("eat");
                    playerChar.handsOutline.gotoAndPlay("eat");
                    createjs.Sound.play('Bite', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
                    setTimeout(function () { standMiddle(); }, playerChar.rate + 500);
                }, playerChar.rate)
                room.fridge.image = preload.getResult("FridgeOpen");
                setTimeout(function () { room.fridge.image = preload.getResult("FridgeClosed"); }, 2500);
            }
        }
        var leave = function () {
            if (playerChar.inRoom) {
                cutscenes.ExitPlayer();
                createjs.Sound.play('Door', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0, 0, 1000);
                setTimeout(function () {
                    cutscenes.EnterPlayer();
                    createjs.Sound.play('Door', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0, 0, 1000);
                }, 5000);
            }
        }
        var standMiddle = function () {
            if (playerChar.inRoom) {
                var rand = 500 + Math.floor( Math.random() * 200);
                playerChar.move(rand, 300);
            }
        }
    }
    //Group Components
    {
        this.menuContainer.addChild(bedMenu, deskMenu, fridgeMenu, doorMenu);
        this.container.addChild(this.background, this.door, this.bed, this.bedSheet, this.calendar, this.clock, this.desk, this.deskChair, this.fridge, this.poster);
        this.beforeContainer.addChild(this.desk, this.bedSheet, this.door, this.menuContainer);
        this.behindContainer.addChild(this.background, this.calendar, this.clock, this.poster, this.bed, this.deskChair, this.fridge)
    }
    //Menu Switching
    {
        function switchMenus() {
            for (var i = 0; i < menus.numChildren; i++) {
                menus.getChildAt(i).hideDropButtons();
            }
            activeMenu.showDropButtons();
        }

        var activeMenu;
        for (var i = 0; i < this.beforeContainer.numChildren - 1; i++) {
            this.beforeContainer.getChildAt(i).addEventListener("click", switchMenus);
        }
        for (var i = 3; i < this.behindContainer.numChildren; i++) {
            this.behindContainer.getChildAt(i).addEventListener("click", switchMenus);
        }

        this.background.addEventListener("click", function () {
            for (var i = 0; i < menus.numChildren; i++) {
                menus.getChildAt(i).hideDropButtons();
            }
        });
    }
}

/**
* Creates character object with functions and animations.
* @param {Number} x
* @param {Number} y
* Category: System and Animation
**/
function Character(x, y) {
    //Control Variables
    {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
        this.rate = 0;

        var playerSprite = new createjs.Container();
        playerSprite.x = this.x;
        playerSprite.y = this.y;

        this.sprite = playerSprite;
        this.facingLeft = true;
        this.performingAction = false;
        this.inRoom = false;
        this.idle = false;

        var color = new ColorChanger({});
    }
    //Sprite Variables
    {
        
        //Sprite Sheet Color Adjustment
        {
            this.eyeSheet = new createjs.Bitmap(preload.getResult("Eyes"));
            this.eyeSheet.filters = [new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 0, 0)];
            this.eyeSheet.cache(0, 0, preload.getResult("Eyes").width, preload.getResult("Eyes").height);

            this.handsBase = new createjs.Bitmap(preload.getResult("HandsBase"));
            this.handsBase.cache(0, 0, preload.getResult("HandsBase").width, preload.getResult("HandsBase").height);
            color.set({ image: this.handsBase, type: "SKIN" });
            color.random();
        }
        //Sprite Sheet Creation
        {
            var eyesSheet = new createjs.SpriteSheet({
                framerate: 30,
                images: [this.eyeSheet.cacheCanvas],
                frames: { width: 100, height: 150, count: 12 },
                animations: {
                    "normal": [0],
                    "close" : [2],
                    "blink": [0, 3, "normal", 0.5],
                    "lookSides": [4, 7, "normal", 0.1],
                    "lookDown": [8, 11, "normal", 0.25]
                }
            });
            var feetSheet = new createjs.SpriteSheet({
                framerate: 30,
                images: [preload.getResult("Feet")],
                frames: { width: 100, height: 150, count: 6 },
                animations: {
                    "stand": [0],
                    "walk": [1, 5, "walk", 0.2]
                }
            });
            var handsSheet = new createjs.SpriteSheet({
                framerate: 30,
                images: [this.handsBase.cacheCanvas],
                frames: { width: 100, height: 150, count: 24 },
                animations: {
                    "stand": [0],
                    "walk": { frames: [0, 1, 0, 2], next: "walk", speed: 0.1 },
                    "eat": { frames: [3, 4, 5, 4, 3], next: "stand", speed: 0.2 }
                }
            });
            var handsOutlineSheet = new createjs.SpriteSheet({
                framerate: 30,
                images: [preload.getResult("HandsOutline")],
                frames: { width: 100, height: 150, count: 24 },
                animations: {
                    "stand": [0],
                    "walk": { frames: [0, 1, 0, 2], next: "walk", speed: 0.1 },
                    "eat": { frames: [3, 4, 5, 4, 3], next: "stand", speed: 0.2 }
                }
            });
        }
        //Face Variables
        {
            this.eyes = new createjs.Sprite(eyesSheet, "blink");
            this.eyes.set({ y: 5 });
            this.mouth = new createjs.Bitmap(preload.getResult("MouthNeutral"));
            
        }
        //Body Variables
        {
            this.bodyBase = new createjs.Bitmap(preload.getResult("BodyBase"));
            this.bodyBase.cache(0, 0, 100, 150);
            color.set({ image: this.bodyBase });
            color.apply();
            this.bodyOutline = new createjs.Bitmap(preload.getResult("BodyOutline"));
            this.shadow = new createjs.Shape();
            this.shadow.graphics.beginFill("#333").drawEllipse(25, 130, 50, 20);
        }
        //Feet Variables
        {
            this.feet = new createjs.Sprite(feetSheet, "stand");
        }
        //Hands Variables
        {
            this.hands = new createjs.Sprite(handsSheet, "stand");
            this.hands.set({ y: -5 });
            this.handsOutline = new createjs.Sprite(handsOutlineSheet, "stand");
            this.handsOutline.set({ y: -5 });
        }
        //Hair Variables
        {
            this.hairBase = new createjs.Bitmap(preload.getResult("HairShoulderBase"));
            this.hairBase.cache(0, 0, 100, 150);
            this.hairBase.set({ y: 5 });
            color.set({ image: this.hairBase, type: "HAIR" });
            color.random();
            this.hairOutline = new createjs.Bitmap(preload.getResult("HairShoulderOutline"));
            this.hairOutline.set({ y: 5 });
        }
        //Accessory Variables
        {
            this.accessoryBase = new createjs.Bitmap();
            this.accessoryBase.set({ y: 5 });
            this.accessoryBase.cache(0, 0, 100, 150);
            this.accessoryOutline = new createjs.Bitmap();
            this.accessoryOutline.set({ y: 5 });
        }
        //Clothes Variables
        {
            this.clothesLower = new createjs.Bitmap(preload.getResult("LowerBody"));
            this.clothesLower.cache(0, 0, 100, 150);
            color.set({ image: this.clothesLower, type: "GENERAL" });
            color.random();
            this.clothesUpper = new createjs.Bitmap(preload.getResult("UpperChestStripe"));
            this.clothesUpper.cache(0, 0, 100, 150);
            color.set({ image: this.clothesUpper});
            color.random();
        }
    }
    //Control and Animation Functions
    {
        //Changes character orientation to face left.
        this.faceLeft = function () {
            playerSprite.set({ scaleX: 1, x: this.x });
            this.facingLeft = true;
        };

        //Changes character orientation to face right.
        this.faceRight = function () {
            playerSprite.set({ scaleX: -1, x: this.x + 100 });
            this.facingLeft = false;
        };

        //Changes character orientation to be the opposite of what it currently is.
        this.switchDirection = function () {
            if (this.facingLeft) {
                this.faceRight();
            } else {
                this.faceLeft();
            }
        };

        //Relocates the character to specificed x/y coordinates. 
        this.place = function (x, y) {
            this.x = x;
            this.y = y;
            playerSprite.set({ x: this.x, y: this.y });
        };

        //Animates and moves the character across the stage to the specified x/y coordinates.
        this.move = function (x, y) {
            if (!this.performingAction) {
                this.performingAction = true;
                if (x <= this.x) {
                    this.faceLeft();
                } else {
                    this.faceRight();
                }
                var cV = this.x + this.y;
                var nV = x + y;
                this.rate = cV < nV ? (nV / cV) * 1000 : (cV / nV) * 1000;
                this.x = x;
                this.y = y;
                createjs.Tween.get(playerSprite).to({ x: this.facingLeft ? this.x : this.x + 100, y: this.y }, (this.rate));
                this.feet.gotoAndPlay("walk");
                this.hands.gotoAndPlay("walk");
                this.handsOutline.gotoAndPlay("walk");
                createjs.Tween.get(this).wait(this.rate).call(
                    function () {
                        this.feet.gotoAndPlay("stand");
                        this.hands.gotoAndPlay("stand");
                        this.handsOutline.gotoAndPlay("stand");
                        this.performingAction = false;
                    });
                this.rate += 50;
            }
        }
    }
    //Group Components
    {
        playerSprite.addChild(this.shadow, this.bodyBase, this.bodyOutline, this.clothesLower, this.clothesUpper,
            this.mouth, this.eyes, this.feet, this.accessoryBase, this.accessoryOutline,
            this.hairBase, this.hairOutline, this.hands, this.handsOutline);
    }
}

/**
* Menu system for the customization of a character object.
* @param {Character} character
* Category: System
**/
function CharacterCustomizer(character) {
    //Visual Container
    {
        var customizerMenu = new createjs.Container();
        this.menu = customizerMenu;
    }
    //Control Functions
    {
        //Sets the menu to be visible.
        this.show = function () {
            customizerMenu.alpha = 1;
        }

        //Sets the menu to be hidden.
        this.hide = function () {
            customizerMenu.alpha = 0;
        }

        //Closes other menus that are open when a new menu is selected.
        var activeButton;
        customizerMenu.addEventListener("click", function () {
            for (var i = 0; i < customizerMenu.numChildren - 2; i++) {
                if (customizerMenu.getChildAt(i) != activeButton)
                    customizerMenu.getChildAt(i).hideDropButtons();
            }
        })
    }
    //Asset Arrays
    {
        var mouthPosition = 0;
        var mouths = [
            preload.getResult("MouthNeutral"),
            preload.getResult("MouthSmile"),
            preload.getResult("MouthBigSmile"),
            preload.getResult("MouthSmirk")
        ];

        var hairPosition = 2;
        var hair = [
            { base: null, outline: null},
            { base: preload.getResult("HairSpikeBase"), outline: preload.getResult("HairSpikeOutline") },
            { base: preload.getResult("HairShoulderBase"), outline: preload.getResult("HairShoulderOutline") }
        ]

        var accessoryPosition = 0;
        var accessory = [
            { base: null, outline: null},
            { base: preload.getResult("EarringHoopsBase"), outline: preload.getResult("EarringHoopsOutline") },
            { base: preload.getResult("EyebrowPiercingBase"), outline: preload.getResult("EyebrowPiercingOutline") }
        ]

        var clothesLowerPosition = 0;
        var clothesLower = [
            preload.getResult("LowerBody"),
            preload.getResult("LowerCollar"),
            preload.getResult("LowerTankTop")
        ]

        var clothesUpperPosition = 3;
        var clothesUpper = [
            null,
            preload.getResult("UpperBow"),
            preload.getResult("UpperButtons"),
            preload.getResult("UpperChestStripe"),
            preload.getResult("UpperShoulderStripe"),
            preload.getResult("UpperTie"),
            preload.getResult("UpperVestClosed"),
            preload.getResult("UpperVestOpen")
        ]
    }
    //Button Menus
    {
        var skinColor = new ColorChanger({ type: "SKIN" });
        var bodyMenu = new CJSS.createDropButton({
            xPos: 0,
            yPos: 0,
            mainButton: CJSS.createButton({
                text: "Body",
                backgroundColor: "#00b",
                textColor: "#fff"
            }),
            subButtons: [
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        skinColor.set({ image: character.bodyBase });
                        skinColor.previous();
                        skinColor.set({ image: character.handsBase });
                        skinColor.apply();
                    },
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Skin",
                    action: function () {
                        skinColor.set({ image: character.bodyBase });
                        skinColor.random();
                        skinColor.set({ image: character.handsBase });
                        skinColor.apply();
                    },
                    yPos: -75,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        skinColor.set({ image: character.bodyBase });
                        skinColor.next();
                        skinColor.set({ image: character.handsBase });
                        skinColor.apply();
                    },
                    yPos: -150,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        if (mouthPosition - 1 == -1) {
                            mouthPosition = mouths.length - 1;
                        }
                        else {
                            mouthPosition -= 1;
                        }
                        character.mouth.image = mouths[mouthPosition];
                    },
                    yPos: -150,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Mouth",
                    action: function () {
                        var rand = Math.floor(Math.random() * mouths.length);
                        character.mouth.image = mouths[rand];
                        mouthPosition = rand;
                    },
                    yPos: -225,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        if (mouthPosition + 1 == mouths.length) {
                            mouthPosition = 0;
                        }
                        else {
                            mouthPosition += 1;
                        }
                        character.mouth.image = mouths[mouthPosition];
                    },
                    yPos: -300,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                })
            ]
        });
        bodyMenu.addEventListener("click", function () { activeButton = bodyMenu });

        var hairColor = new ColorChanger({ type: "HAIR", image: character.hairBase });
        var hairMenu = new CJSS.createDropButton({
            xPos: 250,
            yPos: 0,
            mainButton: CJSS.createButton({
                text: "Hair",
                backgroundColor: "#00b",
                textColor: "#fff"
            }),
            subButtons: [
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        hairColor.previous();
                    },
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Color",
                    action: function () {
                        hairColor.random();
                    },
                    yPos: -75,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        hairColor.next();
                    },
                    yPos: -150,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        if (hairPosition - 1 == -1) {
                            hairPosition = hair.length - 1;
                        }
                        else {
                            hairPosition -= 1;
                        }
                        character.hairBase.image = hair[hairPosition].base;
                        character.hairBase.updateCache();
                        character.hairOutline.image = hair[hairPosition].outline;
                    },
                    yPos: -150,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Style",
                    action: function () {
                        var rand = Math.floor(Math.random() * hair.length);
                        character.hairBase.image = hair[rand].base;
                        character.hairBase.updateCache();
                        character.hairOutline.image = hair[rand].outline;
                        hairPosition = rand;
                    },
                    yPos: -225,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        if (hairPosition + 1 == hair.length) {
                            hairPosition = 0;
                        }
                        else {
                            hairPosition += 1;
                        }
                        character.hairBase.image = hair[hairPosition].base;
                        character.hairBase.updateCache();
                        character.hairOutline.image = hair[hairPosition].outline;
                    },
                    yPos: -300,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                })
            ]
        });
        hairMenu.addEventListener("click", function () { activeButton = hairMenu });

        var accessoryColor = new ColorChanger({ type: "GENERAL", image: character.accessoryBase });
        var accessoryMenu = new CJSS.createDropButton({
            xPos: 500,
            yPos: 0,
            mainButton: CJSS.createButton({
                text: "Accessory",
                backgroundColor: "#00b",
                textColor: "#fff"
            }),
            subButtons: [
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        accessoryColor.previous();
                    },
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Color",
                    action: function () {
                        accessoryColor.random();
                    },
                    yPos: -75,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        accessoryColor.next();
                    },
                    yPos: -150,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        if (accessoryPosition - 1 == -1) {
                            accessoryPosition = accessory.length - 1;
                        }
                        else {
                            accessoryPosition -= 1;
                        }
                        character.accessoryBase.image = accessory[accessoryPosition].base;
                        character.accessoryBase.updateCache();
                        character.accessoryOutline.image = accessory[accessoryPosition].outline;
                    },
                    yPos: -150,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Style",
                    action: function () {
                        var rand = Math.floor(Math.random() * accessory.length);
                        character.accessoryBase.image = accessory[rand].base;
                        character.accessoryBase.updateCache();
                        character.accessoryOutline.image = accessory[rand].outline;
                        accessoryPosition = rand;
                    },
                    yPos: -225,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        if (accessoryPosition + 1 == accessory.length) {
                            accessoryPosition = 0;
                        }
                        else {
                            accessoryPosition += 1;
                        }
                        character.accessoryBase.image = accessory[accessoryPosition].base;
                        character.accessoryBase.updateCache();
                        character.accessoryOutline.image = accessory[accessoryPosition].outline;
                    },
                    yPos: -300,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                })
            ]
        });
        accessoryMenu.addEventListener("click", function () { activeButton = accessoryMenu });

        var clothesLowerColor = new ColorChanger({ type: "GENERAL", image: character.clothesLower });
        var clothesUpperColor = new ColorChanger({ type: "GENERAL", image: character.clothesUpper });
        var clothesMenu = new CJSS.createDropButton({
            xPos: 750,
            yPos: 0,
            mainButton: CJSS.createButton({
                text: "Clothes",
                backgroundColor: "#00b",
                textColor: "#fff"
            }),
            subButtons: [
                //Lower Color
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        clothesLowerColor.previous();
                    },
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Lower Color",
                    action: function () {
                        clothesLowerColor.random();
                    },
                    yPos: -75,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        clothesLowerColor.next();
                    },
                    yPos: -150,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                //Lower Style
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        if (clothesLowerPosition - 1 == -1) {
                            clothesLowerPosition = clothesLower.length - 1;
                        }
                        else {
                            clothesLowerPosition -= 1;
                        }
                        character.clothesLower.image = clothesLower[clothesLowerPosition];
                        character.clothesLower.updateCache();
                    },
                    yPos: -150,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Lower Style",
                    action: function () {
                        var rand = Math.floor(Math.random() * clothesLower.length);
                        character.clothesLower.image = clothesLower[rand];
                        character.clothesLower.updateCache();
                        clothesLowerPosition = rand;
                    },
                    yPos: -225,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        if (clothesLowerPosition + 1 == clothesLower.length) {
                            clothesLowerPosition = 0;
                        }
                        else {
                            clothesLowerPosition += 1;
                        }
                        character.clothesLower.image = clothesLower[clothesLowerPosition];
                        character.clothesLower.updateCache();
                    },
                    yPos: -300,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                //Upper Color
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        clothesUpperColor.previous();
                    },
                    yPos: -300,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Upper Color",
                    action: function () {
                        clothesUpperColor.random();
                    },
                    yPos: -375,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        clothesUpperColor.next();
                    },
                    yPos: -450,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                //Upper Style
                CJSS.createButton({
                    text: "<<",
                    action: function () {
                        if (clothesUpperPosition - 1 == -1) {
                            clothesUpperPosition = clothesUpper.length - 1;
                        }
                        else {
                            clothesUpperPosition -= 1;
                        }
                        character.clothesUpper.image = clothesUpper[clothesUpperPosition];
                        character.clothesUpper.updateCache();
                    },
                    yPos: -450,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: "Upper Style",
                    action: function () {
                        var rand = Math.floor(Math.random() * clothesUpper.length);
                        character.clothesUpper.image = clothesUpper[rand];
                        character.clothesUpper.updateCache();
                        clothesUpperPosition = rand;
                    },
                    yPos: -525,
                    xPos: 40,
                    width: 120,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                }),
                CJSS.createButton({
                    text: ">>",
                    action: function () {
                        if (clothesUpperPosition + 1 == clothesUpper.length) {
                            clothesUpperPosition = 0;
                        }
                        else {
                            clothesUpperPosition += 1;
                        }
                        character.clothesUpper.image = clothesUpper[clothesUpperPosition];
                        character.clothesUpper.updateCache();
                    },
                    yPos: -600,
                    xPos: 160,
                    width: 40,
                    backgroundColor: "#55f",
                    textColor: "#fff"
                })
            ]
        });
        clothesMenu.addEventListener("click", function () { activeButton = clothesMenu });
    }
    //Control Buttons
    {
        // Hides the customization menu.
        var doneButton = CJSS.createButton({
            text: "Done",
            action: function () {
                customizerMenu.alpha = 0;
                cutscenes.ExitThenEnterPlayer();
                createjs.Sound.stop('SnowyForest');
                createjs.Sound.play('Fantasia', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);
            },
            xPos: 372,
            yPos: 450
        });

        //Flips the character horizontally.
        var flipButton = CJSS.createButton({
            text: "Flip",
            action: function () {
                character.switchDirection();
            },
            xPos: 320,
            yPos: 600,
            width: 80,
            height: 40,
            backgroundColor: "lightgray"
        });
    }
    
    //Group Components
    {
        customizerMenu.addChild( bodyMenu, hairMenu, accessoryMenu, clothesMenu, doneButton, flipButton);
        customizerMenu.set({ x: 150 });
    }
}

/**
* Creates and handles resource objects. Intended use is for money, energy, hunger, and happiness values in this game.
*
* Has a couple options for display types:
*   TEXT: Will display just the text and the value.
*   CHARGEBAR: Will display the text, value, and chargebar in a box.
*
* If an image is given, it will display it to the left of the text. Reference the image and 
* use a .set() function call if you want to change the postion.
*
* Category: System
**/
/*function ResourceDisplay(r) {
    //Resource Variables and Display Cntainer
    {
        this.value = r.value == null ? 100 : r.value;
        this.text = r.text == null ? "Resource" : r.text;
        this.displayType = r.displayType == null ? "TEXT" : r.displayType;
        this.image = r.image;
        this.box = r.box == null ? CJSS.createBox() : r.box;

        this.display = new createjs.Container();
    }

    //Display Bars and Text
    {
        if (this.displayType == "TEXT") {

        }
        if (this.displayType == "CHARGEBAR") {

        }
    }
    //Control Functions
    {

    }
}*/