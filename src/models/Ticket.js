const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
      ],
      default: "OPEN",
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ],
      default: "MEDIUM",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Ticket",
  ticketSchema
);