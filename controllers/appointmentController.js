const db = require("../models");
const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");

const Appointment = db.appointments;
const Doctor = db.doctors;

exports.createAppointment = async (req, res) => {
  try {
    const { name, start_time, end_time, user_id, doctor_id, description } =
      req.body;

    // Check for time conflicts before creating appointment
    const conflictingAppointments = await Appointment.findAll({
      where: {
        doctor_id,
        [Sequelize.Op.or]: [
          {
            [Sequelize.Op.and]: [
              { start_time: { [Sequelize.Op.lt]: end_time } },
              { end_time: { [Sequelize.Op.gt]: start_time } },
            ],
          },
          {
            start_time: { [Sequelize.Op.gte]: start_time },
            end_time: { [Sequelize.Op.lte]: end_time },
          },
        ],
      },
    });

    if (conflictingAppointments.length > 0) {
      return res.status(400).json({
        message: "Doctor has a conflicting appointment during this time",
      });
    }

    const newAppointment = await Appointment.create({
      name,
      start_time,
      end_time,
      description,
      user_id,
      doctor_id,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating appointment" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time, status } = req.body; // Allow updating specific fields

    const [updatedCount] = await Appointment.update(
      {
        start_time,
        end_time,
        status,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updatedAppointment = await Appointment.findByPk(id); // Fetch the updated appointment

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving appointments" });
  }
};

exports.getAllAppointmentsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id); // Get user_id from query parameter

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user_id provided. Must be a number" });
    }

    const appointments = await Appointment.findAll({
      where: {
        user_id: userId, // Filter by user_id
        status: {
          [Sequelize.Op.ne]: "cancelled", // Exclude appointments with status 'cancelled'
        },
      },
      order: [["start_time", "ASC"]], // Order by user_id (through User model) descending
    });

    // Find doctor details for each appointment (optional)
    if (appointments.length > 0) {
      const doctorIds = appointments.map(
        (appointment) => appointment.doctor_id
      ); // Extract doctor IDs
      const doctors = await Doctor.findAll({
        where: { id: doctorIds }, // Find doctors by their IDs
      });

      // Map doctor details to appointments (optional)
      const appointmentsWithDoctors = appointments.map((appointment) => {
        const matchingDoctor = doctors.find(
          (doctor) => doctor.id === appointment.doctor_id
        );
        return {
          ...appointment, // Include appointment data
          doctor: matchingDoctor
            ? {
                // Include doctor details if found
                doctor_id: matchingDoctor.doctor_id,
                name: matchingDoctor.name,
                imageUrl: matchingDoctor.imageUrl,
                profession: matchingDoctor.profession,
                category: matchingDoctor.category,
                address: matchingDoctor.address,
                about: matchingDoctor.about,
                meeting_url: matchingDoctor.meeting_url,
                total_ratings: matchingDoctor.total_ratings,
              }
            : null, // Include null if doctor not found
        };
      });

      res.status(200).json({ appointmentsWithDoctors });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user appointments" });
  }
};

exports.getAllAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorId = parseInt(req.query.doctor_id); // Get user_id from query parameter

    if (isNaN(doctorId)) {
      return res
        .status(400)
        .json({ message: "Invalid doctor_id provided. Must be a number" });
    }

    const appointments = await Appointment.findAll({
      where: {
        doctor_id: doctorId, // Filter by user_id
        status: {
          [Sequelize.Op.ne]: "cancelled", // Exclude appointments with status 'cancelled'
        },
      },
      order: [["start_time", "ASC"]], // Order by user_id (through User model) descending
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving doctor appointments" });
  }
};

function getMomentObjectWithoutTimezone(dateTimeString) {
  // Try parsing with "T" separator (YYYY-MM-DDT hh:mm:ss)
  let momentObject;
  try {
    momentObject = moment(dateTimeString, "YYYY-MM-DDT HH:mm:ss");
  } catch (error) {
    // If parsing with "T" fails, try with space separator (YYYY-MM-DD hh:mm:ss)
    try {
      momentObject = moment(dateTimeString, "YYYY-MM-DD HH:mm:ss");
    } catch (error) {
      // Throw an error if both parsing attempts fail
      throw new Error(
        "Invalid date time format. Expected YYYY-MM-DD hh:mm:ss or YYYY-MM-DDT hh:mm:ss"
      );
    }
  }

  // Return the Moment object in UTC format (without time zone conversion)
  return momentObject.format("YYYY-MM-DDThh:mm:ssZ"); // Adjust "08:00:00" to your desired time
}

exports.getAvailableSlotsForNext3Days = async (req, res) => {
  try {
    const doctorId = parseInt(req.query.doctor_id);

    const today = moment();
    const tomorrow = today.clone().add(1, "days");
    const afterTomorrow = tomorrow.clone().add(1, "days");

    // Get all appointments for the doctor for the next 3 days
    const appointments = await Appointment.findAll({
      where: {
        doctor_id: doctorId,
        status: {
          [Sequelize.Op.ne]: "cancelled", // Exclude appointments with status 'cancelled'
        },
        start_time: {
          [Sequelize.Op.gte]: today.toDate(), // Start time on or after today
          [Sequelize.Op.lte]: afterTomorrow.toDate(), // Start time on or before afterTomorrow
        },
      },
    });

    const availableSlots = [];

    // Loop through each day (today, tomorrow, afterTomorrow)
    for (const day of [today, tomorrow, afterTomorrow]) {
      const formattedDate = day.format("YYYY-MM-DD"); // YYYY-MM-DD format

      const doctorSchedule = {
        from: await getScheduleTime(
          doctorId,
          formattedDate,
          day.format("dddd").toLowerCase(),
          "from"
        ), // Get start time from schedule (using day.format('dddd') for full day name)
        to: await getScheduleTime(
          doctorId,
          formattedDate,
          day.format("dddd").toLowerCase(),
          "to"
        ), // Get end time from schedule
      };

      console.log("formattedDate", formattedDate);
      console.log("doctorSchedule", doctorSchedule);

      if (doctorSchedule.from !== null) {
        const scheduleStartTime = moment.tz(
          `${formattedDate}T${doctorSchedule.from}`,
          doctorId.timeZone
        ); // Use doctor's time zone for schedule times
        const scheduleEndTime = moment.tz(
          `${formattedDate}T${doctorSchedule.to}`,
          doctorId.timeZone
        );

        const appointmentDuration = moment.duration(60, "minutes"); // Use Moment.js duration

        // Loop through potential slots within the doctor's schedule
        let currentSlot = scheduleStartTime.clone();
        let sst = `${formattedDate}T${doctorSchedule.from}`;
        let sst1 = getMomentObjectWithoutTimezone(sst);
        while (currentSlot.isBefore(scheduleEndTime)) {
          const currentSlotFormatted = currentSlot.format(
            "YYYY-MM-DD HH:mm:ss"
          ); // YYYY-MM-DD HH:mm format

          // Check if the slot is already booked in existing appointments
          const isBooked = appointments.some((appointment) => {
            const appointmentStartTime = getMomentObjectWithoutTimezone(
              appointment.start_time
            );

            //console.log("sst",sst)
            console.log("sst1", sst1);
            //console.log("scheduleStartTime",scheduleStartTime)
            //console.log("appointment.start_time",appointment.start_time)
            console.log("appointmentStartTime", appointmentStartTime);
            //console.log("appointmentStartTime1",moment.tz(appointmentStartTime))
            //console.log("currentSlot",currentSlot)
            return sst1 === appointmentStartTime; // Compare by minute
          });

          console.log("isBooked", isBooked);

          if (!isBooked) {
            availableSlots.push(currentSlotFormatted);
          }

          let sst2 = moment(sst1).clone();

          sst1 = sst2.add(1, "hours").format("YYYY-MM-DDThh:mm:ssZ");
          // Move to the next slot (add appointment duration)
          currentSlot = currentSlot.add(appointmentDuration);
        }
      }
    }

    res.status(200).json({ freeslots: availableSlots });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving appointment free slots" });
  }
};

// Helper function to get schedule time (from or to) for a doctor on a specific date
async function getScheduleTime(doctorId, date, timePart, type) {
  const doctor = await Doctor.findOne({
    where: {
      id: doctorId,
    },
    attributes: [`${timePart}_from`, `${timePart}_to`], // Select specific schedule time attribute
  });

  // Handle cases like 'Closed' or 'By Appointment Only'
  if (
    doctor[`${timePart}_from`] === "Closed" ||
    doctor[`${timePart}_from`] === "By Appointment Only"
  ) {
    return null;
  } else {
    return doctor[`${timePart}_${type}`];
  }
}

exports.getLatestUpcomingAppointments = async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id);

    const appointments = await Appointment.findAll({
      where: {
        user_id: userId,
        status: {
          [Sequelize.Op.ne]: "cancelled", // Exclude appointments with status 'cancelled'
        },
      },
      order: [
        ["start_time", "ASC"], // Order by start time in ascending order
      ],
      limit: 3,
    });

    // Find doctor details for each appointment (optional)
    if (appointments.length > 0) {
      const doctorIds = appointments.map(
        (appointment) => appointment.doctor_id
      ); // Extract doctor IDs
      const doctors = await Doctor.findAll({
        where: { id: doctorIds }, // Find doctors by their IDs
      });

      // Map doctor details to appointments (optional)
      const appointmentsWithDoctors = appointments.map((appointment) => {
        const matchingDoctor = doctors.find(
          (doctor) => doctor.id === appointment.doctor_id
        );
        return {
          ...appointment, // Include appointment data
          doctor: matchingDoctor
            ? {
                // Include doctor details if found
                doctor_id: matchingDoctor.doctor_id,
                name: matchingDoctor.name,
                imageUrl: matchingDoctor.imageUrl,
                profession: matchingDoctor.profession,
                category: matchingDoctor.category,
                address: matchingDoctor.address,
                about: matchingDoctor.about,
                meeting_url: matchingDoctor.meeting_url,
                total_ratings: matchingDoctor.total_ratings,
              }
            : null, // Include null if doctor not found
        };
      });

      res.status(200).json({ appointmentsWithDoctors });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving appointments" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving appointment" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Appointment.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
