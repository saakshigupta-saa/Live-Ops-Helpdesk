const socket = io();

const API_URL = "/api/tickets";


// =================================
// DOM ELEMENTS
// =================================

const ticketList =
  document.getElementById("ticketList");

const ticketCount =
  document.getElementById("ticketCount");

const refreshButton =
  document.getElementById("refreshButton");

const agentNameInput =
  document.getElementById("agentName");

const connectionStatus =
  document.getElementById("connectionStatus");

const connectionBanner =
  document.getElementById("connectionBanner");


// =================================
// STATE
// =================================

let tickets = [];

const ticketLocks = new Map();


// =================================
// AGENT NAME
// =================================

const getAgentName = () => {
  const name =
    agentNameInput.value.trim();

  return name || "Unknown Agent";
};


// =================================
// LOAD TICKETS
// =================================

const loadTickets = async () => {
  try {
    ticketList.innerHTML = `
      <div class="loading-state">
        Loading tickets...
      </div>
    `;

    const response =
      await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        "Failed to load tickets"
      );
    }

    tickets = await response.json();

    renderTickets();
  } catch (error) {
    console.error(
      "Ticket loading error:",
      error
    );

    ticketList.innerHTML = `
      <div class="error-state">
        Unable to load tickets.
        Please try again.
      </div>
    `;

    ticketCount.textContent =
      "Unable to load tickets";
  }
};


// =================================
// ESCAPE HTML
// =================================

const escapeHtml = (value) => {
  const div =
    document.createElement("div");

  div.textContent =
    String(value ?? "");

  return div.innerHTML;
};


// =================================
// RENDER TICKETS
// =================================

const renderTickets = () => {
  ticketCount.textContent =
    `${tickets.length} ticket${
      tickets.length === 1 ? "" : "s"
    }`;

  if (!tickets.length) {
    ticketList.innerHTML = `
      <div class="empty-state">
        No tickets available.
      </div>
    `;

    return;
  }

  ticketList.innerHTML =
    tickets
      .map((ticket) =>
        createTicketCard(ticket)
      )
      .join("");
};


// =================================
// CREATE TICKET CARD
// =================================

const createTicketCard = (ticket) => {
  const ticketId =
    String(ticket._id);

  const lock =
    ticketLocks.get(ticketId);

  const isLocked =
    Boolean(lock);

  const isMine =
    lock &&
    lock.socketId === socket.id;

  const cardClass =
    isLocked
      ? "ticket-card locked"
      : "ticket-card";

  const safeTicketNumber =
    escapeHtml(ticket.ticketNumber);

  const safeTitle =
    escapeHtml(ticket.title);

  const safeDescription =
    escapeHtml(ticket.description);

  const safeCustomer =
    escapeHtml(ticket.customerName);

  const safeStatus =
    escapeHtml(ticket.status);

  const safePriority =
    escapeHtml(ticket.priority);

  let actionHtml = "";


  // =================================
  // UNLOCKED
  // =================================

  if (!isLocked) {
    actionHtml = `
      <button
        class="lock-button"
        type="button"
        onclick="lockTicket('${ticketId}')"
      >
        🔒 Lock & Edit
      </button>
    `;
  }


  // =================================
  // LOCKED BY CURRENT AGENT
  // =================================

  else if (isMine) {
    actionHtml = `
      <div class="edit-panel">

        <div class="edit-header">
          <span class="lock-icon">
            🔓
          </span>

          <strong>
            You are editing this ticket
          </strong>
        </div>


        <label>
          Title

          <input
            id="title-${ticketId}"
            type="text"
            value="${safeTitle}"
            maxlength="150"
          >
        </label>


        <label>
          Description

          <textarea
            id="description-${ticketId}"
            maxlength="1000"
          >${safeDescription}</textarea>
        </label>


        <label>
          Customer Name

          <input
            id="customer-${ticketId}"
            type="text"
            value="${safeCustomer}"
            maxlength="100"
          >
        </label>


        <label>
          Status

          <select
            id="status-${ticketId}"
          >

            <option
              value="OPEN"
              ${
                ticket.status === "OPEN"
                  ? "selected"
                  : ""
              }
            >
              OPEN
            </option>

            <option
              value="IN_PROGRESS"
              ${
                ticket.status === "IN_PROGRESS"
                  ? "selected"
                  : ""
              }
            >
              IN_PROGRESS
            </option>

            <option
              value="RESOLVED"
              ${
                ticket.status === "RESOLVED"
                  ? "selected"
                  : ""
              }
            >
              RESOLVED
            </option>

          </select>
        </label>


        <label>
          Priority

          <select
            id="priority-${ticketId}"
          >

            <option
              value="LOW"
              ${
                ticket.priority === "LOW"
                  ? "selected"
                  : ""
              }
            >
              LOW
            </option>

            <option
              value="MEDIUM"
              ${
                ticket.priority === "MEDIUM"
                  ? "selected"
                  : ""
              }
            >
              MEDIUM
            </option>

            <option
              value="HIGH"
              ${
                ticket.priority === "HIGH"
                  ? "selected"
                  : ""
              }
            >
              HIGH
            </option>

            <option
              value="URGENT"
              ${
                ticket.priority === "URGENT"
                  ? "selected"
                  : ""
              }
            >
              URGENT
            </option>

          </select>
        </label>


        <div class="edit-actions">

          <button
            class="save-button"
            type="button"
            onclick="saveTicket('${ticketId}')"
          >
            Save Changes
          </button>

          <button
            class="unlock-button"
            type="button"
            onclick="unlockTicket('${ticketId}')"
          >
            Release
          </button>

        </div>

      </div>
    `;
  }


  // =================================
  // LOCKED BY ANOTHER AGENT
  // =================================

  else {
    actionHtml = `
      <div class="lock-info">

        <span class="lock-icon">
          🔒
        </span>

        <span>
          Locked by
          ${escapeHtml(lock.agentName)}
        </span>

      </div>
    `;
  }


  return `
    <article
      class="${cardClass}"
      data-ticket-id="${ticketId}"
    >

      <div>

        <div class="ticket-number">
          #${safeTicketNumber}
        </div>

        <h3 class="ticket-title">
          ${safeTitle}
        </h3>

        <p class="ticket-description">
          ${safeDescription}
        </p>

        <p class="ticket-customer">
          <strong>Customer:</strong>
          ${safeCustomer}
        </p>

        <div class="ticket-meta">

          <span class="badge badge-status">
            ${safeStatus}
          </span>

          <span class="badge badge-priority">
            ${safePriority}
          </span>

        </div>

      </div>

      <div class="ticket-actions">
        ${actionHtml}
      </div>

    </article>
  `;
};


// =================================
// LOCK TICKET
// =================================

window.lockTicket = async function (ticketId) {
  if (!socket.connected) {
    alert(
      "Connection lost. Please wait for reconnection."
    );

    return;
  }

  socket.emit("lock_ticket", {
    ticketId,
    agentName: getAgentName(),
  });
};


// =================================
// UNLOCK TICKET
// =================================

window.unlockTicket = function (ticketId) {
  if (!socket.connected) {
    alert(
      "Connection lost. Please wait for reconnection."
    );

    return;
  }

  socket.emit("unlock_ticket", {
    ticketId,
  });
};


// =================================
// SAVE TICKET
// =================================

window.saveTicket = async function (ticketId) {
  const lock =
    ticketLocks.get(ticketId);

  // Make sure this browser owns the lock
  if (
    !lock ||
    lock.socketId !== socket.id
  ) {
    alert(
      "You do not have the lock for this ticket."
    );

    return;
  }


  const titleInput =
    document.getElementById(
      `title-${ticketId}`
    );

  const descriptionInput =
    document.getElementById(
      `description-${ticketId}`
    );

  const customerInput =
    document.getElementById(
      `customer-${ticketId}`
    );

  const statusInput =
    document.getElementById(
      `status-${ticketId}`
    );

  const priorityInput =
    document.getElementById(
      `priority-${ticketId}`
    );


  if (
    !titleInput ||
    !descriptionInput ||
    !customerInput ||
    !statusInput ||
    !priorityInput
  ) {
    alert(
      "Unable to find the ticket edit fields."
    );

    return;
  }


  const title =
    titleInput.value.trim();

  const description =
    descriptionInput.value.trim();

  const customerName =
    customerInput.value.trim();

  const status =
    statusInput.value;

  const priority =
    priorityInput.value;


  // =================================
  // CLIENT VALIDATION
  // =================================

  if (!title) {
    alert("Ticket title is required.");

    return;
  }

  if (!description) {
    alert(
      "Ticket description is required."
    );

    return;
  }

  if (!customerName) {
    alert(
      "Customer name is required."
    );

    return;
  }


  try {
    const response =
      await fetch(
        `${API_URL}/${ticketId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            customerName,
            status,
            priority,
          }),
        }
      );


    const data =
      await response.json();


    if (!response.ok) {
      throw new Error(
        data.error ||
        "Failed to update ticket"
      );
    }


    // Update local ticket data
    tickets =
      tickets.map((ticket) => {
        if (
          String(ticket._id) ===
          ticketId
        ) {
          return data;
        }

        return ticket;
      });


    renderTickets();

    alert(
      "Ticket updated successfully."
    );

  } catch (error) {
    console.error(
      "Save ticket error:",
      error
    );

    alert(
      error.message ||
      "Failed to save ticket."
    );
  }
};


// =================================
// SOCKET CONNECTED
// =================================

socket.on("connect", () => {
  console.log(
    "Connected to Socket.io:",
    socket.id
  );

  connectionStatus.textContent =
    "● Online";

  connectionStatus.classList.remove(
    "offline"
  );

  connectionStatus.classList.add(
    "online"
  );

  connectionBanner.classList.add(
    "hidden"
  );

  socket.emit("join_dashboard", {
    agentName: getAgentName(),
  });
});


// =================================
// SOCKET DISCONNECTED
// =================================

socket.on("disconnect", () => {
  console.log(
    "Socket.io connection lost"
  );

  connectionStatus.textContent =
    "● Offline";

  connectionStatus.classList.remove(
    "online"
  );

  connectionStatus.classList.add(
    "offline"
  );

  connectionBanner.classList.remove(
    "hidden"
  );
});


// =================================
// CURRENT LOCKS
// =================================

socket.on(
  "current_locks",
  (locks) => {
    ticketLocks.clear();

    locks.forEach((lock) => {
      ticketLocks.set(
        String(lock.ticketId),
        lock
      );
    });

    renderTickets();
  }
);


// =================================
// TICKET LOCKED
// =================================

socket.on(
  "ticket_locked",
  (lock) => {
    ticketLocks.set(
      String(lock.ticketId),
      lock
    );

    renderTickets();
  }
);


// =================================
// TICKET UNLOCKED
// =================================

socket.on(
  "ticket_unlocked",
  (data) => {
    ticketLocks.delete(
      String(data.ticketId)
    );

    renderTickets();
  }
);


// =================================
// LOCK REJECTED
// =================================

socket.on(
  "lock_rejected",
  (data) => {
    alert(
      data.message ||
      "This ticket is already locked."
    );

    renderTickets();
  }
);


// =================================
// UNLOCK REJECTED
// =================================

socket.on(
  "unlock_rejected",
  (data) => {
    alert(
      data.message ||
      "You cannot unlock this ticket."
    );
  }
);


// =================================
// REFRESH
// =================================

refreshButton.addEventListener(
  "click",
  loadTickets
);


// =================================
// AGENT NAME CHANGE
// =================================

agentNameInput.addEventListener(
  "change",
  () => {
    if (!socket.connected) {
      return;
    }

    socket.emit(
      "join_dashboard",
      {
        agentName: getAgentName(),
      }
    );
  }
);


// =================================
// INITIAL LOAD
// =================================

loadTickets();