$(document).ready(function() {
    var count = 0;
    var temp_x = 0;
    var temp_y = 0;
    var curr_x = 0;
    var curr_y = 0;
    var prev_x = 0;
    var prev_y = 0;
    var angle = 0;
    var angle_average = 0;
    var angle_array = [];
    var x_vals = [];
    var y_vals = [];
    var scrollAmount = parseInt($(window).height() * 0.65, 10);

    //Create event to capture mouse location
    $("body").mousemove(function(event) {
        curr_x = event.pageX;
        curr_y = event.pageY;
    });

    //Updates DOM, and calculates angle values
    var updateDOM = function() {
            //Save state of current x,y mouse location
            temp_x = curr_x;
            temp_y = curr_y;

            //If mouse doesn't move, don't update
            if (temp_x === prev_x && temp_y === prev_y) return;

            //Only use 2 angles
            if (count == 2) {
                $('.coords').remove();
                count = 0;
            }

            //Get the angle of the 2 points above
            if (prev_x !== 0) {
                angle = Math.atan2(prev_x - temp_x, prev_y - temp_y);
                
                if (angle < 0) angle += 2 * Math.PI;
                
                angle *= (180 / Math.PI);


                angle_array[angle_array.length] = angle;
            }

            x_vals[x_vals.length] = temp_x;
            y_vals[y_vals.length] = temp_y;


            var info = "x: " + temp_x + ", y: " + temp_y + ", " + Math.round(angle) + "deg, variance: " + Math.round(angle_array.variance()) + ' [' + angle_array[0] + ',' + angle_array[1] + ']';
            $("#mouse-coords").text(info);

            //Update the red dots position
            var div = $('<div class="coords"></div>').css({
                'top': temp_y + 'px',
                'left': temp_x + 'px'
            });

            $("body").append(div);

            count++;

            prev_x = curr_x;
            prev_y = curr_y;
        };


    //See if an array is sorted by a +/- threshold of 5, ascending
    Array.prototype.inOrderAsc = function() {

        var variance_threshold = 5;

        for (var i = 1; i < this.length; i++) {
            var a = this[i];
            var b = this[i - 1];
            if (a < b) if (Math.abs(a - b) > variance_threshold) return false;
        }


        //Difference between first and last
        if (Math.abs(this[0] - this[this.length]) < 30) return false;

        return true;
    };


    //See if an array is sorted by a +/- threshold of 5, descending
    Array.prototype.inOrderDesc = function() {

        var variance_threshold = 5;

        for (var i = 1; i < this.length; i++) {
            var a = this[i];
            var b = this[i - 1];
            if (a > b) if (Math.abs(b - a) > variance_threshold) return false;
        }

        //Difference between first and last
        if (Math.abs(this[0] - this[this.length]) < 30) return false;

        return true;
    };

    //Update the type of gesture every x ms
    var updateGesture = function() {
            var gestures = {
                'verticalLineUp': "Vertical Line, Direction: Up",
                'verticalLineDown': "Vertical Line, Direction: Down",
                'horizontalLineLeft': "Horizontal Line, Direction: Left",
                'horizontalLineRight': "Horizontal Line, Direction: Right",
                'circleCC': "Circle, counter-clockwise",
                'circleC': "Circle, clockwise",
                'unknown': "searching..."
            };

            //Retreive statistical values to analyze
            angle_average = angle_array.average();
            var variance_angle = angle_array.variance();
            var variance_x = x_vals.variance();
            var variance_y = y_vals.variance();

            console.log('angle average: ' + angle_array.average() + ', angle var: ' + variance_angle + ', x variance: ' + variance_x + ', y variance: ' + variance_y);


            //Test for counter clockwise circle
            if (angle_array.inOrderAsc() && variance_angle >= 250) {
                $('#gesture-type').text(gestures.circleCC);
                
                //Scroll the page Up
                $('html, body').stop().animate({
                    scrollTop: window.pageYOffset - scrollAmount
                }, 1500,'easeOutQuad');
            }

            //Test for clockwise circle
            else if (angle_array.inOrderDesc() && variance_angle >= 250) {
                $('#gesture-type').text(gestures.circleC);
                
                //Scroll the page Down
                $('html, body').stop().animate({
                    scrollTop: window.pageYOffset + scrollAmount
                //}, 1500,'easeInOutExpo');
                }, 1500, 'easeOutQuad');
            }

            //Test for Vertical Line, Direction Down, **before testing up**
            else if (variance_x <= 30 && angle_average >= 160 && angle_average <= 190 && variance_angle <= 40) {
                $('#gesture-type').text(gestures.verticalLineDown);
            }

            //Test for Vertical Line, Direction: Up
            else if (variance_x <= 30 && (angle_average <= 20 || angle_average >= 340)) {
                $('#gesture-type').text(gestures.verticalLineUp);
            }
            
            //Test for Horizontal Line, Direction Left
            else if (variance_y <= 10 && angle_average >= 70 && angle_average <= 110) {
                $('#gesture-type').text(gestures.horizontalLineLeft);
            }
            
            //Test for Horizontal Line, Direction Right
            else if (variance_y <= 10 && angle_average >= 250 && angle_average <= 290) {
                $('#gesture-type').text(gestures.horizontalLineRight);
            }

            else $('#gesture-type').text(gestures.unknown);

            
            //Remove values to restart
            x_vals.splice(0);
            y_vals.splice(0);
            angle_array.splice(0);
        };

    //Set up timers
    $('body').everyTime('25ms', updateDOM, 0);
    $('body').everyTime('300ms', updateGesture, 0);
});