const express = require('express');
const app = express();
const port = 5000;
const axios = require('axios');

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define another route
app.get('/summary', (req, res) => {
    res.send('summary page');
  });
  const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME;
   const KAGGLE_KEY = process.env.KAGGLE_KEY;
  const getKaggleData = async (dataset, fileName) => {
    const encodedDataset = encodeURIComponent(dataset);
    const url = `https://www.kaggle.com/api/v1/datasets/download/${encodedDataset}/${fileName}`;
  
    const response = await axios.get(url, {
      responseType: 'text',
      auth: {
        username: KAGGLE_USERNAME,
        password: KAGGLE_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response.data;
  };
  
  app.get('/data', async (req, res) => {
    try {
      const dataset = 'fatihilhan/electric-vehicle-specifications-and-prices';
      const fileName = 'EV_cars.csv';
      const csvData = await getKaggleData(dataset, fileName);
  
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
      });
  
      res.json(records);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
//   app.get('/data', async (req, res) => {
//     try {
//       const response = await axios.get('https://raw.githubusercontent.com/fatihilhan/electric-vehicle-specifications-and-prices/main/ev-specs-and-prices/EV_cars.csv');
//       const data = response.data;
      
//       // Parse CSV data to JSON
//       const records = parse(data, {
//         columns: true,
//         skip_empty_lines: true
//       });
      
//       res.json(records);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Failed to fetch data' });
//     }
//   });
  

//Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// const axios = require('axios');
// const express = require('express');
// const parse = require('csv-parse/lib/sync');

// const app = express();
// const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME;
// const KAGGLE_KEY = process.env.KAGGLE_KEY;

// const getKaggleData = async (dataset, fileName) => {
//   const encodedDataset = encodeURIComponent(dataset);
//   const url = `https://www.kaggle.com/api/v1/datasets/download/${encodedDataset}/${fileName}`;

//   const response = await axios.get(url, {
//     responseType: 'text',
//     auth: {
//       username: KAGGLE_USERNAME,
//       password: KAGGLE_KEY,
//     },
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return response.data;
// };

// app.get('/data', async (req, res) => {
//   try {
//     const dataset = 'fatihilhan/electric-vehicle-specifications-and-prices';
//     const fileName = 'EV_cars.csv';
//     const csvData = await getKaggleData(dataset, fileName);

//     const records = parse(csvData, {
//       columns: true,
//       skip_empty_lines: true,
//     });

//     res.json(records);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
