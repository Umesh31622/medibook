const Appointment = require('../models/Appointment');

// @desc    Create appointment
const createAppointment = async (req, res) => {
    try {
        const { department, doctorName, appointmentDate, appointmentTime, visitType, description, patientName, patientId } = req.body;
        
        // ✅ Make sure createdBy is added
        const appointment = await Appointment.create({
            department,
            doctorName,
            appointmentDate,
            appointmentTime,
            visitType,
            description,
            patientName,
            patientId,
            createdBy: req.user._id  // ✅ YEH LINE HONI CHAHIYE
        });
        
        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        let filter = {};
        
        if (req.user.role !== 'admin') {
            filter.createdBy = req.user._id;
        }
        
        const appointments = await Appointment.find(filter).sort({ appointmentDate: -1 });
        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single appointment
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        if (req.user.role !== 'admin' && appointment.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update appointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        if (req.user.role !== 'admin' && appointment.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { department, doctorName, appointmentDate, appointmentTime, visitType, description, status } = req.body;
        
        appointment.department = department || appointment.department;
        appointment.doctorName = doctorName || appointment.doctorName;
        appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
        appointment.appointmentTime = appointmentTime || appointment.appointmentTime;
        appointment.visitType = visitType || appointment.visitType;
        appointment.description = description || appointment.description;
        appointment.status = status || appointment.status;
        
        await appointment.save();
        
        res.json({
            success: true,
            message: 'Appointment updated successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        if (req.user.role !== 'admin' && appointment.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        await appointment.deleteOne();
        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        if (req.user.role !== 'admin' && appointment.createdBy?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        
        const { status } = req.body;
        appointment.status = status;
        await appointment.save();
        
        res.json({
            success: true,
            message: 'Appointment status updated',
            appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus
};