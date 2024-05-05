const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define("appointment", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isFutureTime(value) {
                    const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/; // Regex for YYYY-MM-DD HH:mm:ss format
                    if (!timeRegex.test(value)) {
                        throw new Error('Invalid start time format. Must be YYYY-MM-DD HH:mm:ss');
                    }
                    const startTime = new Date(value); // Convert string to Date object for comparison
                    if (startTime <= new Date()) {
                        throw new Error('Start time must be in the future');
                    }
                } // Ensure start time is in the future
            }
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAfterStart(value) {
                    const startTime = new Date(this.start_time); // Access start_time using 'this'
                    const endTime = new Date(value);
                    if (endTime <= startTime) {
                        throw new Error('End time must be after start time');
                    }
                },
            }
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id'
            }
        },
        doctor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'doctors'
                },
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM,
            values: ['booked', 'rescheduled', 'cancelled'],
            defaultValue: 'booked',
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        name: {
            singular: 'appointment',
            plural: 'appointments',
        }
    });
    // Appointment.associate = function (models) {
    //     Appointment.belongsTo(models.Doctor, {
    //         as: {
    //             singular: 'doctor',
    //             plural: 'doctors'
    //         }
    //     });
    // }
    return Appointment;
}