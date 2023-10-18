import { find } from 'weather-js';

find({search: 'St. John\'s, NL', degreeType: 'C'}, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, 2));
        console.log(result[0].current.temperature);
    }
});