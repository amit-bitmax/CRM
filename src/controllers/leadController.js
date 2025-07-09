const Lead = require('../models/Lead');

// create lead
exports.createLead = async (req, res) => {
    const userId = req.user?.id;
    try {
        const { first_name, last_name, mobile, email, alternateNumber,lead_status,lead_source, address, status, state, product, propertyType, budget, location, bhk, constructionStatus, furnishing, remark, createdDate, createTime, description } = req.body;
        if (!req.body) {
            return res.status(400).json({ message: "All fields are mandatory", status: false });
        }
        const newLead = await Lead.create({
            userId: userId,
            name: { first_name, last_name },
            mobile,
            email,
            lead_status,lead_source,
            alternateNumber, address, status, state, product, propertyType, budget, location, bhk, constructionStatus, furnishing, remark, createdDate, createTime, description
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
            alternateNumber,
            address,
            status,
            state,
            lead_status,
            lead_source,
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
        if (alternateNumber) lead.alternateNumber = alternateNumber;
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
        if (lead_source) lead.lead_source = lead_source;
        if (lead_status) lead.lead_status = lead_status;
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
// by user
exports.getByUser = async (req, res) => {
    const userId = req.user?.id;
    try {
        const lead = await Lead.find({ userId }).populate('userId', 'user_name email role');
        if (!lead.length === 0) {
            return res.status(404).json({ message: 'No jobd found for this user.' });
        }
        return res.status(200).json({ message: 'lead created by user', data: lead });
    } catch (error) {
        console.error('Error fetching lead:', error);
        return res.status(500).json({ message: 'Failed to fetch lead. Please try again later.' });
    }
};

// active lead
exports.activeLead = async (req, res) => {
    try {
        const activeLeads = await Lead.find({ status: 1 });
        if (activeLeads.length === 0) {
            return res.status(404).json({ message: "No active leads found", status: false, data: null });
        }
        return res.status(200).json({ message: "Active leads retrieved successfully", status: true, data: activeLeads });
    } catch (error) {
        console.error("Error in getactiveLeads:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, data: null });
    }
};
//  make in active or inActive
exports.makeInactiveLead = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID is required", status: false, data: null });
        }
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: "Lead does not exist with this ID", status: false, data: null });
        }
        const newStatus = lead.status === 1 ? 0 : 1;
        const updatedLead = await Lead.findByIdAndUpdate(id, { status: newStatus }, { new: true });

        const statusMessage = newStatus === 1 ? "Active" : "Inactive";
        return res.status(200).json({ message: `lead status set to ${statusMessage}`, status: true, data: updatedLead });

    } catch (error) {
        console.error("Error in makeInactiveLead:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, data: null });
    }
};

// all inActive
exports.getInactiveLeads = async (req, res) => {
    try {
        const inactiveLeads = await Lead.find({ status: 0 });
        if (inactiveLeads.length === 0) {
            return res.status(404).json({ message: "No inactive leads found", status: false, data: null });
        }
        return res.status(200).json({ message: "Inactive leads retrieved successfully", status: true, data: inactiveLeads });
    } catch (error) {
        console.error("Error in getInactiveleads:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false, data: null });
    }
};