var svm = require("svm");

var N = 10; //number of data points
var data = new Array(N);
var labels = new Array(N);
var wb; // weights and offset structure
var ss = 50.0; // scaling factor for drawing
var trainstats;
var dirty = true;

var rbfKernelSigma = 0.5;
var svmC = 1.0;
var SVM = new svm.SVM();

var kernelid = document.getElementById("kernel");
var c = document.getElementById("NPGcanvas");
var ctx = c.getContext('2d');

data[0] = [-0.4326, 1.1909];
data[1] = [3.0, 4.0];
data[2] = [0.1253, -0.0376];
data[3] = [0.2877, 0.3273];
data[4] = [-1.1465, 0.1746];
data[5] = [1.8133, 2.1139];
data[6] = [2.7258, 3.0668];
data[7] = [1.4117, 2.0593];
data[8] = [4.1832, 1.9044];
data[9] = [1.8636, 1.1677];
labels[0] = 1;
labels[1] = 1;
labels[2] = 1;
labels[3] = 1;
labels[4] = 1;
labels[5] = -1;
labels[6] = -1;
labels[7] = -1;
labels[8] = -1;
labels[9] = -1;

setChange(10);

function myinit() {
    retrainSVM();
}

function retrainSVM() {

    if (kernelid.value === "0") {
        trainstats = SVM.train(data, labels, { kernel: 'linear', C: svmC });
        wb = SVM.getWeights();
    }

    else if (kernelid.value === "1") {
        trainstats = SVM.train(data, labels, { kernel: 'rbf', rbfsigma: rbfKernelSigma, C: svmC });
    }
    

    dirty = true; // to redraw screen
}

function update() {}



function draw() {
    if (!dirty) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // draw decisions in the grid
    var density = 4.0;
    for (var x = 0.0; x <= WIDTH; x += density) {
        for (var y = 0.0; y <= HEIGHT; y += density) {
            var dec = SVM.marginOne([(x - WIDTH / 2) / ss, (y - HEIGHT / 2) / ss]);
            if (dec > 0) ctx.fillStyle = '#4169E1';
            else ctx.fillStyle = '#ffef00';
            ctx.fillRect(x - density / 2 - 1, y - density - 1, density + 2, density + 2);
        }
    }

    // draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();

    // draw datapoints. Draw support vectors larger
    ctx.strokeStyle = 'rgb(0,0,0)';
    for (var i = 0; i < N; i++) {

        if (labels[i] == 1) ctx.fillStyle = '#0080FF';
        else ctx.fillStyle = '#FFAA00';

        if (SVM.alpha[i] > 1e-2) ctx.lineWidth = 3; // distinguish support vectors
        else ctx.lineWidth = 1;

        drawCircle(data[i][0] * ss + WIDTH / 2, data[i][1] * ss + HEIGHT / 2, Math.floor(3 + SVM.alpha[i] * 5.0 / svmC));
    }

    // if linear kernel, draw decision boundary and margin lines
    if (kernelid.value == "0") {

        var xs = [-5, 5];
        var ys = [0, 0];
        ys[0] = (-wb.b - wb.w[0] * xs[0]) / wb.w[1];
        ys[1] = (-wb.b - wb.w[0] * xs[1]) / wb.w[1];
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // wx+b=0 line
        ctx.moveTo(xs[0] * ss + WIDTH / 2, ys[0] * ss + HEIGHT / 2);
        ctx.lineTo(xs[1] * ss + WIDTH / 2, ys[1] * ss + HEIGHT / 2);
        // wx+b=1 line
        ctx.moveTo(xs[0] * ss + WIDTH / 2, (ys[0] - 1.0 / wb.w[1]) * ss + HEIGHT / 2);
        ctx.lineTo(xs[1] * ss + WIDTH / 2, (ys[1] - 1.0 / wb.w[1]) * ss + HEIGHT / 2);
        // wx+b=-1 line
        ctx.moveTo(xs[0] * ss + WIDTH / 2, (ys[0] + 1.0 / wb.w[1]) * ss + HEIGHT / 2);
        ctx.lineTo(xs[1] * ss + WIDTH / 2, (ys[1] + 1.0 / wb.w[1]) * ss + HEIGHT / 2);

        for (var i = 0; i < N; i++) {
            if (SVM.alpha[i] < 1e-2) continue;
            if (labels[i] == 1) {
                ys[0] = (1 - wb.b - wb.w[0] * xs[0]) / wb.w[1];
                ys[1] = (1 - wb.b - wb.w[0] * xs[1]) / wb.w[1];
            } else {
                ys[0] = (-1 - wb.b - wb.w[0] * xs[0]) / wb.w[1];
                ys[1] = (-1 - wb.b - wb.w[0] * xs[1]) / wb.w[1];
            }
            var u = (data[i][0] - xs[0]) * (xs[1] - xs[0]) + (data[i][1] - ys[0]) * (ys[1] - ys[0]);
            u = u / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1]));
            var xi = xs[0] + u * (xs[1] - xs[0]);
            var yi = ys[0] + u * (ys[1] - ys[0]);
            ctx.moveTo(data[i][0] * ss + WIDTH / 2, data[i][1] * ss + HEIGHT / 2);
            ctx.lineTo(xi * ss + WIDTH / 2, yi * ss + HEIGHT / 2);
        }
        ctx.stroke();
    }

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText("Converged in " + trainstats.iters + " iterations.", 10, HEIGHT - 30);
    var numsupp = 0;
    for (var i = 0; i < N; i++) { if (SVM.alpha[i] > 1e-5) numsupp++; }
    ctx.fillText("Number of support vectors: " + numsupp + " / " + N, 10, HEIGHT - 50);

    if (kernelid.value === "1") ctx.fillText("Using Rbf kernel with sigma = " + rbfKernelSigma.toPrecision(2), 10, HEIGHT - 70);
    if (kernelid.value === "0") ctx.fillText("Using Linear kernel", 10, HEIGHT - 70);

    ctx.fillText("C = " + svmC.toPrecision(2), 10, HEIGHT - 90);
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function mouseClick(x, y, shiftPressed) {

    // add datapoint at location of click
    data[N] = [(x - WIDTH / 2) / ss, (y - HEIGHT / 2) / ss];
    labels[N] = shiftPressed ? 1 : -1;
    N += 1;

    // retrain the svm
    retrainSVM();
}

function keyUp(key) {

    if (key == 82) { // 'r'

        // reset to original data and retrain
        data = data.splice(0, 10);
        labels = labels.splice(0, 10);
        N = 10;
        retrainSVM();
    }
}

function keyDown(key) {}


// UI stuff
function refreshC(event, ui) {
    var logC = ui.value;
    svmC = Math.pow(10, logC);
    $("#creport").text("C = " + svmC.toPrecision(2));
    retrainSVM();
}

function eventClick(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    mouseClick(x, y, e.shiftKey);
}

function eventKeyUp(e) {
    var keycode = ('which' in e) ? e.which : e.keyCode;
    keyUp(keycode);
}

function eventKeyDown(e) {
    var keycode = ('which' in e) ? e.which : e.keyCode;
    keyDown(keycode);
}

function setChange(FPS) {

    canvas = document.getElementById('NPGcanvas');
    ctx = canvas.getContext('2d');
    
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    canvas.addEventListener('click', eventClick, false);
    document.addEventListener('keyup', eventKeyUp, true);
    document.addEventListener('keydown', eventKeyDown, true);
    document.addEventListener('change', updatekernel, true);
    setInterval(main, 1000 / FPS);

    myinit();
}

function updatekernel(){
    kernelid = document.getElementById("kernel"); 
    retrainSVM();
}

function main() {
    update();
    draw();
}

function refreshC(event, ui) {
    var logC = ui.value;
    svmC = Math.pow(10, logC);
    $("#creport").text("C = " + svmC.toPrecision(2));
    retrainSVM();
}

function refreshSig(event, ui) {
    var logSig = ui.value;
    rbfKernelSigma = Math.pow(10, logSig);
    $("#sigreport").text("RBF Kernel sigma = " + rbfKernelSigma.toPrecision(2));
    if (kernelid.value === "1") {
        retrainSVM();
    }
}



$(function() {
    // for C parameter
    $("#slider1").slider({
        orientation: "horizontal",
        animate: true,
        slide: refreshC,
        max: 2.0,
        min: -2.0,
        step: 0.1,
        value: 0.0
    });

    // for rbf kernel sigma
    $("#slider2").slider({
        orientation: "horizontal",
        slide: refreshSig,
        max: 2.0,
        min: -2.0,
        step: 0.1,
        value: 0.0
    });
});