const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOption: {
    ssl: true,
    native: true,
  },
  logging: true,
  operatorsAliases: false,
  port: dbConfig.port,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:" + err);
  });

// fs
//     .readdirSync(__dirname)
//     .filter(file => {
//         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//     })
//     .forEach(file => {
//         const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//         db[model.name] = model;
//     });

db.users = require("./userModel.js")(sequelize, DataTypes);
db.prescriptions = require("./prescriptionModel.js")(sequelize, DataTypes);
db.doctors = require("./doctorModel.js")(sequelize, DataTypes);
db.appointments = require("./appointmentModel.js")(sequelize, DataTypes);
db.events = require("./eventModel.js")(sequelize, DataTypes);
db.invites = require("./inviteModel.js")(sequelize, DataTypes);
db.joinees = require("./joineeModel.js")(sequelize, DataTypes);
db.medicines = require("./medicineModel.js")(sequelize, DataTypes);
db.ratings = require("./ratingModel.js")(sequelize, DataTypes);
db.statuses = require("./statusModel.js")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Yes, Re-Sync Done!");
});

module.exports = db;
