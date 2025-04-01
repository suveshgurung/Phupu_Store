const express = require('express');
const cors = require('cors');
const pool = require('./utilities/database-connection');

require('dotenv').config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: [
    "GET",
    "POST",
    "DELETE",
  ],
};

app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT;

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error!";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", async (req, res, next) => {
  try {
    const [result, fields] = await pool.query(`
      INSERT INTO users(name, email, phone_number)
      VALUES("Suvesh Gurung", "suveshgurung2@gmail.com", "9860654346")
      `);
  }
  catch (error) {
    console.log(error);
    return next(error.message);
  }

  console.log(result);
  console.log(fields);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "WOWOWOWOWOWO"
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
