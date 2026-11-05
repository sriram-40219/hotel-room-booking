// Rooms Data Definition
const ROOMS = [
  {
    id: "single",
    name: "Single Room",
    price: 2000,
    occupancy: "1 Person",
    badge: "Budget Friendly",
    features: ["1 Twin Bed", "Free High-Speed Wi-Fi", "Work Desk", "Air Conditioning", "Ensuite Bathroom"]
  },
  {
    id: "double",
    name: "Double Room",
    price: 3500,
    occupancy: "2 Persons",
    badge: "Most Popular",
    features: ["1 Queen Bed", "Free High-Speed Wi-Fi", "LED TV with Cable", "Air Conditioning", "Complimentary Tea/Coffee"]
  },
  {
    id: "suite",
    name: "Executive Suite",
    price: 6000,
    occupancy: "4 Persons",
    badge: "Luxury Choice",
    features: ["2 King Beds", "Private Balcony with View", "Living Area & Sofa", "Mini Bar & Fridge", "Free Breakfast Voucher"]
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    price: 12000,
    occupancy: "6 Persons",
    badge: "Ultra Luxury",
    features: ["3 Master Bedrooms", "Private Jacuzzi", "Dedicated Butler Service", "Panoramic City View", "All-Inclusive Dining"]
  }
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupDateInputs();
  populateRoomSelect();
  renderRooms(ROOMS);
  renderBookingsTable();
  calculateBill();
});

// Setup default dates (Check-in: today, Check-out: tomorrow)
function setupDateInputs() {
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d) => d.toISOString().split("T")[0];

  checkIn.min = formatDate(today);
  checkIn.value = formatDate(today);

  checkOut.min = formatDate(tomorrow);
  checkOut.value = formatDate(tomorrow);
}

// Populate the room select dropdown
function populateRoomSelect() {
  const select = document.getElementById("roomSelect");
  select.innerHTML = ROOMS.map(
    (room) => `<option value="${room.name}" data-price="${room.price}">${room.name} (₹${room.price}/night)</option>`
  ).join("");
}

// Render Room Cards in Grid
function renderRooms(roomsToDisplay) {
  const container = document.getElementById("roomsContainer");
  if (!roomsToDisplay.length) {
    container.innerHTML = "<p>No rooms match the filter.</p>";
    return;
  }

  container.innerHTML = roomsToDisplay.map((room) => `
    <div class="room-card">
      <div class="room-card-header">
        <span class="room-badge">${room.badge}</span>
        <h3>${room.name}</h3>
      </div>
      <div class="room-card-body">
        <div>
          <div class="room-price">₹${room.price.toLocaleString("en-IN")} <span>/ night</span></div>
          <p><strong>Max Occupancy:</strong> ${room.occupancy}</p>
          <ul class="room-features">
            ${room.features.map(f => `<li>✓ ${f}</li>`).join("")}
          </ul>
        </div>
        <button type="button" class="btn btn-primary" onclick="selectRoomAndScroll('${room.name}')">Select & Book</button>
      </div>
    </div>
  `).join("");
}

// Filter rooms by category dropdown
function filterRooms() {
  const filterVal = document.getElementById("roomTypeFilter").value;
  if (filterVal === "all") {
    renderRooms(ROOMS);
  } else {
    const filtered = ROOMS.filter(r => r.name === filterVal);
    renderRooms(filtered);
  }
}

// When clicking "Select & Book" from a room card
function selectRoomAndScroll(roomName) {
  const select = document.getElementById("roomSelect");
  select.value = roomName;
  calculateBill();
  document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
}

// Live Bill Calculation
function calculateBill() {
  const roomSelect = document.getElementById("roomSelect");
  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const rate = selectedOption ? parseInt(selectedOption.getAttribute("data-price") || "0", 10) : 0;

  const checkInVal = document.getElementById("checkIn").value;
  const checkOutVal = document.getElementById("checkOut").value;

  let nights = 0;
  if (checkInVal && checkOutVal) {
    const d1 = new Date(checkInVal);
    const d2 = new Date(checkOutVal);
    const diffTime = d2.getTime() - d1.getTime();
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  if (nights <= 0) nights = 1;

  const roomCharges = rate * nights;

  // Addons calculation
  const hasBreakfast = document.getElementById("addonBreakfast").checked;
  const hasPickup = document.getElementById("addonPickup").checked;

  let addonsTotal = 0;
  if (hasBreakfast) addonsTotal += 300 * nights;
  if (hasPickup) addonsTotal += 700;

  const subtotal = roomCharges + addonsTotal;
  const gst = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + gst;

  // Update UI Elements
  document.getElementById("billRate").innerText = `₹${rate.toLocaleString("en-IN")}`;
  document.getElementById("billNights").innerText = `${nights} Night(s)`;
  document.getElementById("billRoomCharges").innerText = `₹${roomCharges.toLocaleString("en-IN")}`;
  document.getElementById("billAddons").innerText = `₹${addonsTotal.toLocaleString("en-IN")}`;
  document.getElementById("billTax").innerText = `₹${gst.toLocaleString("en-IN")}`;
  document.getElementById("billTotal").innerText = `₹${grandTotal.toLocaleString("en-IN")}`;

  return { rate, nights, roomCharges, addonsTotal, gst, grandTotal };
}

// Handle Form Submission
function handleBooking(e) {
  e.preventDefault();

  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (new Date(checkOut) <= new Date(checkIn)) {
    alert("Check-Out date must be after Check-In date!");
    return;
  }

  const bill = calculateBill();
  const bookingId = "GH-" + Math.floor(100000 + Math.random() * 900000);

  const bookingData = {
    id: bookingId,
    name: document.getElementById("guestName").value.trim(),
    email: document.getElementById("guestEmail").value.trim(),
    phone: document.getElementById("guestPhone").value.trim(),
    room: document.getElementById("roomSelect").value,
    checkIn: checkIn,
    checkOut: checkOut,
    guests: document.getElementById("guestCount").value,
    payment: document.getElementById("paymentMethod").value,
    nights: bill.nights,
    total: bill.grandTotal,
    dateBooked: new Date().toLocaleDateString("en-IN")
  };

  // Save to LocalStorage
  saveBooking(bookingData);

  // Show Modal Confirmation Receipt
  showReceiptModal(bookingData);

  // Refresh Table
  renderBookingsTable();

  // Reset form inputs
  resetBookingForm();
}

// Save to localStorage
function saveBooking(booking) {
  const current = getStoredBookings();
  current.unshift(booking);
  localStorage.setItem("hotel_bookings", JSON.stringify(current));
}

// Retrieve from localStorage
function getStoredBookings() {
  try {
    return JSON.parse(localStorage.getItem("hotel_bookings")) || [];
  } catch (err) {
    return [];
  }
}

// Render Bookings Table
function renderBookingsTable() {
  const bookings = getStoredBookings();
  const tbody = document.getElementById("bookingsTableBody");
  const emptyMsg = document.getElementById("emptyMsg");

  if (!bookings.length) {
    tbody.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";
  tbody.innerHTML = bookings.map((b) => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.name}</td>
      <td>${b.room}</td>
      <td>${b.checkIn}</td>
      <td>${b.checkOut}</td>
      <td>${b.nights}</td>
      <td><strong>₹${b.total.toLocaleString("en-IN")}</strong></td>
      <td><span class="status-badge">Confirmed</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')">Cancel</button>
      </td>
    </tr>
  `).join("");
}

// Cancel individual booking
function cancelBooking(id) {
  if (confirm(`Are you sure you want to cancel booking ${id}?`)) {
    let bookings = getStoredBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem("hotel_bookings", JSON.stringify(bookings));
    renderBookingsTable();
  }
}

// Clear all bookings
function clearAllBookings() {
  if (confirm("Are you sure you want to clear all reservation records?")) {
    localStorage.removeItem("hotel_bookings");
    renderBookingsTable();
  }
}

// Reset form
function resetBookingForm() {
  document.getElementById("bookingForm").reset();
  setupDateInputs();
  calculateBill();
}

// Display Confirmation Receipt in Modal
function showReceiptModal(b) {
  const modal = document.getElementById("confirmModal");
  const details = document.getElementById("modalReceiptDetails");

  details.innerHTML = `
    <div class="receipt-item"><span>Booking Reference:</span> <strong>${b.id}</strong></div>
    <div class="receipt-item"><span>Guest Name:</span> <strong>${b.name}</strong></div>
    <div class="receipt-item"><span>Contact:</span> <span>${b.phone} | ${b.email}</span></div>
    <div class="receipt-item"><span>Room Category:</span> <strong>${b.room}</strong></div>
    <div class="receipt-item"><span>Stay Dates:</span> <span>${b.checkIn} to ${b.checkOut} (${b.nights} nights)</span></div>
    <div class="receipt-item"><span>Guests:</span> <span>${b.guests} Person(s)</span></div>
    <div class="receipt-item"><span>Payment Preference:</span> <span>${b.payment}</span></div>
    <div class="receipt-item" style="border:none; margin-top:0.8rem; font-size:1.1rem;">
      <span>Grand Total Paid/Payable:</span> <strong style="color:#059669;">₹${b.total.toLocaleString("en-IN")}</strong>
    </div>
  `;

  modal.style.display = "flex";
}

// Close confirmation modal
function closeConfirmModal() {
  document.getElementById("confirmModal").style.display = "none";
}

// Close modal when clicking outside box
window.onclick = function(event) {
  const modal = document.getElementById("confirmModal");
  if (event.target === modal) {
    closeConfirmModal();
  }
};
