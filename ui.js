import * as dtl from './dataloader';
var l = 0;

$('#plot').click(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x - (c.width / 2);
    var y = e.pageY - pos.y - (c.height / 2);
    var label = l;
    console.log(label);
    drawCircle((x + (c.width / 2)), (y + (c.height / 2)), label);
    dtl.newData(x, y, label);
});

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

var c = document.getElementById("plot");
var ctx = c.getContext("2d");
ctx.moveTo(0, (c.height / 2));
ctx.lineTo(c.width, (c.height / 2));
ctx.moveTo((c.width / 2), 0);
ctx.lineTo((c.width / 2), c.height);
ctx.stroke();

function drawCircle(x, y, label) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.stroke();
    switch (label) {
        case 0:
            ctx.fillStyle = "red";
            break;
        case 1:
            ctx.fillStyle = "yellow";
            break;
        default:
            console.log(label);
            ctx.fillStyle = "black";
            break;
    }
    ctx.fill();
}

$('#red').click(function(e) {
    console.log('red');
    l = 0;
});
$('#yellow').click(function(e) {
    console.log('yellow');
    l = 1;
});
$('#blue').click(function(e) {
    console.log('blue');
    l = 0;
});
$('#green').click(function(e) {
    console.log('green');
    l = 1;
});