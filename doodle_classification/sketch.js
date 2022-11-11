const len = 784;
const total_data = 1000;

/* map each category to a number */
const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;
const FISH = 3;

let cats_data;
let trains_data;
let rainbows_data;
let fishes_data;

/* object categories */
let cats = {};
let trains = {};
let rainbows = {};
let fishes = {};

/* neural network */
let nn;

/* load data from binary files */
function preload() {
    cats_data = loadBytes('data/cats1000.bin')
    trains_data = loadBytes('data/trains1000.bin')
    rainbows_data = loadBytes('data/rainbows1000.bin')
    fishes_data = loadBytes('data/fishes1000.bin')
}

/* split data into training and testing sets */
function prepareData(category, data, label) {
    category.training = [];
    category.testing = [];

    for (let i = 0; i < total_data; i++) {
        let offset = i * len;
        let threshold = floor(0.8 * total_data);
        if (i < threshold) {
            category.training[i] = data.bytes.subarray(offset, offset + len);
            category.training[i].label = label;
        } else {
            category.testing[i - threshold] = data.bytes.subarray(offset, offset + len);
            category.testing[i - threshold].label = label;
        }
    }
}

/* train for one epoch over all 2400 elements */
function trainEpoch(training) {
    shuffle(training, true);

    for (let i = 0; i < training.length; i++) {
        let data = training[i];
        let inputs = data.map(x => x / 255.0);
        let label = training[i].label;
        let targets = [0, 0, 0, 0];
        targets[label] = 1;

        /* compare guess to target, update weights */
        nn.train(inputs, targets);
    }
}

function testAll(testing) {

    let correct = 0;

    for (let i = 0; i < testing.length; i++) {
        let data = testing[i];
        let inputs = Array.from(data).map(x => x / 255.0);
        let label = testing[i].label;
        let targets = [0, 0, 0, 0];
        targets[label] = 1;
        let guess = nn.predict(inputs);

        let m = max(guess);
        let classification = guess.indexOf(m);

        if (classification === label) {
            correct++;
        }
    }
    let percent = 100 * correct / testing.length;
    return percent;
}

/* drawing function */
function draw() {
    strokeWeight(8);
    stroke(0);
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

function setup() {
    createCanvas(280, 280);
    background(255);
    prepareData(cats, cats_data, CAT);
    prepareData(rainbows, rainbows_data, RAINBOW);
    prepareData(trains, trains_data, TRAIN);
    prepareData(fishes, fishes_data, FISH);

    /*  making the neural network...
        inputs: 784
        hidden nodes: 64
        outputs: 3
    */
    nn = new NeuralNetwork(784, 64, 4);

    /* add all data to array and shuffle */
    let training = [];
    training = training.concat(cats.training);
    training = training.concat(rainbows.training);
    training = training.concat(trains.training);
    training = training.concat(fishes.training);

    /* add all data to array and shuffle */
    let testing = [];
    testing = testing.concat(cats.testing);
    testing = testing.concat(rainbows.testing);
    testing = testing.concat(trains.testing);
    testing = testing.concat(fishes.testing);

    let trainButton = select('#train');
    epochCounter = 0;
    trainButton.mousePressed(function () {
        trainEpoch(training);
        epochCounter++;
        console.log("Epoch: " + epochCounter)
    });

    let testButton = select('#test');
    testButton.mousePressed(function () {
        let percent = testAll(testing);
        console.log("Percent: " + nf(percent, 2, 2) + "%");
    });

    let guessButton = select('#guess');
    guessButton.mousePressed(function () {
        let inputs = [];
        let img = get(); /* grab all pixels from image */
        img.resize(28, 28);
        img.loadPixels();
        for (let i = 0; i < len; i++) {
            let bright = img.pixels[i * 4];
            inputs[i] = (255 - bright) / 255.0;
        }

        /* classify the input */
        let guess = nn.predict(inputs);
        let m = max(guess);
        let classification = guess.indexOf(m);
        if (classification === CAT) {
            console.log("cat");
        } else if (classification === RAINBOW) {
            console.log("rainbow");
        } else if (classification === TRAIN) {
            console.log("train");
        } else if (classification === FISH) {
            console.log("fish");
        }
    });

    let clearButton = select('#clear');
    clearButton.mousePressed(function () {
        background(255);
    });

    /* train data */
    // for (let i = 1; i < 6; i++) {
    //     trainEpoch(training);
    //     console.log("Epoch: " + i);
    //     let percent = testAll(testing);
    //     console.log("% correct: " + percent);
    // }
}