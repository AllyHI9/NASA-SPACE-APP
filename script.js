// script.js (auto sets start date to 9 days ago)


// IMPORTANT: Do NOT commit real API keys or secrets. Replace the value below with your
// own NASA API key locally before running, or load it from a secure place.
// For example, set the key in an environment variable and inject it at build time.
const API_KEY = "REPLACE_WITH_YOUR_NASA_API_KEY"; // <-- replace locally
const gallery = document.getElementById("gallery");
const fetchBtn = document.getElementById("fetchBtn");
const startDateInput = document.getElementById("startDate");
const loadingMsg = document.getElementById("loadingMsg");


const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.querySelector(".close");


// Auto-set start date to 9 days ago
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const nineDaysAgo = new Date();
  nineDaysAgo.setDate(today.getDate() - 8);


  startDateInput.value = nineDaysAgo.toISOString().split("T")[0];
});


fetchBtn.addEventListener("click", fetchAPODData);


async function fetchAPODData() {
  const startDate = startDateInput.value;
  if (!startDate) {
    alert("Please select a start date.");
    return;
  }


  loadingMsg.style.display = "block";
  gallery.innerHTML = "";


  try {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 8); // 9 days total


    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];


    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startStr}&end_date=${endStr}`;


    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);


    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected data format.");


    displayGallery(data);
  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class='error'>Error loading data. Please try again later.</p>`;
  } finally {
    loadingMsg.style.display = "none";
  }
}


function displayGallery(images) {
  images.forEach((item) => {
    if (item.media_type !== "image") return; // skip videos


    const card = document.createElement("div");
    card.className = "card";


    card.innerHTML = `
      <img src='${item.url}' alt='${item.title}' />
      <div class='card-info'>
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      </div>
    `;


    card.addEventListener("click", () => openModal(item));
    gallery.appendChild(card);
  });
}


function openModal(item) {
  modalImg.src = item.hdurl || item.url;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalDesc.textContent = item.explanation;
  modal.style.display = "block";
}


closeModal.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});
