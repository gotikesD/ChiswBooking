const log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/booking.log'), 'booking')

const logger = log4js.getLogger('booking');

module.exports  = logger;