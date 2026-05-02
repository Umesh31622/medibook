// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// // Load environment variables
// dotenv.config();

// // Connect to database
// connectDB();

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// // Add after other routes
// const categoryRoutes = require('./routes/categoryRoutes');
// // Add after other routes
// const patientRoutes = require('./routes/patientRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/api/patients', patientRoutes);
// // Home route
// app.get('/', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Authentication API is running',
//         version: '1.0.0',
//         endpoints: {
//             auth: {
//                 register: 'POST /api/auth/register',
//                 login: 'POST /api/auth/login',
//                 profile: 'GET /api/auth/me',
//                 update: 'PUT /api/auth/update'
//             },
//             admin: {
//                 getAllUsers: 'GET /api/admin/users',
//                 getUser: 'GET /api/admin/users/:id',
//                 createUser: 'POST /api/admin/users',
//                 updateUser: 'PUT /api/admin/users/:id',
//                 deleteUser: 'DELETE /api/admin/users/:id'
//             }
//         }
//     });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/categories', categoryRoutes);
// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route ${req.originalUrl} not found`
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('Error:', err.message);
//     res.status(500).json({
//         success: false,
//         message: err.message || 'Internal server error'
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5008;
// app.listen(PORT, () => {
//     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//     console.log(`✅ API ready for testing\n`);
// });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
// Add after other routes
const billRoutes = require('./routes/billRoutes');
// Add after other routes
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
// Add after other routes
// Add after other routes
const quickBillRoutes = require('./routes/quickBillRoutes');
const reportRoutes = require('./routes/reportRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
// Add after other routes
const dentalLabRoutes = require('./routes/dentalLabRoutes');
const clinicalVisitRoutes = require('./routes/clinicalVisitRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const planRoutes = require('./routes/planRoutes');

const app = express();

// ✅ Middleware - Ye pehle hona chahiye
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Home route - Pehle define karo
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MediBook API is running',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/me',
                update: 'PUT /api/auth/update'
            },
            admin: {
                getAllUsers: 'GET /api/admin/users',
                getUser: 'GET /api/admin/users/:id',
                createUser: 'POST /api/admin/users',
                updateUser: 'PUT /api/admin/users/:id',
                deleteUser: 'DELETE /api/admin/users/:id'
            },
            categories: {
                getAll: 'GET /api/categories',
                create: 'POST /api/categories',
                update: 'PUT /api/categories/:id',
                delete: 'DELETE /api/categories/:id'
            },
            patients: {
                getAll: 'GET /api/patients',
                create: 'POST /api/patients',
                getOne: 'GET /api/patients/:id',
                update: 'PUT /api/patients/:id',
                delete: 'DELETE /api/patients/:id'
            }
        }
    });
});

// ✅ API Routes - Middleware ke baad
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);  // ✅ Ab sahi jagah hai
app.use('/api/bills', billRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/quickbills', quickBillRoutes);
app.use('/api/dental-lab', dentalLabRoutes);
app.use('/api/reports', reportRoutes);
// Add after other routes
app.use('/api/clinical-visits', clinicalVisitRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/plans', planRoutes);
// Add after other routes

app.use('/api/transactions', transactionRoutes);
// ❌ 404 handler - Last mein hona chahiye (ye sahi hai)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// ❌ Error handler - Bilkul last mein (ye sahi hai)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ API ready for testing\n`);
    console.log(`📋 Patient API: http://localhost:${PORT}/api/patients`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});