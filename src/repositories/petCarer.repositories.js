import mongoose from "mongoose";
import PetCarer from "../models/petCarer.model.js";
import createError from "http-errors";

const petCarerRepository = {
    async getSpecificPetCarer(id) {
        const petCarerId = new mongoose.Types.ObjectId(id);

        const pipeline = [
            {
                $match: {
                    _id: petCarerId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$user', '$$ROOT']
                    }
                }
            },
            {
                $project: {
                    user: 0
                }
            }
        ];

        let petCarers = await PetCarer.aggregate(pipeline);

        if (petCarers.length < 1)
            throw new createError.NotFound("Pet Carer doesn't exist");

        let petCarer = petCarers[0];

        return petCarer;
    }
}

export default petCarerRepository;