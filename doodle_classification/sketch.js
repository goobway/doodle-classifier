const len = 784;
const total_data = 1000;

/* map each category to a number */
const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

let cats_data;
let trains_data;
let rainbows_data;

/* object categories */
let cats = {};
let trains = {};
let rainbows = {};

/* neural network */
let nn;

/* load data from binary files */
function preload() {
    cats_data = loadBytes('data/cats1000.bin')
    trains_data = loadBytes('data/trains1000.bin')
    rainbows_data = loadBytes('data/rainbows1000.bin')
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
        let targets = [0, 0, 0];
        targets[label] = 1;

        /* compare guess to target, update weights */
        nn.train(inputs, targets);
    }
}

function testAll(testing) {

    let correct = 0;

    for (let i = 0; i < testing.length; i++) {
        let data = testing[i];
        let inputs = data.map(x => x / 255.0);
        let label = testing[i].label;
        let targets = [0, 0, 0];
        targets[label] = 1;
        let guess = nn.predict(inputs);

        let m = max(guess);
        let classification = guess.indexOf(m);

        if (classification === label) {
            correct++;
        }
    }
    let percent = correct / testing.length;
    return percent;
}

function setup() {
    createCanvas(280, 280);
    background(0);
    prepareData(cats, cats_data, CAT);
    prepareData(rainbows, rainbows_data, RAINBOW);
    prepareData(trains, trains_data, TRAIN);

    /*  making the neural network...
        inputs: 784
        hidden nodes: 64
        outputs: 3
    */
    nn = new NeuralNetwork(784, 64, 3);

    /* add all data to array and shuffle */
    let training = [];
    training = training.concat(cats.training);
    training = training.concat(rainbows.training);
    training = training.concat(trains.training);

    /* add all data to array and shuffle */
    let testing = [];
    testing = testing.concat(cats.testing);
    testing = testing.concat(rainbows.testing);
    testing = testing.concat(trains.testing);

    /* train data */
    for (let i = 1; i < 6; i++) {
        trainEpoch(training);
        console.log("Epoch: " + i);
        let percent = testAll(testing);
        console.log("% correct: " + percent);
    }
}