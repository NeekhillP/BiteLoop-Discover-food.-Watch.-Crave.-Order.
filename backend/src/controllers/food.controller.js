import foodItemModel from '../models/foodItem.model.js';
import { uploadFile } from '../services/storage.service.js';
import { v4 as uuidv4 } from 'uuid';


export async function createFood(req, res){
    try{
        if (!req.file) {
            return res.status(400).json({ message: 'A file is required in the video field' });
        }

        const { name, description, price } = req.body;

        const fileName = `${uuidv4()}.jpg`;


        const fileUploadResult = await uploadFile(req.file.buffer, fileName);

        const foodItem = new foodItemModel({
            name, 
            video: fileUploadResult.url,
            description,
            price,
            foodPartner: req.foodPartner._id
        })

        return res.status(201).json({ 
            message: 'Food item created successfully', foodItem 
        });
        
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Failed to upload food item' });
    }
}


export async function getAllFood(req,res){
    const foodItems = await foodItemModel.find({})

    res.status(200).json({
        message: 'Food items retrieved successfully',
        foodItems
    })
}
