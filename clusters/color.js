const winston = require("winston");

// set up custom format.
const custom_format = winston.format.printf(({ level, message, timestamp}) => {
    return `[${timestamp}] ${level}: ${message}`;
  });
  
// set up color.
const custom_color = winston.format.combine(
    winston.format.colorize(),
    custom_format,
)

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        custom_color,
    ),
    transports: [new winston.transports.Console()],
});

module.exports = logger;