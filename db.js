
const {MongoClient}=require('mongodb');
const username=encodeURIComponent('satyamkarncs22');

const password=encodeURIComponent('s3ZZWypLJCkccFqV');
const dbName='events'
let db_1;

const connectDB=async ()=>{
    try {
        const client=new MongoClient.connect(`mongodb+srv://${userName}:${password}@cluster0.hfsa6.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`);

        await client.connect();
        console.log('connected !!!');
        db_1=client.db('events');


    } catch (error) {
        console.log(err);
    }

}
    const getDB=(collectionName)=>{
if(!db_1) {console.log("NO DB Found"); return ;}
return db_1.collection(collectionName);
    }

    module.exports={getDB,connectDB};


