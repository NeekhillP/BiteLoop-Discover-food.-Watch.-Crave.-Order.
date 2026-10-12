import foodItemModel from '../models/foodItem.model.js';
import { uploadFile } from '../services/storage.service.js';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import foodPartnerModel from '../models/foodPartner.model.js';

export async function getFoodPartnerProfile(req, res) {
    const { partnerId } = req.params;

    if (!mongoose.isObjectIdOrHexString(partnerId)) {
        return res.status(400).json({ message: 'Invalid store ID.' });
    }

    try {
        const foodPartner = await foodPartnerModel.findById(partnerId).select('name address').lean();

        if (!foodPartner) return res.status(404).json({ message: 'This store could not be found.' });

        const foodItems = await foodItemModel.find({ foodPartner: partnerId })
            .select('name description video price foodPartner')
            .sort({ _id: -1 }).lean();
            
        return res.status(200).json({ foodPartner, foodItems, totalMeals: foodItems.length });
    } catch (err) {
        console.error('Failed to retrieve store profile:', err.message);
        return res.status(500).json({ message: 'Could not load this store. Please try again.' });
    }
}


export async function createFood(req, res){
    try{
        if (!req.file) {
            return res.status(400).json({ message: 'A file is required in the video field' });
        }

        const { name, description, price } = req.body;

        const fileName = `${uuidv4()}.jpg`;


        const fileUploadResult = await uploadFile(req.file.buffer, fileName);

        const foodItem = await foodItemModel.create({
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
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Please provide a name, video, food partner, and valid price.' });
        }
        return res.status(500).json({ message: 'Failed to create food item' });
    }
}


export async function getAllFood(req,res){
    try {
        const foodItems = await foodItemModel.find({})
            .populate('foodPartner', 'name')
            .lean();

        return res.status(200).json({
            message: 'Food items retrieved successfully',
            foodItems
        });
    } catch (err) {
        console.error('Failed to retrieve food items:', err.message);
        return res.status(500).json({ message: 'Failed to retrieve food items. Please try again.' });
    }
}
