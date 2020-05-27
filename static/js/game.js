const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const unit = 32;
const w_units = 20;
const h_units = 12;

canvas.width = (w_units + 1) * unit;
canvas.height = (h_units + 1) * unit;

class Food{
    constructor(){
        this.food = {}
        this.eated();

    }
    eated = function(snake = [{x: Math.floor(w_units/2), y: Math.floor(h_units/2)}] ){
        const ps = [];
        const c = [...snake];

        for(let i = 0; i < w_units; i++){
            for(let j = 0; j < h_units; j++){
                ps.push({x: i, y: j});
            }
        }

        for(let i = 0; i < snake.length; i++){

            for(let j = 0; j < ps.length; j++){
                if(snake[i].x === ps[j].x && snake[i].y === ps[j].y){
                    ps.splice(j, 1);
                }
            }
        }
        const pa = Math.floor(Math.random() * ps.length);
        this.food = {
            x: ps[pa].x,
            y: ps[pa].y
        }
    }
    draw = function(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.food.x * unit, this.food.y * unit, unit, unit);
    }
}

class Snake{
    constructor(){
        this.startSnake();
        this.lastRemoved = {};
        this.maxScore = 0;
    }

    head = function(){
        return this.snake[0];
    }

    eat = function(){
        this.snake.push(this.lastRemoved);
        this.score++;
        if(this.score > this.maxScore) this.maxScore = this.score;
    }

    startSnake = function(){
        this.alive = true;
        this.dir = 'LEFT';
        this.snake = [
            {x: Math.floor(w_units/2), y: Math.floor(h_units/2)},
        ];
        this.score = 0;
    }
    
    draw = function(){
        this.snake.map(s => {
            ctx.fillStyle = 'green';
            ctx.fillRect(s.x * unit, s.y * unit, unit, unit);
        });
    }
    
    update = function(){
        let newPos = {};
        if(this.dir === 'LEFT'){
            newPos = {
                x: this.snake[0].x - 1,
                y: this.snake[0].y
            };
        }
        
        else if(this.dir === 'UP'){
            newPos = {
                x: this.snake[0].x,
                y: this.snake[0].y - 1
            };
        }
        
        else if(this.dir === 'RIGHT'){
            newPos = {
                x: this.snake[0].x + 1,
                y: this.snake[0].y
            };
        }
        
        else if(this.dir === 'DOWN'){
            newPos = {
                x: this.snake[0].x,
                y: this.snake[0].y + 1
            };
        }
        
        
        for(let i = 1; i < this.snake.length; i++){
            if(this.snake[i].x === newPos.x && this.snake[i].y === newPos.y){
                this.alive = false;
                alert('Voce perdeu!');
                return false;
            }
        }
        if(newPos.x < 0 || newPos.x > w_units || newPos.y < 0 || newPos.y > h_units){
            alert('Voce perdeu!');
            this.alive = false;
            return false;
        }

        this.lastRemoved = this.snake.pop();
        this.snake.unshift(newPos);
    }
    
    direction = (event) => {
        if(event.keyCode === 37 && this.dir != 'RIGHT'){
            this.dir = 'LEFT';
        }

        else if(event.keyCode === 38 && this.dir != 'DOWN'){
            this.dir = 'UP';
        }

        else if(event.keyCode === 39 && this.dir != 'LEFT'){
            this.dir = 'RIGHT';
        }

        else if(event.keyCode === 40 && this.dir != 'UP'){
            this.dir = 'DOWN';
        }

        else if(event.keyCode === 32 && !this.alive){
            this.startSnake();
        }
    }

    willCollide(newPos){
        for(let i = 1; i < this.snake.length; i++){
            if(this.snake[i].x === newPos.x && this.snake[i].y === newPos.y){
                return true;
            }
        }
        return false;
    }

    issetBodyParts(dir){
        for(let i = 1; i < this.snake.length; i++){
            const p = this.snake[i];
            const h = this.snake[0];
            if(dir === 'UP' && h.x === p.x && p.y > h.y){
                return true;
            }

            if(dir === 'DOWN' && h.x === p.x && p.y < h.y){
                return true;
            }

            if(dir === 'LEFT' && h.y === p.y && p.x < h.x){
                return true;
            }

            if(dir === 'RIGHT' && h.y === p.y && p.x > h.x){
                return true;
            }
        }
        return false;

    }

    ia = function (food) {
        const collideUp = this.willCollide({x: this.snake[0].x, y: this.snake[0].y - 1 });
        const collideDown = this.willCollide({x: this.snake[0].x, y: this.snake[0].y + 1 });
        const collideLeft = this.willCollide({x: this.snake[0].x - 1, y: this.snake[0].y });
        const collideRight = this.willCollide({x: this.snake[0].x + 1, y: this.snake[0].y });

        if( (collideUp && this.dir === 'UP') || (collideDown  && this.dir === 'DOWN') ){
            if(!collideRight) this.dir = 'RIGHT';
            else if(!collideLeft) this.dir = 'LEFT';
        }

        else if((collideLeft  && this.dir === 'LEFT') || (collideRight  && this.dir === 'RIGHT') ){
            if(!collideUp) this.dir = 'UP';
            else if(!collideDown) this.dir = 'DOWN';
        }

        else if(food.food.x > this.snake[0].x && this.dir !== 'LEFT' && !collideRight) this.dir = 'RIGHT';
        else if(food.food.x < this.snake[0].x && this.dir !== 'RIGHT' && !collideLeft) this.dir = 'LEFT';
        else if(food.food.y > this.snake[0].y  && this.dir !== 'UP' && !collideDown) this.dir = 'DOWN';
        else if(food.food.y < this.snake[0].y  && this.dir !== 'DOWN' && !collideUp) this.dir = 'UP';


        else if( (food.food.x > this.snake[0].x && this.dir === 'LEFT') ||  food.food.x < this.snake[0].x && this.dir === 'RIGHT'){
            
            if(this.snake[0].y == 0) this.dir = 'DOWN';
            else if(this.snake[0].y == h_units) this.dir = 'UP';
            
            else if(collideUp && !this.issetBodyParts('DOWN')){
                this.dir = 'DOWN';
            }

            else if(collideDown && !this.issetBodyParts('UP')){
                this.dir = 'UP';
            }
            else if(this.issetBodyParts('UP')){
                this.dir = 'DOWN';
            }
            else if(this.issetBodyParts('DOWN')){
                this.dir = 'UP';
            }
            else{
                const a = Math.floor(Math.random() * 2 + 1);
                if(a === 1) this.dir = 'UP';
                else this.dir = 'DOWN';
            }
        }
        else if( (food.food.y > this.snake[0].y  && this.dir === 'UP') || (food.food.y < this.snake[0].y  && this.dir === 'DOWN') ){
            if(this.snake[0].x == 0) this.dir = 'RIGHT';
            else if(this.snake[0].y == h_units) this.dir = 'LEFT';
            else if(collideLeft && !this.issetBodyParts('RIGHT')){
                this.dir = 'RIGHT';
            }
            else if(collideRight && !this.issetBodyParts('LEFT')){
                this.dir = 'LEFT';
            }
            else if(this.issetBodyParts('RIGHT')){
                this.dir = 'LEFT';
            }
            else if(this.issetBodyParts('LEFT')){
                this.dir = 'RIGHT';
            }
            else{
                const a = Math.floor(Math.random() * 2 + 1);
                if(a === 1) this.dir = 'LEFT';
                else this.dir = 'RIGHT';
            }
        };
        
    }
}

const snake = new Snake();
const food = new Food();

document.addEventListener('keydown', snake.direction);

function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.draw();
        food.draw();
        document.getElementsByTagName('span')[0].textContent = snake.score;
        document.getElementsByTagName('span')[1].textContent = snake.maxScore;
}

function update(){
    snake.ia(food);
    snake.update();
    if(snake.head().x === food.food.x && snake.head().y === food.food.y){
        snake.eat();
        food.eated(snake.snake);
    }
}

let timer = setInterval(function (){
    if(snake.alive){
        update();
        draw();
    }
}, 50)

