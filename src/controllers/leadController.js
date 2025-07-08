const Lead = require('../models/Lead');

// create lead
exports.createLead = async (req, res) => {
    try {
        const { first_name, last_name, mobile, email, alternetNumber, address ,status,state,product,propertyType,budget,location,bhk,constructionStatus,furnishing,remark,createdDate,createTime,description} = req.body;
        if (!req.body) {
            return res.status(400).json({ message: "All fields are mandatory", status: false });
        }
        const newLead = await Lead.create({
            name: { first_name, last_name },
            mobile,
            email,
          alternetNumber, address ,status,state,product,propertyType,budget,location,bhk,constructionStatus,furnishing,remark,description
        });

        return res.status(201).json({ message: 'Lead created successful!', status: true, data: newLead });

    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// all leads
exports.getAllLead = async (req, res) => {
    try {
        const leads = await Lead.find({});
        if (!leads.length) {
            return res.status(404).json({ message: 'No leads found', status: false });
        }
        return res.status(200).json({ message: 'Leads fetched successfully', status: true, data: leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// single lead
exports.singleLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params?.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found', status: false });
        }
        return res.status(200).json({ message: 'Single user fetched successfully', status: true, data: lead });
    } catch (error) {
        console.error('Error fetching single data:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// update lead
exports.updatedLead = async (req, res) => {
    const id = req.params?.id;

    if (!id) {
        return res.status(400).json({ message: "Lead ID is required", status: false });
    }

    try {
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found", status: false });
        }

        const {
            user_name,
            first_name,
            last_name,
            mobile,
            email,
            alternetNumber,
            address,
            status,
            state,
            product,
            propertyType,
            budget,
            location,
            bhk,
            constructionStatus,
            furnishing,
            remark,
            createdDate,
            createdTime,
            description
        } = req.body;

        // Update lead fields only if provided
        if (user_name) lead.user_name = user_name;
        if (first_name) lead.name.first_name = first_name;
        if (last_name) lead.name.last_name = last_name;
        if (mobile) lead.mobile = mobile;
        if (email) lead.email = email;
        if (alternetNumber) lead.alternetNumber = alternetNumber;
        if (address) lead.address = address;
        if (status) lead.status = status;
        if (state) lead.state = state;
        if (product) lead.product = product;
        if (propertyType) lead.propertyType = propertyType;
        if (budget) lead.budget = budget;
        if (location) lead.location = location;
        if (bhk) lead.bhk = bhk;
        if (constructionStatus) lead.constructionStatus = constructionStatus;
        if (furnishing) lead.furnishing = furnishing;
        if (remark) lead.remark = remark;
        if (createdDate) lead.createdDate = createdDate;
        if (createdTime) lead.createdTime = createdTime;
        if (description) lead.description = description;

        await lead.save();

        return res.status(200).json({
            message: "Lead updated successfully",
            status: true,
            data: lead
        });

    } catch (error) {
        console.error("Error updating lead:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false });
    }
};


// delete lead
exports.deleteLead = async (req, res) => {
    try {
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Access denied. Only Admin can delete authors.", status: false });
        }

        const { id } = req.params;
        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found", status: false });
        }

        return res.status(200).json({ message: "Lead deleted successfully", status: true });

    } catch (error) {
        console.error("Error deleting lead:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false });
    }
};
