let strokeIndex = 0;
let index = 0;
let cat;
let prevx, prevy;

function setup() {
    createCanvas(255, 255);
    loadJSON('/cat', gotCat);
}

function draw() {
    if (cat) {
        let x = cat[strokeIndex][0][index];
        let y = cat[strokeIndex][1][index];
        stroke(0);
        strokeWeight(3);
        if (prevx !== undefined) {
            line(prevx, prevy, x, y);
        }
        index++;
        if (index >= cat[strokeIndex][0].length) {
            strokeIndex++;
            prevx = undefined;
            prevy = undefined;
            index = 0;
            if (strokeIndex === cat.length) {
                cat = undefined;
                strokeIndex = 0;
                //loadJSON('/cat', gotCat);
            }
        } else {
            prevx = x;
            prevy = y;
        }
    }
}

function gotCat(data) {
    background(250);
    cat = data.drawing;
    console.log(cat);
}