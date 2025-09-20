const mongoose = require('mongoose');
require('dotenv').config();

const connectData = async () => {
    try {
        await mongoose.connect('mongodb+srv://hungnguyenninhbinh2004_db_user:FvZqyxeE0X0llxS4@appshoe.sbcs1py.mongodb.net/appShoes?retryWrites=true&w=majority&appName=AppShoe').then(() => {
            console.log('Mongo connected');
        });
    } catch (error) {
        console.log(error);
        console.log('Can not connect');
    }
};

module.exports = connectData;