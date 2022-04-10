const express = require("express")

const app = express()

// var staticPath = path.join(__dirname, '/');
// app.use(express.static(staticPath));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3001);

const server = app.listen(app.get('port'), function() {
    console.log('listening');
});