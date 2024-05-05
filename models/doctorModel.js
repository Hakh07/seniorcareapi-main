const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
    "doctor",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM,
        values: [
          "dental",
          "cardiology",
          "neurology",
          "dermatology",
          "gynecology",
          "psychiatry",
          "anesthesiology",
          "pediatrics",
          "general",
          "orthopedics",
          "ophthalmology"
        ],
        defaultValue: "general",
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      about: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      meeting_url: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      monday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      monday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      tuesday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      tuesday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      wednesday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      wednesday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      thursday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      thursday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      friday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      friday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      saturday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      saturday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      sunday_from: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      sunday_to: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isValidTime(value) {
            if (value === "Closed") {
              return; // Allow 'Closed' as a valid option
            } else if (value === "By Appointment Only") {
              return; // Allow 'By Appointment Only' as a valid option
            }
            const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!timeRegex.test(value)) {
              throw new Error("Invalid time format. Please use HH:MM:SS");
            }
          },
        },
      },
      total_patients: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      total_experience: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      total_ratings: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      total_reviews: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      name: {
        singular: "doctor",
        plural: "doctors",
      },
    }
  );
  
  return Doctor;
};
