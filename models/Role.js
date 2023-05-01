import mongoose from 'mongoose';

const RoleModel = new mongoose.Schema(
{
    value: 
    {
        type:String,
        unique: true,
        default: 'USER'
    },
});


export default mongoose.model('Role', RoleModel);