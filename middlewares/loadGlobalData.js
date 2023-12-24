

const Category = require('../models/categories'); // Подключите вашу модель категорий

const loadCategories = async (req, res, next) => {
    try {
        res.locals.categories = await Category.find({}); // Добавляем данные категорий в объект res.locals
        next();
    } catch (err) {
        // Обработка ошибок, если запрос не удался
        next(err);
    }
};

module.exports = loadCategories;
