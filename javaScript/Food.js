class Food{
    static count = 0;
    constructor(_x,_y,_r,canvas){
        this.location = new createVector(_x,_y);
        this.r = _r;
        this.color = color(93, 187, 99, 190);
        this.canvas = canvas;
        this.id = ++Food.count;
    }

    display(){
        this.canvas.push();
        this.canvas.fill(this.color);
        this.canvas.noStroke();
        this.canvas.circle(this.location.x,this.location.y,this.r);
        this.canvas.pop();
    }

    changeColor(c){
        this.color = c;
    }

}