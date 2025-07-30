const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const { 
  logger, 
  createErrorResponse, 
  createSuccessResponse, 
  asyncHandler,
} = require("../utils/errorHandler");

const router = express.Router();

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    logger.warn('Login attempt with missing credentials', {
      hasUsername: !!username,
      hasPassword: !!password,
      ip: req.ip
    });
    
    return res.status(400).json(
      createErrorResponse(
        'Username and password are required', 
        400,
        { 
          missingFields: {
            username: !username,
            password: !password
          }
        }
      )
    );
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    logger.warn('Login attempt with invalid data types', {
      usernameType: typeof username,
      passwordType: typeof password,
      ip: req.ip
    });
    
    return res.status(400).json(
      createErrorResponse('Username and password must be strings', 400)
    );
  }
  
  if (username.length < 3 || password.length < 6) {
    logger.warn('Login attempt with invalid field lengths', {
      usernameLength: username.length,
      passwordLength: password.length,
      ip: req.ip
    });
    
    return res.status(400).json(
      createErrorResponse(
        'Username must be at least 3 characters and password at least 6 characters', 
        400
      )
    );
  }
  
  next();
};

router.post("/", validateLoginInput, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  try {
    logger.info('Login attempt', {
      username,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      logger.warn('Failed login attempt', {
        username,
        ip: req.ip,
        reason: 'Invalid credentials'
      });
      
      return res.status(401).json(
        createErrorResponse(
          'Invalid username or password', 
          401,
          { attemptedUsername: username }
        )
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username,
        loginTime: new Date().toISOString()
      }, 
      "secret123", 
      { 
        expiresIn: "1h",
        issuer: "book-manager-api",
        subject: user.username
      }
    );
    
    logger.info('Successful login', {
      username: user.username,
      ip: req.ip,
      tokenGenerated: true
    });

    res.json(createSuccessResponse(
      { 
        token,
        user: { username: user.username },
        expiresIn: '1h'
      },
      'Login successful'
    ));
    
  } catch (error) {
    logger.error('Login processing error', error, {
      username,
      ip: req.ip
    });
    
    throw new Error('Login service temporarily unavailable');
  }
}));

module.exports = router;
