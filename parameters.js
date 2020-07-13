import * as svm from './svm.js';

//Cost Parameter
var sliderc = document.getElementById("HP_COST");
var outputc = document.getElementById("cost_value");
var intc = Math.pow(10, sliderc.value);
var expoc = Math.round(Number.parseFloat(sliderc.value) - 0.5);

if (expoc >= 0) {
    outputc.innerHTML = "cost &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + addZeroes(String(Math.round((intc / Math.pow(10, expoc)) * 100) / 100)) + "e+" + expoc + "&nbsp;&nbsp;&nbsp;";
} else {
    outputc.innerHTML = "cost &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + addZeroes(String(Math.round((intc / Math.pow(10, expoc)) * 100) / 100)) + "e" + expoc + "&nbsp;&nbsp;&nbsp;";
}
sliderc.onchange = function() {
    intc = Math.pow(10, this.value);

    expoc = Math.round(Number.parseFloat(this.value) - 0.5);

    if (expoc >= 0) {
        outputc.innerHTML = "cost &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + addZeroes(String(Math.round((intc / Math.pow(10, expoc)) * 100) / 100)) + "e+" + expoc + "&nbsp;&nbsp;&nbsp;";
    } else {
        outputc.innerHTML = "cost &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + addZeroes(String(Math.round((intc / Math.pow(10, expoc)) * 100) / 100)) + "e" + expoc + "&nbsp;&nbsp;&nbsp;";
    }

    svm.retrain();
}

//Gamma Parameter
var sliderg = document.getElementById("HP_GAMMA");
var outputg = document.getElementById("gamma_value");
var intg = Math.pow(10, sliderg.value);

var expog = Math.round(Number.parseFloat(sliderg.value) - 0.5);

if (expog >= 0) {
    outputg.innerHTML = "gamma &nbsp;&nbsp; " + addZeroes(String(Math.round((intg / Math.pow(10, expog)) * 100) / 100)) + "e+" + expog;
} else {
    outputg.innerHTML = "gamma &nbsp;&nbsp; " + addZeroes(String(Math.round((intg / Math.pow(10, expog)) * 100) / 100)) + "e" + expog;
}
sliderg.onchange = function() {
    intg = Math.pow(10, this.value);

    expog = Math.round(Number.parseFloat(this.value) - 0.5);

    if (expog >= 0) {
        outputg.innerHTML = "gamma &nbsp;&nbsp; " + addZeroes(String(Math.round((intg / Math.pow(10, expog)) * 100) / 100)) + "e+" + expog;
    } else {
        outputg.innerHTML = "gamma &nbsp;&nbsp; " + addZeroes(String(Math.round((intg / Math.pow(10, expog)) * 100) / 100)) + "e" + expog;
    }
    svm.retrain();
}

//Kernel
var kernel = document.getElementById("HP_KERNEL");
kernel.onchange = function() {
    svm.retrain();
}

function addZeroes(num) {
    const dec = num.split('.')[1]
    const len = dec && dec.length > 2 ? dec.length : 2
    return Number(num).toFixed(len)
}

export function getKernel() {
    return document.getElementById("HP_KERNEL").value;
}

export function getCost() {
    return Math.pow(10, sliderc.value);
}

export function getGamma() {
    return Math.pow(10, sliderg.value);
}