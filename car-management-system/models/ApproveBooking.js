module.exports = (sequelize, DataTypes) => {
    const ApproveBooking = sequelize.define('ApproveBooking', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      user_name: { type: DataTypes.STRING },
      car_id: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT },
      start_date: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
      }
    }, {
      tableName: 'approve_bookings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    ApproveBooking.associate = (models) => {
      ApproveBooking.belongsTo(models.User, { foreignKey: 'user_id' });
      ApproveBooking.belongsTo(models.Car, { foreignKey: 'car_id' });
    };
  
    return ApproveBooking;
  };
  