const mongoose = require('mongoose');
const Admission = require('./models/Admission');
const fs = require('fs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admissions = await Admission.find().sort({ createdAt: -1 }).limit(5);

        const output = admissions.map(adm => ({
            id: adm._id,
            documents: adm.documents
        }));

        fs.writeFileSync('debug_output.json', JSON.stringify(output, null, 2));
        console.log('done');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
