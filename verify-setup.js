// verify-setup.js
// Run this script to verify Tyler's setup is complete
// Usage: node verify-setup.js

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Moroni\'s Quest Setup for Tyler...\n');

let errors = [];
let warnings = [];
let success = [];

// Check required files
const requiredFiles = [
    { path: 'middleware/authenticate.js', desc: 'Authentication middleware' },
    { path: 'utilities/passport.js', desc: 'Passport configuration' },
    { path: 'routes/auth.js', desc: 'Authentication routes' },
    { path: 'routes/bomchallenges.js', desc: 'BOM Challenges routes' },
    { path: 'routes/photos.js', desc: 'Photos routes' },
    { path: 'routes/inquiries.js', desc: 'Inquiries routes' },
    { path: 'controllers/bomchallenges.js', desc: 'BOM Challenges controller' },
    { path: 'controllers/photos.js', desc: 'Photos controller' },
    { path: 'controllers/inquiries.js', desc: 'Inquiries controller' },
    { path: 'validation/bomchallengesValidation.js', desc: 'BOM Challenges validation' },
    { path: 'validation/photosValidation.js', desc: 'Photos validation' },
    { path: 'validation/inquiriesValidation.js', desc: 'Inquiries validation' },
    { path: 'tests/bomchallenges.rest', desc: 'BOM Challenges tests' },
    { path: 'tests/photos.rest', desc: 'Photos tests' },
    { path: 'tests/inquiries.rest', desc: 'Inquiries tests' },
    { path: 'tests/auth.rest', desc: 'Authentication tests' },
    { path: 'server.js', desc: 'Main server file' },
    { path: 'swagger.js', desc: 'Swagger configuration' },
    { path: 'package.json', desc: 'Package configuration' },
];

console.log('📁 Checking Required Files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
        success.push(`✅ ${file.desc} found`);
    } else {
        errors.push(`❌ Missing: ${file.path} (${file.desc})`);
    }
});

// Check .env file
console.log('\n🔐 Checking Environment Configuration...');
if (fs.existsSync('.env')) {
    success.push('✅ .env file exists');
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredEnvVars = [
        'MONGO_URL',
        'SESSION_SECRET',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL'
    ];
    
    requiredEnvVars.forEach(envVar => {
        if (envContent.includes(envVar)) {
            success.push(`✅ ${envVar} is set`);
        } else {
            errors.push(`❌ Missing environment variable: ${envVar}`);
        }
    });
} else {
    errors.push('❌ .env file not found');
    warnings.push('⚠️  Create .env from .env.example');
}

// Check package.json dependencies
console.log('\n📦 Checking Dependencies...');
if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
        'express',
        'mongodb',
        'body-parser',
        'dotenv',
        'express-session',
        'passport',
        'passport-google-oauth20',
        'swagger-autogen',
        'swagger-ui-express',
        'express-validator'
    ];
    
    const installedDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
    };
    
    requiredDeps.forEach(dep => {
        if (installedDeps[dep]) {
            success.push(`✅ ${dep} installed`);
        } else {
            errors.push(`❌ Missing dependency: ${dep}`);
        }
    });
}

// Check swagger.json
console.log('\n📚 Checking Swagger Documentation...');
if (fs.existsSync('swagger.json')) {
    success.push('✅ swagger.json generated');
} else {
    warnings.push('⚠️  swagger.json not found - run: npm run swagger');
}

// Check if auth is enabled in routes
console.log('\n🔒 Checking Authentication Implementation...');
const routeFiles = [
    'routes/bomchallenges.js',
    'routes/photos.js',
    'routes/inquiries.js'
];

routeFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('const { isAuthenticated') && 
            !content.includes('//const { isAuthenticated')) {
            success.push(`✅ Authentication enabled in ${file}`);
        } else {
            warnings.push(`⚠️  Authentication not yet enabled in ${file}`);
        }
    }
});

// Print Results
console.log('\n' + '='.repeat(60));
console.log('📊 SETUP VERIFICATION RESULTS');
console.log('='.repeat(60));

if (success.length > 0) {
    console.log('\n✅ SUCCESS (' + success.length + ' items)');
    success.forEach(msg => console.log('   ' + msg));
}

if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (' + warnings.length + ' items)');
    warnings.forEach(msg => console.log('   ' + msg));
}

if (errors.length > 0) {
    console.log('\n❌ ERRORS (' + errors.length + ' items)');
    errors.forEach(msg => console.log('   ' + msg));
    console.log('\n🚨 Please fix errors before proceeding.\n');
    process.exit(1);
} else {
    console.log('\n🎉 Setup verification complete! No critical errors found.');
    
    if (warnings.length > 0) {
        console.log('⚠️  Address warnings when ready.\n');
    } else {
        console.log('✨ Everything looks great! Ready to start testing.\n');
    }
    
    console.log('Next Steps:');
    console.log('1. npm install (if not done)');
    console.log('2. npm run swagger (if swagger.json missing)');
    console.log('3. npm start');
    console.log('4. Test authentication: http://localhost:3000/auth/login');
    console.log('5. Test API docs: http://localhost:3000/api-docs');
    console.log('6. Run .rest files in VS Code\n');
}