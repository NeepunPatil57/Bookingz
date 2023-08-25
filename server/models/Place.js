const mongoose=require('mongoose');

const placeSchema=mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,type:'User'},
    title:String,
    address:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    chechIn:Number,
    checkOut:Number,
    maxGuest:Number,
})

const PlaceModel=mongoose.model('Place',placeSchema);
module.exports=PlaceModel;