const db = require('../models/ApproveBooking');
const ApproveBookings = db.ApproveBookings;

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await ApproveBookings.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await ApproveBookings.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking #${id} updated to ${status}` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};
