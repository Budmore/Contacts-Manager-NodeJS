var fs = require('fs');
var config = require('../../../config');

var logService = {
    info: function(message) {
        const date = new Date();
        const isoString = date.toISOString();
        const currentDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const pathName = `${config.logsPathname}${currentDay}.log`;
        const messageTemplate = `${isoString}: ${message}\n`;


        fs.appendFile(pathName, messageTemplate, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
}


module.exports = {
    info: logService.info,
};
