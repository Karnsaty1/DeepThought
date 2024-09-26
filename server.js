const express=require('express');
const {connectDB,getDB}=require('./db');
const { ObjectId } = require('mongodb');

const app=express();
(async ()=>{
    try {
        await connectDB();
        app.get('api/v3/app/events',async (req,res)=>{
            const id=req.query.id;
             const collection=getDB('events_01');
           try {
            const ent=await collection.findOne({_id:ObjectId(id)});
            if(!ent){return res.status(400).json({'msg':'Event not found'})};
            return res.status(200).json(ent); 
           } catch (error) {
            return res.status(500).json({msg:"Intrenal Server Error !!! "})
           }    
        })


        app.get('/api/v3/app/events', async (req, res) => {
            const collection = getDB('events_01');
            const { type } = req.query;
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 5; 
        
            try {
                let results_01 = [];
                if (type === 'latest' || type === 'Latest') {
                    results_01 = await collection.find({})
                        .sort({ _id: -1 })
                        .skip((page - 1) * limit) 
                        .limit(limit)
                        .toArray();
                }
        
                const totalCount = await collection.countDocuments(); 
        
                return res.json({
                    totalCount,
                    page,
                    limit,
                    results: results_01
                });
            } catch (error) {
                return res.status(500).json({ msg: "Internal Server Error !!!" });
            }
        });
        

        app.post('/api/v3/app/events', async (req, res) => {
            const collection = getDB('events_01');
            const { name, files, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
        
            if (!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
                return res.status(400).json({ msg: "All fields are required!" });
            }
        
            try {
                const { insertedId } = await collection.insertOne({
                    name,
                    files,
                    tagline,
                    schedule,
                    description,
                    moderator,
                    category,
                    sub_category,
                    rigor_rank
                });
        
                return res.status(201).json({ ID: insertedId }); // 201 Created
            } catch (error) {
                console.error(error); // Log error for debugging
                return res.status(500).json({ msg: "Internal Server Error!" });
            }
        });
        
        app.put('/api/v3/app/events/:id', async (req, res) => {
            const collection = getDB('events_01');
            const id = req.params.id;
            const { name, files, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
        
            if (!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
                return res.status(400).json({ msg: "All fields are required!" });
            }
        
            const objectId = ObjectId(id);
            
            try {
                const updatedId = await collection.updateOne(
                    { _id: objectId },
                    { $set: { name, files, tagline, schedule, description, moderator, category, sub_category, rigor_rank } }
                );
        
                if (updatedId.modifiedCount === 0) {
                    return res.status(404).json({ error: 'Event not found or no changes made' });
                }
        
                return res.status(200).json({ msg: 'Event Updated Successfully', ID: id });
            } catch (error) {
                console.error(error); 
                return res.status(500).json({ msg: "Internal Server Error!" });
            }
        });
        
        app.delete('/api/v3/app/events/:id', async (req, res) => {
            const id = req.params.id;
            const collection = getDB('events_01');
        
            try {
                const objectId = ObjectId(id);
                const result = await collection.deleteOne({ _id: objectId });
        
                if (result.deletedCount === 0) {
                    return res.status(404).json({ msg: 'Event not found' }); // Corrected response structure
                }
        
                return res.json({ msg: 'Event Deleted Successfully', ID: id });
            } catch (error) {
                console.error(error); // Log the error for debugging
                return res.status(500).json({ msg: 'Internal Server Error !!!' });
            }
        });
        

    } catch (error) {
        
    }
})