const moment  = require("moment-timezone");
const mongoose=require("mongoose");

const LeadSchema=new mongoose.Schema({
    name:{
        first_name:String,
        last_name:String
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    alternetNumber:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:Number,
        default:1,
    },
    state:{
        type:String,
    },
    product:{
        type:String
    },
    propertyType:{
        type:String
    },
    budget:{
        type:String,
    },
    location:{
        type:String,
    },
    bhk:{
        type:String,
    },
    constructionStatus:{
        type:String,
    },
    furnishing:{
        type:String,
    },
    remark:{
        type:String,
    },
    createdDate: {
    type: String,
    default: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD')
  },
  createdTime: {
    type: String,
    default: () => moment().tz('Asia/Kolkata').format('hh:mm A')
  },
    description:{
        type:String
    },
},{timestamps:true});
LeadSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    this.createdTime = moment().tz('Asia/Kolkata').format('hh:mm A');
  }
  next();
});

module.exports=mongoose.model("Lead",LeadSchema)