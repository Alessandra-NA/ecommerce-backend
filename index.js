const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const cors = require('cors');
var cookies = require("cookie-parser");

const corsOptions = {
  origin: 'http://localhost:4200', // Reemplaza con el origen de tu aplicación Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   secure: true,
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varias versiones de UC Browser) no admiten cors preflight requests sin esta opción
};
app.use(cors(corsOptions));

app.use(cookies());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/index'));



app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  try {
    await db.sync({ force: false });
  } catch (err) {
    console.log(err);
  }
})