
const express = require("express");

const Ticket = require("../models/Ticket");

const router = express.Router();


// =================================
// VALIDATION
// =================================

const VALID_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
];

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];


// =================================
// GET ALL TICKETS
// =================================

router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(tickets);
  } catch (error) {
    console.error(
      "Get tickets error:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to retrieve tickets",
    });
  }
});


// =================================
// GET SINGLE TICKET
// =================================

router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(
      req.params.id
    );

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    return res.status(200).json(ticket);
  } catch {
    return res.status(404).json({
      error: "Ticket not found",
    });
  }
});


// =================================
// CREATE TICKET
// =================================

router.post("/", async (req, res) => {
  try {
    const {
      ticketNumber,
      title,
      description,
      customerName,
      status,
      priority,
    } = req.body;

    if (
      ticketNumber === undefined ||
      ticketNumber === null
    ) {
      return res.status(400).json({
        error: "Ticket number is required",
      });
    }

    if (
      !title ||
      !title.trim()
    ) {
      return res.status(400).json({
        error: "Ticket title is required",
      });
    }

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        error: "Ticket description is required",
      });
    }

    if (
      !customerName ||
      !customerName.trim()
    ) {
      return res.status(400).json({
        error: "Customer name is required",
      });
    }

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid ticket status",
      });
    }

    if (
      priority &&
      !VALID_PRIORITIES.includes(priority)
    ) {
      return res.status(400).json({
        error: "Invalid ticket priority",
      });
    }

    const ticket = await Ticket.create({
      ticketNumber,
      title: title.trim(),
      description: description.trim(),
      customerName: customerName.trim(),
      status: status || "OPEN",
      priority: priority || "MEDIUM",
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error(
      "Create ticket error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "A ticket with this ticket number already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to create ticket",
    });
  }
});


// =================================
// UPDATE TICKET
// =================================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      customerName,
      status,
      priority,
    } = req.body;

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid ticket status",
      });
    }

    if (
      priority &&
      !VALID_PRIORITIES.includes(priority)
    ) {
      return res.status(400).json({
        error: "Invalid ticket priority",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          error: "Ticket title cannot be empty",
        });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          error:
            "Ticket description cannot be empty",
        });
      }

      updateData.description =
        description.trim();
    }

    if (customerName !== undefined) {
      if (!customerName.trim()) {
        return res.status(400).json({
          error:
            "Customer name cannot be empty",
        });
      }

      updateData.customerName =
        customerName.trim();
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    const ticket =
      await Ticket.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error(
      "Update ticket error:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to update ticket",
    });
  }
});


module.exports = router;

