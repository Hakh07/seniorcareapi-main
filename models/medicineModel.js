const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Medicine = sequelize.define("medicine", {
        medicine_type: {
            type: DataTypes.ENUM,
            values: ['capsule', 'syrup'],
            defaultValue: 'capsule',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        duration_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration_type: {
            type: DataTypes.ENUM,
            values: ['days', 'months'],
            defaultValue: 'days',
        },
        instruction_type: {
            type: DataTypes.ENUM,
            values: ['before', 'after'],
            defaultValue: 'after',
        },
        morning_dose: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        afternoon_dose: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        night_dose: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        dosage_value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        dosage_unit: {
            type: DataTypes.ENUM,
            values: ['mg', 'ml'],
            defaultValue: 'mg',
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prescription_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                  tableName: 'prescriptions'
                },
                key: 'id',
                onDelete: 'CASCADE'
            }
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
            singular: 'medicine',
            plural: 'medicines',
        }
    });
    return Medicine;
}