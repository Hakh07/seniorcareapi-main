const { Sequelize, DataTypes } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("event", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['general','social','birthday','family','wedding','reunion','holiday','charity','festival','conference'],
            defaultValue: 'general',
        },
        start_date: {
            allowNull: true,
            type: DataTypes.DATE
        },
        start_time: {
            allowNull: true,
            type: DataTypes.TIME
        },
        end_date: {
            allowNull: true,
            type: DataTypes.DATE
        },
        end_time: {
            allowNull: true,
            type: DataTypes.TIME
        },
        address: {
            allowNull: true,
            type: DataTypes.STRING
        },
        hosted_by: {
            allowNull: false,
            type: DataTypes.STRING
        },        
        hide_guest_list: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
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
    }, {
        name: {
            singular: 'event',
            plural: 'events',
        }
    });    
    return Event;
}