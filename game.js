class Game {
    /*** @type {Game} */
    static instance = null;

    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    context;

    /** @type {Image} */
    head;
    /** @type {Image} */
    background;
    
    /** @type {Object<String, Boolean>} */
    pressedKeys = {};

    /** @type {List<Promise>} */
    tasksBeforeStart = [];

    world_width = 10000;
    world_height = 10000;
    x = 5000;
    y = 5000;

    headRotation = 0;

    constructor() {
        if (Game.instance) 
            throw new Error('Cannot create multiple instances of Game');

        this.canvas = document.getElementById('game_canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.head = new Image();
        this.head.src = './resources/head01.webp';
        this.background = new Image();
        this.background.src = './resources/background.jpg';
        this.tasksBeforeStart.push(new Promise((resolve, reject) => {
            this.head.onload = resolve;
        }));
        this.tasksBeforeStart.push(new Promise((resolve, reject) => {
            this.background.onload = resolve;
        }));

        this.controlInit();

        Game.instance = this;
    }

    async start() {
        await Promise.all(this.tasksBeforeStart);
        this.update();
    }

    controlInit() {
        document.addEventListener('keydown', (event) => {
            this.pressedKeys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.pressedKeys[event.key] = false;
        });
    }

    controlDetect() {
        if (this.pressedKeys['ArrowLeft']) {
            this.left();
        }
        if (this.pressedKeys['ArrowRight']) {
            this.right();
        }
    }

    left() {
        var count = 0;
        setInterval(() => {
            if (count++ > 10)
                return;
            this.headRotation -= 0.003;
        }, 1);
    }

    right() {
        var count = 0;
        setInterval(() => {
            if (count++ > 10)
                return;
            this.headRotation += 0.003;
        }, 1);
    }

    update() {
        this.controlDetect();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        this.context.save();

        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.rotate(this.headRotation);
        this.context.drawImage(this.head, -this.head.width / 2, -this.head.height / 2, this.head.width, this.head.height);

        this.context.restore();

        requestAnimationFrame(() => this.update());
    }


}


new Game().start();