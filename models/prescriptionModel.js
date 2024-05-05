const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Prescription = sequelize.define("prescription", {
        doctor_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_date: {
            type: DataTypes.STRING,
            allowNull: false,
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
        notify_me: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
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
            singular: 'prescription',
            plural: 'prescriptions',
        }
    });
    return Prescription;
}