import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.send('VR Tour Backend Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));