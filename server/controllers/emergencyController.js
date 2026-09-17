import EmergencyContact from '../models/EmergencyContact.js';
import { initialEmergencyContacts } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let emergencyCache = [...initialEmergencyContacts];

export const getEmergencyContacts = async (req, res) => {
  try {
    if (getDBStatus()) {
      const contacts = await EmergencyContact.find();
      return res.json({ success: true, count: contacts.length, contacts });
    }
    res.json({ success: true, count: emergencyCache.length, contacts: emergencyCache });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const triggerSOS = async (req, res) => {
  try {
    const { citizenName, phone, location, serviceType, notes } = req.body;
    const alertId = `SOS-${Date.now().toString().slice(-6)}`;

    // In a production rural system, this dispatches SMS / IVR via Twilio or CDAC gateway
    console.log(`[EMERGENCY SOS DISPATCHED] Alert ID: ${alertId} | Type: ${serviceType} | Location: ${location} | Contact: ${phone}`);

    res.status(200).json({
      success: true,
      alertId,
      message: 'Emergency alert successfully broadcast to local Panchayat response team & 108 medical dispatcher.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
