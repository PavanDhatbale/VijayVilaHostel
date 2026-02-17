const mongoose = require('mongoose');

const hostelConfigSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        default: 'Dr. Atul Vadagavkar'
    },
    ownerRole: {
        type: String,
        default: 'Founder & Managing Trustee'
    },
    ownerBio: {
        type: String,
        default: 'Dr. Atul Vadagavkar (MD Medicine) is a dedicated philanthropist and medical professional committed to empowering students from economically weaker sections. His vision is to ensure that talent meets opportunity, regardless of financial barriers.'
    },
    ownerImage: {
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop'
        },
        publicId: String
    },
    heroImage: {
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop'
        },
        publicId: String
    },
    hostelVideo: {
        url: String,
        publicId: String
    },
    landingGallery: [{
        url: {
            type: String,
            required: true
        },
        publicId: String
    }]
}, {
    timestamps: true
});

// Ensure only one config document exists
hostelConfigSchema.statics.getSingleton = async function () {
    const config = await this.findOne();
    if (config) return config;
    return await this.create({});
};

module.exports = mongoose.model('HostelConfig', hostelConfigSchema);
