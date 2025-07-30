const jwt = require("jsonwebtoken");
const { logger, AuthenticationError, AuthorizationError, createErrorResponse } = require("./utils/errorHandler");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      logger.warn('Missing authorization header', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json(
        createErrorResponse('Authorization header is required', 401)
      );
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      logger.warn('Missing token in authorization header', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json(
        createErrorResponse('Token is required', 401)
      );
    }

    jwt.verify(token, "secret123", (err, user) => {
      if (err) {
        logger.warn('Token verification failed', err, {
          url: req.url,
          method: req.method,
          ip: req.ip,
          tokenExpired: err.name === 'TokenExpiredError'
        });
        
        const message = err.name === 'TokenExpiredError' 
          ? 'Token has expired' 
          : 'Invalid token';
          
        return res.status(403).json(
          createErrorResponse(message, 403, { tokenError: err.name })
        );
      }
      
      req.user = user;
      logger.info('User authenticated successfully', {
        username: user.username,
        url: req.url,
        method: req.method
      });
      next();
    });
    
  } catch (error) {
    logger.error('Authentication middleware error', error, {
      url: req.url,
      method: req.method,
      ip: req.ip
    });
    
    return res.status(500).json(
      createErrorResponse('Authentication service error', 500)
    );
  }
};
