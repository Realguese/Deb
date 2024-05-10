class GraphEditor{
    constructor(viewPort, graph){      //canvas got changed to viewport and will take canvas from viewport
        this.viewPort = viewPort;
        this.canvas = viewPort.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.#addEventListeners();
    }

    #addEventListeners(){
        this.canvas.addEventListener("mousedown", (evt)=> {
            this.#handleMouseDown(evt);
        });

        this.canvas.addEventListener("mousemove", (evt)=> {
            this.#handleMouseMove(evt);
        });

        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
        this.canvas.addEventListener("mouseup", ()=> this.dragging = false);
    }

    #handleMouseMove(evt){
       // console.log("Mouse move event triggered at:", evt.offsetX, evt.offsetY);
        this.mouse = this.viewPort.getMouse(evt, true);                                            //this.mouse = new Point(evt.offsetX, evt.offsetY);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewPort.zoom);
        if(this.dragging == true){
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseDown(evt){
        // right click to delete point
        if(evt.button == 2){
            if(this.selected){
                this.selected = null;
            }
            else if (this.hovered){
                this.#removePoint(this.hovered);
            }
         }  
        
        // left click to add point
        if(evt.button == 0){
        if(this.hovered){
            this.#select(this.hovered);
            this.dragging = true;
            return;
        }
        this.graph.addPoint(this.mouse);
        this.#select(this.mouse);
        this.hovered = this.mouse;
    }
    }

    #removePoint(point){
        this.graph.removePoint(point);
        this.hovered = null;
        if(this.selected == point){
            this.selected = null;
        }  
    }

    #select(point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    dispose(){
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display(){
        this.graph.draw(this.ctx);
        if(this.hovered){
            this.hovered.draw(this.ctx, {fill : true })
        }
        if(this.selected){
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, {dash: [3,3] });
            this.selected.draw(this.ctx, {outline : true })
        }
    }
}