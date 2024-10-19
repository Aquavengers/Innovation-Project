  const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const path = require('path');

  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public')); // Serve static files from the public directory

  // File to store the textbox value
  const dataFilePath = path.join(__dirname, 'data.json');

  // Endpoint to get the stored value
  app.get('/get-value', (req, res) => {
      if (fs.existsSync(dataFilePath)) {
          const data = fs.readFileSync(dataFilePath);
          res.json(JSON.parse(data));
      } else {
          res.json({ value: '' });
      }
  });

  // Endpoint to save the textbox value
  app.post('/save-value', (req, res) => {
      const { value } = req.body;
      fs.writeFileSync(dataFilePath, JSON.stringify({ value }));
      res.sendStatus(200);
  });

  // Start the server
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
