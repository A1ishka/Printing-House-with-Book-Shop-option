import mongoose from 'mongoose';

const TOrderSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    image_select:{
        type: Object,
        required: true,
    },
    obl_type:{
        type: Object,
        required: true,
    },
    checked: {
        type: Boolean,
    }
});

export default mongoose.model("T-order", TOrderSchema);