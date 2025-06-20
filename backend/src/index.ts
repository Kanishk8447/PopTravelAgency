import express, { Request, Response } from 'express';
import axios from 'axios';
const cors = require('cors');
const { DefaultAzureCredential } = require("@azure/identity");
const { CognitiveServicesManagementClient } = require("@azure/arm-cognitiveservices");
const { ClientSecretCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");
// import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
 
 
const app = express();
const port = 3000;
 
interface Agent {
  agent_id?: string;
  [key: string]: any;
}
 
app.use(cors());
app.use(express.json());
 
const initiativesDir = path.join(__dirname, 'initiatives');
const initiativesFile = path.join(initiativesDir, 'initiatives.json');
 
// You'll need to set these environment variables
const subscriptionId = '506ea6ff-a780-4e8e-9c93-d18de8274709';
// const credential = new DefaultAzureCredential();
 
const credential = new ClientSecretCredential(
  // 'd9255cd3-7bb7-4f1f-b476-48ec7a279f27',
  '0c3223d1-a9b0-4b67-ad95-0c87153dd862',
  'd9255cd3-7bb7-4f1f-b476-48ec7a279f27',
  'MmC8Q~yJbqs~SXoRIuTuJmrNqhA10g-zV-OmCatY'
);
 
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello, world!');
});
 
// app.get('/initiatives', (req: Request, res: Response) => {
//   try {
//     if (!fs.existsSync(initiativesFile)) {
//       // return res.status(200).json([]);
//     }
 
//     const fileContent = fs.readFileSync(initiativesFile, 'utf-8');
//     const initiatives = JSON.parse(fileContent);
 
//     res.status(200).json(initiatives);
//   } catch (error) {
//     console.error('Error retrieving initiatives:', error);
//     // res.status(500).json({ error: "An error occurred while retrieving initiatives" });
//   }
// });
 
// app.post('/initiative/create', (req: Request, res: Response) => {
//   try {
//     const data = req.body;
 
//     if (!data.Initiative) {
//       // return res.status(400).json({ error: "Invalid data format. 'Initiative' key is missing." });
//     }
 
//     if (!fs.existsSync(initiativesDir)) {
//       fs.mkdirSync(initiativesDir);
//     }
 
//     let initiatives = [];
 
//     if (fs.existsSync(initiativesFile)) {
//       const fileContent = fs.readFileSync(initiativesFile, 'utf-8');
//       initiatives = JSON.parse(fileContent);
//     }
//           console.log('Received data:', data);
 
 
//     // Generate a unique ID for the initiative
//     data.Initiative.id = uuidv4();
//       console.log('Received ID:', data.Initiative.id);
 
//     // Generate unique IDs for each agent
//     if (data.Initiative.Agents && Array.isArray(data.Initiative.Agents)) {
//       data.Initiative.Agents = data.Initiative.Agents.map((agent: Agent) => ({
//         ...agent,
//         agent_id: uuidv4()
//       }));
//     }
 
//     // Update created_on and modified_on
//     const currentDate = new Date().toISOString();
//     data.Initiative.created_on = currentDate;
//     data.Initiative.modified_on = currentDate;
 
//     initiatives.push(data.Initiative);
 
//     fs.writeFileSync(initiativesFile, JSON.stringify(initiatives, null, 2));
//     console.log('Initiative created successfully:', data.Initiative.id);
//     // res.status(201).json({
//     //   message: "Initiative created successfully",
//     //   initiative_id: data.Initiative.id
//     // });
//   } catch (error) {
//     console.error('Error creating initiative:', error);
//     // res.status(500).json({ error: "An error occurred while creating the initiative" });
//   }
// });
 
app.get('/list-ai-resources', async (req: express.Request, res: express.Response) => {
  try {
 
    const client = new CognitiveServicesManagementClient(credential, subscriptionId);
    // const resources = await client.accounts.list();
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);
    const resources = await resourceClient.resources.list();
 
    const resourceList = [];
    for await (const resource of resources) {
      resourceList.push({
        name: resource.name,
        location: resource.location,
        kind: resource.kind
      });
    }
    res.json(resourceList);
  } catch (error) {
    console.error('Error fetching AI resources:', error);
    res.status(500).json({ error: 'Failed to fetch AI resources' });
  }
});
 
 
app.get('/debug-project', async (req: express.Request, res: express.Response) => {
  try {
    const subscriptionId = '506ea6ff-a780-4e8e-9c93-d18de8274709';
    const token = await credential.getToken("https://management.azure.com/.default");
   
    // Get all resources and find your AI Studio project
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);
    const resources = await resourceClient.resources.list();
   
    const aiProjects = [];
    for await (const resource of resources) {
      if (resource.kind === 'Project' || resource.type?.includes('CognitiveServices')) {
        aiProjects.push({
          name: resource.name,
          location: resource.location,
          kind: resource.kind,
          type: resource.type,
          resourceGroup: resource.id?.split('/')[4], // Extract resource group from ID
          id: resource.id
        });
      }
    }
   
    res.json({
      aiProjects,
      message: "Check the resourceGroup field for the correct resource group name"
    });
   
  } catch (error) {
    console.error('Error:', error);
  }
});
 



























app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
 
 