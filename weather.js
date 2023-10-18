// Not currently used. Had trouble getting require to work on the browser.
const weather = require('weather-js');

weather.find({search: 'St. John\'s, NL', degreeType: 'C'}, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, 2));
        console.log(result[0].current.temperature);
    }
});