const request = require("supertest");

const app = require("../src/app");

describe("Live Ops Helpdesk API", () => {
  test("GET /api/health should return API status", async () => {
    const response =
      await request(app)
        .get("/api/health");

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual({
        status: "ok",
        message:
          "Live Ops Helpdesk API is running",
      });
  });


  test("POST /api/tickets should reject missing ticket number", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          title: "Test ticket",
          description:
            "Test ticket description",
          customerName:
            "Test Customer",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Ticket number is required"
      );
  });


  test("POST /api/tickets should reject missing title", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          ticketNumber: 999999,
          description:
            "Test ticket description",
          customerName:
            "Test Customer",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Ticket title is required"
      );
  });


  test("POST /api/tickets should reject missing description", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          ticketNumber: 999998,
          title: "Test ticket",
          customerName:
            "Test Customer",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Ticket description is required"
      );
  });


  test("POST /api/tickets should reject missing customer name", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          ticketNumber: 999997,
          title: "Test ticket",
          description:
            "Test ticket description",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Customer name is required"
      );
  });


  test("POST /api/tickets should reject invalid status", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          ticketNumber: 999996,
          title: "Test ticket",
          description:
            "Test ticket description",
          customerName:
            "Test Customer",
          status: "INVALID",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Invalid ticket status"
      );
  });


  test("POST /api/tickets should reject invalid priority", async () => {
    const response =
      await request(app)
        .post("/api/tickets")
        .send({
          ticketNumber: 999995,
          title: "Test ticket",
          description:
            "Test ticket description",
          customerName:
            "Test Customer",
          priority: "INVALID",
        });

    expect(response.statusCode)
      .toBe(400);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Invalid ticket priority"
      );
  });


  test("GET /api/tickets/invalid-id should return 404", async () => {
    const response =
      await request(app)
        .get(
          "/api/tickets/invalid-id"
        );

    expect(response.statusCode)
      .toBe(404);

    expect(response.body)
      .toHaveProperty(
        "error",
        "Ticket not found"
      );
  });
});