import { MongoClient } from 'mongodb';


export const connectToDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URL as string);
    const dbConnection = await client.connect();
    console.log('Connection Established...');
    
    return dbConnection;
  } catch (error:any) {
    console.log('Failed To Connect To The Database..', error.message);
    return;
  }
};