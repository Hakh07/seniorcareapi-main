const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define("rating", {
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
        rating_number: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rating_details: {
            allowNull: true,
            type: DataTypes.STRING
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
            singular: 'rating',
            plural: 'ratings',
        }
    })

    // Rating.associate = function (models) {
    //     Rating.belongsTo(models.Doctor, {
    //         as: {
    //             singular: 'doctor',
    //             plural: 'doctors'
    //         },
    //         foreignKey: 'doctor_id'
    //     });
    // }

    return Rating;
}