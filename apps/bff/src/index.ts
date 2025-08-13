import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Import routes - temporarily commented out to debug
// import authRoutes from './routes/auth'
// import userRoutes from './routes/users'
// import productRoutes from './routes/products'
// import orderRoutes from './routes/orders'
// import wishlistRoutes from './routes/wishlist'
// import adminRoutes from './routes/admin' // Temporarily commented out

const app = express()
const PORT = process.env.BFF_PORT || 3005

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    process.env.STORE_APP_URL || 'http://localhost:3000',
    process.env.ADMIN_APP_URL || 'http://localhost:3001',
    process.env.ARTIST_APP_URL || 'http://localhost:3002',
    process.env.OPERATOR_APP_URL || 'http://localhost:3003',
    process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
    process.env.BFF_URL || 'http://localhost:3005'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(globalLimiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'BFF Server is running!',
    endpoints: {
      health: '/health',
      test: '/api/v1/test',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      wishlist: '/api/v1/wishlist'
    }
  })
})

// Simple test API endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint is working!',
    timestamp: new Date().toISOString()
  })
})

// Simple working auth routes
app.get('/api/v1/auth', (req, res) => {
  res.json({
    success: true,
    message: 'Auth endpoint is working!',
    availableEndpoints: ['/api/v1/auth/login', '/api/v1/auth/register']
  })
})

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required',
      code: 'MISSING_CREDENTIALS'
    })
  }
  
  // Simple mock authentication for testing
  if (email === 'artist1@artistryhub.com' && password === 'Artist2024!Creative#') {
    res.json({
      success: true,
      user: {
        id: '1',
        email: email,
        name: 'Artist 1',
        role: 'artist'
      },
      message: 'Login successful (mock)'
    })
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    })
  }
})

app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password, role } = req.body
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, password, and role are required',
      code: 'MISSING_FIELDS'
    })
  }
  
  res.status(201).json({
    success: true,
    user: {
      id: 'new-user-id',
      name,
      email,
      role
    },
    message: 'Registration successful (mock)'
  })
})

// Simple working user routes
app.get('/api/v1/users', (req, res) => {
  res.json({
    success: true,
    message: 'Users endpoint is working!',
    users: [
      { id: '1', name: 'Artist 1', email: 'artist1@artistryhub.com', role: 'artist' },
      { id: '2', name: 'Admin 1', email: 'admin@artistryhub.com', role: 'admin' }
    ]
  })
})

// Simple working product routes
app.get('/api/v1/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products endpoint is working!',
    products: [
      { id: '1', name: 'Sample Artwork 1', price: 100, artist: 'Artist 1' },
      { id: '2', name: 'Sample Artwork 2', price: 150, artist: 'Artist 1' }
    ]
  })
})

// Simple working order routes
app.get('/api/v1/orders', (req, res) => {
  res.json({
    success: true,
    message: 'Orders endpoint is working!',
    orders: [
      { id: '1', status: 'pending', total: 100 },
      { id: '2', status: 'completed', total: 150 }
    ]
  })
})

// Simple working wishlist routes
app.get('/api/v1/wishlist', (req, res) => {
  res.json({
    success: true,
    message: 'Wishlist endpoint is working!',
    items: [
      { id: '1', name: 'Wishlist Item 1', price: 100 },
      { id: '2', name: 'Wishlist Item 2', price: 150 }
    ]
  })
})

// API routes - temporarily commented out
// app.use('/api/v1/auth', authRoutes)
// app.use('/api/v1/users', userRoutes)
// app.use('/api/v1/products', productRoutes)
// app.use('/api/v1/orders', orderRoutes)
// app.use('/api/v1/wishlist', wishlistRoutes)
// app.use('/api/v1/admin', adminRoutes) // Temporarily commented out

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err)
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload',
      code: 'INVALID_JSON'
    })
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.originalUrl
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BFF server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔐 API base: http://localhost:${PORT}/api/v1`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
