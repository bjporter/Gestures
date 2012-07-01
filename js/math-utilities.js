//from: http://javascript.about.com/library/blaravg.htm
Array.prototype.average = function() {
    var av = 0;
    var cnt = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var e = +this[i];

        if (!e && this[i] !== 0 && this[i] !== '0') e--;
        if (this[i] == e) {
            av += e;
            cnt++;
        }
    }
    return av / cnt;
};

//from: http://bateru.com/news/2011/03/javascript-standard-deviation-variance-average-functions/
var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

//from: http://bateru.com/news/2011/03/javascript-standard-deviation-variance-average-functions/
var getNumWithSetDec = function(num, numOfDec) {
        var pow10s = Math.pow(10, numOfDec || 0);
        return (numOfDec) ? Math.round(pow10s * num) / pow10s : num;
    };

//from: http://bateru.com/news/2011/03/javascript-standard-deviation-variance-average-functions/
var getAverageFromNumArr = function(numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var i = numArr.length,
            sum = 0;
        while (i--) {
            sum += numArr[i];
        }
        return getNumWithSetDec((sum / numArr.length), numOfDec);
    }

    //modified from: http://bateru.com/news/2011/03/javascript-standard-deviation-variance-average-functions/
    Array.prototype.variance = function(numOfDec) {
        if (!isArray(this)) {
            return false;
        }
        var avg = getAverageFromNumArr(this, numOfDec),
            i = this.length,
            v = 0;

        while (i--) {
            v += Math.pow((this[i] - avg), 2);
        }
        v /= this.length;
        return getNumWithSetDec(v, numOfDec);
    };