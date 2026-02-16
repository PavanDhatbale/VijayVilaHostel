const HostelLocation = require('../models/HostelLocation');

// @desc    Get the hostel location
// @route   GET /api/hostel-location
// @access  Private (All authenticated users)
const getLocation = async (req, res) => {
    try {
        // Find the first document (singleton pattern logic)
        const location = await HostelLocation.findOne();

        if (!location) {
            // Return empty object or specific message if not set yet
            return res.status(200).json({ message: 'Location not set' });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error('Context: getLocation Error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update hostel location (Create if not exists)
// @route   POST /api/hostel-location
// @access  Private (Manager only)
const updateLocation = async (req, res) => {
    try {
        const {
            hostelName,
            address,
            city,
            state,
            pincode,
            landmark,
            latitude,
            longitude,
            mapEmbedUrl
        } = req.body;

        // Check if location exists
        let location = await HostelLocation.findOne();

        if (location) {
            // Update existing
            location.hostelName = hostelName;
            location.address = address;
            location.city = city;
            location.state = state;
            location.pincode = pincode;
            location.landmark = landmark;
            location.latitude = latitude;
            location.longitude = longitude;
            location.mapEmbedUrl = mapEmbedUrl;
            location.updatedBy = req.user._id;
        } else {
            // Create new
            location = new HostelLocation({
                hostelName,
                address,
                city,
                state,
                pincode,
                landmark,
                latitude,
                longitude,
                mapEmbedUrl,
                updatedBy: req.user._id
            });
        }

        const savedLocation = await location.save();
        res.status(200).json(savedLocation);

    } catch (error) {
        console.error('Context: updateLocation Error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getLocation,
    updateLocation
};
