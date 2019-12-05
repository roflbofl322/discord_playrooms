const mongoose = require('mongoose')
mongoose.connect('mongodb://dota2discord:456122@165.22.27.226/dota2_discord').then(() => {
console.log("Connected to Database");
}).catch((err) => {
console.log("Not Connected to Database ERROR! ", err);
});
let db = mongoose.connection;