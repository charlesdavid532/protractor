$(function () {
    var GpivotX = 250;
    var GpivotY = 332;

    var Data = Backbone.Model.extend({
        defaults: {
    },
    initialize: function () {
    }
},
    {
        SMALLEST_RADIUS: 20,
        CENTER_X: 250,
        CENTER_Y: 260, // this is 400 - 40
        MAIN_CENTER_Y: 280,
        SECOND_CIRCLE_RADIUS: 150,
        THIRD_CIRCLE_RADIUS: 180,
        MAIN_CIRCLE_RADIUS: 220
    });

var ProtractorView = Backbone.View.extend({
    el: 'body',
    model: Data,
    ctx: null,
    rotate: null,
    isDown: null,
    ptX: null,
    ptY: null,
    pivot: null,
    initialAngle: null,
    containerLeft: null,
    containerTop: null,

    initialize: function () {
        this.createProtractor();
        this.rotate = 0;
        this.isDown = false;
    },

    events: {
        'mousedown #rotate-right': 'rotateMouseDown',
        'mousemove #container': 'rotateMouseMove',
        'mouseup #container': 'rotateMouseUp',
        'click #rotate-left': 'rotateLeft'

    },

    createProtractor: function () {
        this.ctx = $('#myCanvas')[0].getContext('2d');
        this.createSmallestSemiCircle();
        this.ctx.stroke();
        this.createSecondCircle();
        this.ctx.stroke();
        this.createLinesFromFirstToSecond();
        this.ctx.stroke();
        //this.trialTextRotation();
        this.createThirdCircle();
        this.ctx.stroke();
        this.createOuterMostCircle();
        this.ctx.stroke();
        this.drawBottomEdge();
        this.ctx.stroke();
        this.drawSmallMarkings();
        this.ctx.stroke();
        this.drawSecondSmallMarkings(Data.SECOND_CIRCLE_RADIUS);
        this.ctx.stroke();
        this.drawSecondSmallMarkings(Data.THIRD_CIRCLE_RADIUS);
        this.ctx.stroke();
    },
    createSmallestSemiCircle: function () {
        this.ctx.beginPath();
        this.ctx.arc(Data.CENTER_X, Data.CENTER_Y, Data.SMALLEST_RADIUS, Math.PI, Math.PI * 2);
        this.ctx.moveTo(Data.CENTER_X, Data.CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X, Data.CENTER_Y - Data.SMALLEST_RADIUS);
        this.ctx.moveTo(Data.CENTER_X + Data.SMALLEST_RADIUS, Data.CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X - Data.SMALLEST_RADIUS, Data.CENTER_Y);
        this.ctx.closePath();
    },
    createSecondCircle: function () {
        this.ctx.beginPath();
        this.ctx.arc(Data.CENTER_X, Data.CENTER_Y, Data.SECOND_CIRCLE_RADIUS, Math.PI, Math.PI * 2);
        this.ctx.closePath();
    },
    createThirdCircle: function () {
        this.ctx.beginPath();
        this.ctx.arc(Data.CENTER_X, Data.CENTER_Y, Data.THIRD_CIRCLE_RADIUS, Math.PI, Math.PI * 2);
        this.ctx.stroke();
        //this.ctx.closePath();
        var j = 0;
        for (var i = 180; i <= 360; i += 10) {
            var point3 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.THIRD_CIRCLE_RADIUS + 10, i);
            this.trialTextRotation(point3.x, point3.y, i, j);
            j += 10;
        }
    },
    createOuterMostCircle: function () {
        this.ctx.beginPath();
        this.ctx.arc(Data.CENTER_X, Data.CENTER_Y, Data.MAIN_CIRCLE_RADIUS, Math.PI, Math.PI * 2);
        this.ctx.stroke();
        //this.ctx.closePath();
    },
    createLinesFromFirstToSecond: function () {
        var j = 180;
        for (var i = 180; i <= 360; i += 10) {
            var point1 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.SMALLEST_RADIUS, i);
            var point2 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.SECOND_CIRCLE_RADIUS, i);
            var point3 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.SECOND_CIRCLE_RADIUS + 10, i);
            this.ctx.moveTo(point1.x, point1.y);
            this.ctx.lineTo(point2.x, point2.y);
            this.trialTextRotation(point3.x, point3.y, i, j);
            j -= 10;
        }
    },
    getPointOnCircle: function (cx, cy, r, a) {
        var Point = {
            x: null,
            y: null
        };
        Point.x = (cx + r * Math.cos(a * (Math.PI / 180)));
        Point.y = (cy + r * Math.sin(a * (Math.PI / 180)));
        return Point;
    },

    trialTextRotation: function (newx, newy, angle, text) {
        this.ctx.save();
        this.ctx.translate(newx, newy);
        this.ctx.rotate((Math.PI / 2) + (angle * (Math.PI / 180)));
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    },

    drawBottomEdge: function () {
        this.ctx.moveTo(Data.CENTER_X, Data.MAIN_CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X + Data.MAIN_CIRCLE_RADIUS, Data.MAIN_CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X + Data.MAIN_CIRCLE_RADIUS, Data.MAIN_CENTER_Y - 20);
        this.ctx.moveTo(Data.CENTER_X, Data.MAIN_CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X - Data.MAIN_CIRCLE_RADIUS, Data.MAIN_CENTER_Y);
        this.ctx.lineTo(Data.CENTER_X - Data.MAIN_CIRCLE_RADIUS, Data.MAIN_CENTER_Y - 20);
    },

    drawSmallMarkings: function () {
        var offset = 10;
        for (var i = 180; i <= 360; i++) {
            if ((i % 10) == 0) {
                offset = 18;
            }
            else if ((i % 5) == 0) {
                offset = 14;
            }
            else {
                offset = 10;
            }
            var point1 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.MAIN_CIRCLE_RADIUS - offset, i);
            var point2 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, Data.MAIN_CIRCLE_RADIUS, i);
            this.ctx.moveTo(point1.x, point1.y);
            this.ctx.lineTo(point2.x, point2.y);
        }
    },

    drawSecondSmallMarkings: function (rad) {
        for (var i = 180; i <= 360; i += 10) {
            var point1 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, rad - 4, i);
            var point2 = this.getPointOnCircle(Data.CENTER_X, Data.CENTER_Y, rad + 4, i);
            this.ctx.moveTo(point1.x, point1.y);
            this.ctx.lineTo(point2.x, point2.y);
        }
    },

    rotateLeft: function (ev) {
        this.rotate--;
        $("#canvas-container").css({ 'transform': 'rotate(' + this.rotate + 'deg)', '-ms-transform': 'rotate(' + this.rotate + 'deg)', '-webkit-transform': 'rotate(' + this.rotate + 'deg)' });
    },

    rotateMouseDown: function (ev) {
        var canvasTop = $("#inner-container").position().top;
        var canvasLeft = $("#inner-container").position().left;
        var canvasWidth = $("#inner-container").width();
        var canvasHeight = $("#inner-container").height();
        GpivotX = canvasLeft + (canvasWidth / 2);
        GpivotY = canvasTop + (canvasHeight);
        console.log(ev);
        this.isDown = true;
        this.ptX = ev.pageX;
        this.ptY = ev.pageY;
        // calculating initial angle..
        this.initialAngle = this.getInitialAngle($("#canvas-container").css("-webkit-transform"));
        console.log("initial angle is:::::" + this.initialAngle);
        // finished initial angle
    },

    rotateMouseMove: function (ev) {
        if (this.isDown) {
            $("#pivot-point-container").css({ left: GpivotX + 'px', top: GpivotY + 'px' });
            var pivotY = GpivotY,
            pivotX = GpivotX;
            //var angle1 = Math.atan((pivotY - this.ptY) / (pivotX - this.ptX)) * (180 / Math.PI);
            var angle1 = this.getAngle(this.ptX, pivotX, this.ptY, pivotY);
            var angle2 = this.getAngle(ev.pageX, pivotX, ev.pageY, pivotY);
            console.log("angle1:" + angle1);
            console.log("angle2:" + angle2);
            this.justRotate(this.initialAngle + angle2 - angle1);
        }
    },

    rotateMouseUp: function (ev) {
        this.isDown = false;
    },



    justRotate: function (angle) {
        console.log("final angle is::::" + angle);
        $("#canvas-container").css({ 'transform-origin': 'center bottom', '-webkit-transform-origin': 'center bottom', 'transform': 'rotate(' + angle + 'deg)', '-ms-transform': 'rotate(' + angle + 'deg)', '-webkit-transform': 'rotate(' + angle + 'deg)' });
        //$("#rotate-right-container").css({ 'transform-origin': 'center bottom', '-webkit-transform-origin': 'center bottom', 'transform': 'rotate(' + angle + 'deg)', '-ms-transform': 'rotate(' + angle + 'deg)', '-webkit-transform': 'rotate(' + angle + 'deg)' });
        //$("#inner-container").css({ 'transform-origin': 'center bottom', '-webkit-transform-origin': 'center bottom', 'transform-origin': 'center bottom', 'transform': 'rotate(' + angle + 'deg)', '-ms-transform': 'rotate(' + angle + 'deg)', '-webkit-transform': 'rotate(' + angle + 'deg)' });
    },

    stopResizing: function () {
        alert("stopped resizing");
    },

    getAngle: function (x1, x2, y1, y2) {
        var angle = null;
        var hypotenuse = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        angle = Math.acos((x2 - x1) / hypotenuse) * (180 / Math.PI);
        if (((x2 - x1) < 0) && ((y2 - y1) < 0)) {
            // 3rd quad
            console.log("3rd quad::::" + angle);
            angle = 180 + (180 - angle);
        }
        else if ((y2 - y1) < 0) {
            // 4th quad
            console.log("4th quad::::" + angle);
            angle = 270 + (90 - angle);
        }
        console.log("angle:::" + angle);
        return angle;
    },

    

    getInitialAngle: function (matrix) {
        
        if (typeof matrix === 'string' && matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else { var angle = 0; }
        return angle;
    }

});

var model = new Data();
var view = new ProtractorView({ model: model });
$("#canvas-container").resizable({
    alsoResize: "#inner-container"
});
$("#inner-container").on("resize", function (event, ui) {
    console.log("stopped1234");
    //alsoResize: "#canvas-container,#myCanvas"
    var canvasW = $("#inner-container").width();
    var canvasH = $("#inner-container").height();
    $("#rotate-right-container").css({ 'height': 32 + 'px', 'width': canvasW + 'px' });
    $("#myCanvas").css({ 'height': (canvasH - 32) + 'px', 'width': canvasW + 'px' });
    $("#rotate-right").css({ 'left': (canvasW / 2) + 'px'});
});

$("#inner-container").draggable({ cancel: "#rotate-right-container",
    drag: function (event, ui) {
        console.log("dragging");
        var canvasTop = $("#inner-container").position().top;
        var canvasLeft = $("#inner-container").position().left;
        var canvasWidth = $("#inner-container").width();
        var canvasHeight = $("#inner-container").height();
        console.log("top::" + canvasTop + "left::" + canvasLeft + "width::" + canvasWidth + "height::" + canvasHeight);
        /*
        var innerTop = $("#inner-container").position().top;
        var innerLeft = $("#inner-container").position().left;
        console.log("top::" + canvasTop + "left::" + canvasLeft + "width::" + canvasWidth + "height::" + canvasHeight);
        //$("#rotate-right").css({ 'left': (canvasLeft + (canvasWidth / 2)) + 'px', 'top': (canvasTop - 32) + 'px' });
        $("#inner-container").css({ 'left': (event.pageX - this.containerLeft + innerLeft) + 'px', 'top': (event.pageY - this.containerTop + innerTop) + 'px' });
        $("#canvas-container").css({ 'left': 0 + 'px', 'top': 0 + 'px' });
        */
        GpivotX = canvasLeft + (canvasWidth/2);
        GpivotY = canvasTop + (canvasHeight);
    },

    dragstart: function (event, ui) {

        console.log("in drag-start");
        /*
        this.containerTop = event.pageY;
        this.containerLeft = event.pageX;
        */

    }
});
});