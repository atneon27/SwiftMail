import { createLogger, format, transports } from 'winston';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure logs directory exists
const logDir = join(process.cwd(), 'logs');
if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

// Create the logger
const logger = createLogger({
    level: 'info', // Adjust logging level as needed
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        // Log errors to errors.log
        new transports.File({ filename: join(logDir, 'errors.log'), level: 'error' }),
        // Log all levels to combined.log
        new transports.File({ filename: join(logDir, 'combined.log') }),
    ],
});

// Add a console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

export default logger;
