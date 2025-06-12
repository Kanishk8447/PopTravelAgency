import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Agent {
  agent_id?: string;
  [key: string]: any;
}

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

const initiativesDir = path.join(__dirname, 'initiatives');
const initiativesFile = path.join(initiativesDir, 'initiatives.json');


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/list', (req, res) => {
  res.json({ message: 'This is your API list!' });
});

app.get('/initiatives', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(initiativesFile)) {
      // return res.status(200).json([]);
    }

    const fileContent = fs.readFileSync(initiativesFile, 'utf-8');
    const initiatives = JSON.parse(fileContent);

    res.status(200).json(initiatives);
  } catch (error) {
    console.error('Error retrieving initiatives:', error);
    // res.status(500).json({ error: "An error occurred while retrieving initiatives" });
  }
});

app.post('/initiative/create', (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.Initiative) {
      // return res.status(400).json({ error: "Invalid data format. 'Initiative' key is missing." });
    }

    if (!fs.existsSync(initiativesDir)) {
      fs.mkdirSync(initiativesDir);
    }

    let initiatives = [];

    if (fs.existsSync(initiativesFile)) {
      const fileContent = fs.readFileSync(initiativesFile, 'utf-8');
      initiatives = JSON.parse(fileContent);
    }
          console.log('Received data:', data);


    // Generate a unique ID for the initiative
    data.Initiative.id = uuidv4();
      console.log('Received ID:', data.Initiative.id);

    // Generate unique IDs for each agent
    if (data.Initiative.Agents && Array.isArray(data.Initiative.Agents)) {
      data.Initiative.Agents = data.Initiative.Agents.map((agent: Agent) => ({
        ...agent,
        agent_id: uuidv4()
      }));
    }

    // Update created_on and modified_on
    const currentDate = new Date().toISOString();
    data.Initiative.created_on = currentDate;
    data.Initiative.modified_on = currentDate;

    initiatives.push(data.Initiative);

    fs.writeFileSync(initiativesFile, JSON.stringify(initiatives, null, 2));
    console.log('Initiative created successfully:', data.Initiative.id);
    // res.status(201).json({ 
    //   message: "Initiative created successfully", 
    //   initiative_id: data.Initiative.id
    // });
  } catch (error) {
    console.error('Error creating initiative:', error);
    // res.status(500).json({ error: "An error occurred while creating the initiative" });
  }
});

// // Add the new POST endpoint for creating initiatives
// app.post('/initiative/create', (req: Request, res: Response) => {
//   try {
//     const data = req.body;

//     // Check if the data has the expected structure
//     if (!data.Initiative) {
//       console.log('Received data:', data);
//       // return res.status(400).json({ error: "Invalid data format. 'Initiative' key is missing." });
//     }

//     // Create 'initiatives' directory if it doesn't exist
//     const initiativesDir = path.join(__dirname, 'initiatives');
//     if (!fs.existsSync(initiativesDir)) {
//       fs.mkdirSync(initiativesDir);
//     }

//     const fileName = 'initiatives.json';
//     const filePath = path.join(initiativesDir, fileName);

//     let initiatives = [];

//     // Read existing initiatives if file exists
//     if (fs.existsSync(filePath)) {
//       const fileContent = fs.readFileSync(filePath, 'utf-8');
//       initiatives = JSON.parse(fileContent);
//     }

//     // Add new initiative
//     initiatives.push(data.Initiative);

//     // Write updated initiatives back to file
//     fs.writeFileSync(filePath, JSON.stringify(initiatives, null, 2));

//     // res.status(201).json({ message: "Initiative created successfully", file_name: fileName });
//   } catch (error) {
//     console.error('Error creating initiative:', error);
//     // res.status(500).json({ error: "An error occurred while creating the initiative" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
