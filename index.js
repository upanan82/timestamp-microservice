var express = require('express'),
    app = express(),
    path = require('path');

// Include home page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Reads and determines the format
app.get('/:query', function(req, res) {
    var dateA = req.params.query;
    if(!dateA.match(/^\d+$/)) {
        naturalDate(dateA, res);
        return 0;
    }
    else {
        unixDate(dateA, res);
        return 0;
    }
});

// Normal format
function naturalDate(dateA, res) {
    var date = dateA.split(/[\s]/);
    if (date.length > 3 || date.length < 2) {
        error(res);
        return 0;
    }
    else if (date.length == 2) {
        date.push('1');
        var arg = date[2];
        date[2] = date[1];
        date[1] = arg;
    }
    else {
        date[1] = date[1].replace(/,/g, '');
        date[2] = date[2].replace(/,/g, '');
    }
    var month = date[0].substr(0, 3);
    switch (month.toUpperCase()) {
        case 'DEC': date[0] = 12; break;
        case 'NOV': date[0] = 11; break;
        case 'OCT': date[0] = 10; break;
        case 'SEP': date[0] = 9; break;
        case 'AUG': date[0] = 8; break;
        case 'JUL': date[0] = 7; break;
        case 'JUN': date[0] = 6; break;
        case 'MAY': date[0] = 5; break;
        case 'APR': date[0] = 4; break;
        case 'MAR': date[0] = 3; break;
        case 'FEB': date[0] = 2; break;
        case 'JAN': date[0] = 1; break;
        default: date[0] = 0;
    }
    if (date[0] == 0 || !validDate(date[0], date[1], date[2])) {
        error(res);
        return 0;
    }
    else {
        var monthA = func(date[0]);
        if (date[0] < 10) date[0] = '0' + date[0];
        if (date[1] < 10) date[1] = '0' + date[1];
        result(new Date(date[2] + '.' + date[0] + '.' + date[1]).getTime() / 1000, monthA, date[1], date[2], res);
    }
}

// UNIX format
function unixDate(dateA, res) {
    var date = new Date();
    date.setTime(Number(dateA) * 1000);
    if (isNaN(date.getDate()) || isNaN(date.getFullYear()) || isNaN(date.getMonth())) {
        error(res);
        return 0;
    }
    var month = func((date.getMonth() + 1));
    var d;
    if (date.getDate() < 10) d = '0' + date.getDate();
    else d = date.getDate();
    result(Number(dateA), month, d, date.getFullYear(), res);
}

// Verification of date
function validDate(m, d, y) {
    var dd = new Date(y + '/' + m + '/' + d);
    if (y != dd.getFullYear() || m != (dd.getMonth() + 1) || d != dd.getDate())
        return false;
    else return true;
}

// Error function
function error(res) {
    var event = {unix: null, natural: null};
    res.send(JSON.stringify(event));
}

// Result function
function result(unixF, m, d, y, res) {
    var event = {unix: unixF, natural: m + ' ' + d + ', ' + y};
    res.send(JSON.stringify(event));
}

// Selection of the month
function func(month) {
    switch (month) {
        case 12: return 'December';
        case 11: return 'November';
        case 10: return 'October';
        case 9: return 'September';
        case 8: return 'August';
        case 7: return 'July';
        case 6: return 'June';
        case 5: return 'May';
        case 4: return 'April';
        case 3: return 'March';
        case 2: return 'February';
        case 1: return 'January';
        default: return '';
    }
}

// Listen port
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});