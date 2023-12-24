const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const dashRoutes = require('./routes/dashboard');
const paymentRoutes = require('./routes/payment');
const loadCategories = require('./middlewares/loadGlobalData');

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
console.log(__dirname, '/pu1234567876543blic');
console.log(path.join(__dirname, '/views'));
//mongodb://localhost:27017
mongoose.connect('mongodb+srv://rysbekdossayev:Laravel5@cluster0.guazwsy.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Соединение с базой данных установлено"))
    .catch(err => console.error("Ошибка подключения к базе данных:", err));


app.use(loadCategories);
// seed DB
// const seed = require('./seedDB');
// seed();

// session and flash messages config
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
};
app.use(session(sessionConfig));
app.use(flash());

// // Inint the passport and sessions for storing the users
app.use(passport.initialize());
app.use(passport.session());

// Configuring the passport to use local strategy

passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// Routes

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(dashRoutes);
app.use(paymentRoutes);

app.get('/', (req, res) => {
    res.redirect('/products');
});
app.all('*', (req, res) => {
    res.render('404');
});
app.listen(process.env.DEV_PORT || 3000, () => {
    console.log('Server running on port '+process.env.DEV_PORT);
});
