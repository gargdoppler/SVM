import SVM from 'libsvm-js/asm';
import * as dl from './dataloader.js';
import * as param from './parameters.js';

var c = document.getElementById("plot");
var ctx = c.getContext('2d');
var imgData = ctx.getImageData(0, 0, c.width, c.height);
var data = imgData.data;

//Error Measuring function
const loss = (expected, actual) => {
    let incorrect = 0;
    let len = expected.length;
    for (let i in expected) {
        if (expected[i] != actual[i]) {
            incorrect++;
        }
    }
    return incorrect / len;
}

//HyperParameters:
var kernel;

export function retrain() {
    kernel = param.getKernel();
    switch (kernel) {
        case '0':
            kernel = SVM.KERNEL_TYPES.LINEAR;
            console.log("Kernel: Linear");
            break;

        case '1':
            kernel = SVM.KERNEL_TYPES.POLYNOMIAL;
            console.log("Kernel: Polynomail");
            break;

        case '2':
            kernel = SVM.KERNEL_TYPES.RBF;
            console.log("Kernel: RBF");
            break;

        case '3':
            kernel = SVM.KERNEL_TYPES.SIGMOID;
            console.log("Kernel: Sigmoid");
            break;

        default:
            kernel = SVM.KERNEL_TYPES.RBF;
            console.log("Kernel: RBF");
            break;

    }

    //The Main part: SVM!!!!!!
    console.log("Hey Nerd, Check this out!");
    console.log("Behold, the mighty Support Vector Machine!!!");
    console.log("\n<==========================================>\n\n\n");

    const svm = new SVM({
        kernel: kernel,
        type: SVM.SVM_TYPES.C_SVC,
        gamma: Math.pow(10, param.getGamma()),
        cost: Math.pow(10, param.getCost()),
        quiet: true
    });

    svm.train(dl.getData(), dl.getLabels());
    const svmPredictions = svm.predict(dl.getData());
    const svmCvPredictions = svm.crossValidation(dl.getData(), dl.getLabels(), 5);

    // Write the image back to the canvas
    for (var i = 0; i < data.length; i += 4) {
        var p = svm.predict([
            [((i / 4) - 250), ((i / (4 * c.width)) - 250)]
        ]);
        switch (p[0]) {
            case 0:
                console.log("0");
                imgData.data[i] = 255;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 255;
                break;
            case 1:
                console.log("1");
                imgData.data[i] = 255;
                imgData.data[i + 1] = 211;
                imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 255;
                break;
            default:
                imgData.data[i] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 0;
                break;
        }
    }

    ctx.putImageData(imgData, 0, 0);

    console.log("Loss for predictions: " + Math.round(loss(dl.getLabels(), svmPredictions) * 100) + "%");
    console.log("Loss for crossvalidated predictions: " + Math.round(loss(dl.getLabels(), svmCvPredictions) * 100) + "%\n\n");
}