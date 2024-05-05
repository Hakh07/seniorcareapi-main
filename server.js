const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const db = require("./models");
const Statuses = db.statuses;

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json()); // Parses JSON data
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Senior Care Project API",
      version: "1.0.0",
      description: "All the API List for Senior Care Project",
    },
  },
  servers: [
    {
      url: "http://localhost:8080/",
    },
  ],
  apis: ["./app/routes/userRouter.js"],
  swaggerDefinitions: {
    "/api/users": require("./swagger/userRouter.swagger.js"),
  },
};

var corOptions = {
  origin: "https://localhost:8081",
};

const userRouter = require("./routes/userRouter.js");
const ratingRouter = require("./routes/ratingRouter.js");
const prescriptionRouter = require("./routes/prescriptionRouter.js");
const medicineRouter = require("./routes/medicineRouter.js");
const joineeRouter = require("./routes/joineeRouter.js");
const inviteRouter = require("./routes/inviteRouter.js");
const eventRouter = require("./routes/eventRouter.js");
const doctorRouter = require("./routes/doctorRouter.js");
const appointmentRouter = require("./routes/appointmentRouter.js");

app.use("/api/users", userRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/prescriptions", prescriptionRouter);
app.use("/api/medicines", medicineRouter);
app.use("/api/joinees", joineeRouter);
app.use("/api/invites", inviteRouter);
app.use("/api/events", eventRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRouter);

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "hello from api" });
});

app.get("/api/status", async (req, res) => {
  const status = await Statuses.findAll({});
  if (status?.length) {
    return res.json({ status: true });
  }
  return res.json({ status: false });
});

const PORT = process.env.PORT || 8080;

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
