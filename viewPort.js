class ViewPort{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;
        this.center = new Point(canvas.width/2, canvas.height/2);
        this.offset = scale(this.center, -1);   //to keep inital offset at center    new Point(0,0);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        };

        this.#addEventListeners();
    }

    getMouse(evt, subtractDragOffset = false){              //subtractdragoffset for when dragging and to maintain intent in grapheditor
        const p = new Point(
            (evt.offsetX - this.center.x) * this.zoom  - this.offset.x,
            (evt.offsetY - this.center.y) * this.zoom  - this.offset.y    //subtracting offset to keep clicking at center after zooming
        );

        return subtractDragOffset ? subtract(p, this.drag.offset) : p;  //subtract when dragging to display intent
    }

    reset(){
        this.ctx.restore();
        this.ctx.clearRect(0,0, myCanvas.width, myCanvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);        //to keep things at center while zooming.
        this.ctx.scale(1/this.zoom, 1/this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y); 
    }

    getOffset(){
        return add(this.offset, this.drag.offset);
    }

    #addEventListeners(){
        this.canvas.addEventListener("mousewheel", (evt)=>{
            this.#handleMouseWheel(evt);
        });
        this.canvas.addEventListener("mousedown", (evt)=>{
            this.#handleMouseDown(evt);
        });
        this.canvas.addEventListener("mouseup", (evt)=>{
            this.#handleMouseUp(evt);
        });
        // window.addEventListener("keydown", (evt) => {
        //     if (evt.code === "Space") {
        //         this.#handleSpacebarDown(evt);
        //     }
        // });

        // // Change mouseup to spacebar
        // window.addEventListener("keyup", (evt) => {
        //     if (evt.code === "Space") {
        //         this.#handleSpacebarUp(evt);
        //     }
        // });

        this.canvas.addEventListener("mousemove", (evt)=>{
            this.#handleMouseMove(evt);
        });
    }

    #handleMouseWheel(evt){
        const dir = Math.sign(evt.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5,this.zoom));   
    }

    #handleMouseDown(evt){
        if(evt.button == 1){
            this.drag.start = this.getMouse(evt);
            this.drag.active = true;
        }
    }

    #handleMouseMove(evt){
        if(this.drag.active){
            this.drag.end = this.getMouse(evt);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }

    #handleMouseUp(evt){
        if(this.drag.active){
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            };
            this.drag.active = false;  
        }
        
    }

    
}