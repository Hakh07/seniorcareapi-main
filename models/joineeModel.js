const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Joinee = sequelize.define("joinee", {
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
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: {
                  tableName: 'events'
                },
                key: 'id'
            }
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            allowNull: true,
            type: DataTypes.STRING
        },
        extra_attendees: {
            allowNull: true,
            type: DataTypes.INTEGER
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
            singular: 'joinee',
            plural: 'joinees',
        }
    })
    return Joinee;
}