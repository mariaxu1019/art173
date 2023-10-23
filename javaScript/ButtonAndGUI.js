class Button {
    constructor(label, onClick) {
        this.label = label;
        this.onClick = onClick;

        this.button = createButton(this.label);
        this.button.addClass("button");
        this.button.parent("gui-container");

        this.button.mousePressed(this.onClick);

        this.button.mouseOver(this.disableDrawingOnCanvas.bind(this));
        this.button.mouseOut(this.enableDrawingOnCanvas.bind(this));
    }

    disableDrawingOnCanvas() {
        disableDrawing = true;
    }

    enableDrawingOnCanvas() {
        disableDrawing = false;
    }
}

function buttonAddACreaturePress() {
    addAmoebas(random(width), random(height));
}

function buttonKillACreaturePress(){
    removeAmoebas();

}

function buttonRestartPress(){
    location.reload();
}

function updateFoodColor(r, g, b) {
    for (let i = 0; i < newFoods.length; i++) {
        newFoods[i].changeColor(color(r, g, b));
    }
}
