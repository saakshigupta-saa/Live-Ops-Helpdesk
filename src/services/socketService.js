const DASHBOARD_ROOM = "dashboard";

// Stores:
// ticketId -> { socketId, agentName }
const ticketLocks = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Agent connected:", socket.id);

    // =================================
    // JOIN DASHBOARD
    // =================================

    socket.on("join_dashboard", (data = {}) => {
      const agentName =
        typeof data.agentName === "string" &&
        data.agentName.trim()
          ? data.agentName.trim()
          : "Unknown Agent";

      socket.data.agentName = agentName;

      socket.join(DASHBOARD_ROOM);

      console.log(
        `${agentName} joined the dashboard`
      );

      // Send current locks to the newly connected agent
      const currentLocks = Array.from(
        ticketLocks.entries()
      ).map(([ticketId, lock]) => ({
        ticketId,
        agentName: lock.agentName,
        socketId: lock.socketId,
      }));

      socket.emit("current_locks", currentLocks);
    });


    // =================================
    // LOCK TICKET
    // =================================

    socket.on("lock_ticket", (data = {}) => {
      const ticketId =
        typeof data.ticketId === "string"
          ? data.ticketId.trim()
          : "";

      if (!ticketId) {
        socket.emit("lock_rejected", {
          message: "Ticket ID is required",
        });

        return;
      }

      const existingLock =
        ticketLocks.get(ticketId);

      // Ticket is already locked
      if (existingLock) {
        socket.emit("lock_rejected", {
          ticketId,
          agentName: existingLock.agentName,
          message: `Ticket is currently locked by ${existingLock.agentName}`,
        });

        return;
      }

      const agentName =
        socket.data.agentName ||
        "Unknown Agent";

      // Create lock
      ticketLocks.set(ticketId, {
        socketId: socket.id,
        agentName,
      });

      console.log(
        `Ticket ${ticketId} locked by ${agentName}`
      );

      // Tell every connected agent
      io.to(DASHBOARD_ROOM).emit(
        "ticket_locked",
        {
          ticketId,
          agentName,
          socketId: socket.id,
        }
      );
    });


    // =================================
    // UNLOCK TICKET
    // =================================

    socket.on("unlock_ticket", (data = {}) => {
      const ticketId =
        typeof data.ticketId === "string"
          ? data.ticketId.trim()
          : "";

      if (!ticketId) {
        socket.emit("unlock_rejected", {
          message: "Ticket ID is required",
        });

        return;
      }

      const existingLock =
        ticketLocks.get(ticketId);

      // Ticket is not locked
      if (!existingLock) {
        return;
      }

      // Only the agent who owns the lock
      // can manually unlock it
      if (existingLock.socketId !== socket.id) {
        socket.emit("unlock_rejected", {
          ticketId,
          message:
            "You cannot unlock a ticket locked by another agent",
        });

        return;
      }

      ticketLocks.delete(ticketId);

      console.log(
        `Ticket ${ticketId} unlocked by ${existingLock.agentName}`
      );

      io.to(DASHBOARD_ROOM).emit(
        "ticket_unlocked",
        {
          ticketId,
          agentName: existingLock.agentName,
          reason: "manual",
        }
      );
    });


    // =================================
    // GHOST DISCONNECT HANDLER
    // =================================

    socket.on("disconnect", (reason) => {
      console.log(
        `Agent disconnected: ${socket.id}`,
        reason
      );

      // Find every ticket locked by this socket
      for (const [
        ticketId,
        lock,
      ] of ticketLocks.entries()) {
        if (lock.socketId === socket.id) {
          ticketLocks.delete(ticketId);

          console.log(
            `Ticket ${ticketId} automatically unlocked`
          );

          // Tell remaining agents
          io.to(DASHBOARD_ROOM).emit(
            "ticket_unlocked",
            {
              ticketId,
              agentName: lock.agentName,
              reason: "disconnect",
            }
          );
        }
      }
    });
  });
};


module.exports = {
  setupSocket,
  ticketLocks,
};