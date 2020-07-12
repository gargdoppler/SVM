// Importing the necessary libraries
import SVM from 'libsvm-js/asm';
import IrisDataset from 'ml-dataset-iris';

//Loading the data
//SVM requires labels to be integers in libsvm. So, we need to map strings to integers here
const data = IrisDataset.getNumbers();
const labels = IrisDataset.getClasses().map(
    (elem) => IrisDataset.getDistinctClasses().indexOf(elem)
);

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
var kernel = document.getElementById("HP_KERNEL").value;

export function retrain() {
    kernel = document.getElementById("HP_KERNEL").value;
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
            console.log("Kernel: RBoF");
            break;

    }

    //The Main part: SVM!!!!!!
    console.log("Hey Nerd, Check this out!");
    console.log("Behold, the mighty Support Vector Machine!!!");
    console.log("\n<==========================================>\n\n\n");

    const svm = new SVM({
        kernel: kernel,
        type: SVM.SVM_TYPES.C_SVC,
        gamma: Math.pow(10, document.getElementById("HP_COST").value),
        cost: Math.pow(10, document.getElementById("HP_GAMMA").value),
        quiet: true
    });

    svm.train(data, labels);

    const svmPredictions = svm.predict(data);
    const svmCvPredictions = svm.crossValidation(data, labels, 5);

    console.log("Loss for predictions: " + Math.round(loss(labels, svmPredictions) * 100) + "%");
    console.log("Loss for crossvalidated predictions: " + Math.round(loss(labels, svmCvPredictions) * 100) + "%\n\n");
}