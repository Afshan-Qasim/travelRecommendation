document.addEventListener("DOMContentLoaded", () => {
  const btnSearch = document.getElementById("btnSearch");
  const btnClear = document.getElementById("btnClear");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  // Function to fetch data from the JSON file
  const fetchData = async () => {
    try {
      const response = await fetch("travel_recommendation_api.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch travel data:", error);
      return null;
    }
  };

  // Helper function to get current time for a given time zone
  const getCurrentTimeForTimeZone = (timeZone) => {
    if (!timeZone) return ""; // Return empty if no time zone is provided

    const options = {
      timeZone: timeZone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Use 12-hour format (e.g., 2:30 PM)
    };

    try {
      return new Date().toLocaleTimeString("en-US", options);
    } catch (error) {
      console.error(`Invalid time zone: ${timeZone}`, error);
      return ""; // Return empty on error
    }
  };

  // Function to display results
  const displayResults = (results) => {
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found for your search.</p>";
      return;
    }

    results.forEach((result) => {
      const resultCard = document.createElement("div");
      resultCard.classList.add("result-card");

      // Get the current time for the location
      const currentTime = getCurrentTimeForTimeZone(result.timeZone);

      const content = `
                <img src="${result.imageUrl}" alt="${result.name}">
                <div class="result-card-content">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                    ${
                      currentTime
                        ? `<p><strong>Current Time:</strong> ${currentTime}</p>`
                        : ""
                    }
                </div>
            `;
      resultCard.innerHTML = content;
      resultsContainer.appendChild(resultCard);
    });
  };

  // Search functionality
  const search = async () => {
    const data = await fetchData();
    if (!data) return;

    const keyword = searchInput.value.toLowerCase().trim();
    let results = [];

    if (keyword === "beach" || keyword === "beaches") {
      results = data.beaches;
    } else if (keyword === "temple" || keyword === "temples") {
      results = data.temples;
    } else if (keyword) {
      const foundResults = new Set();

      data.countries.forEach((country) => {
        if (country.name.toLowerCase().includes(keyword)) {
          country.cities.forEach((city) => foundResults.add(city));
        }
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(keyword)) {
            foundResults.add(city);
          }
        });
      });

      results = Array.from(foundResults);
    }

    displayResults(results);
  };

  // Clear functionality
  const clearResults = () => {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  };

  // Event listeners
  btnSearch.addEventListener("click", search);
  btnClear.addEventListener("click", clearResults);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      search();
    }
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      alert(
        `Thank you for your message, ${name}! We will get back to you shortly.`
      );
      contactForm.reset();
    });
  }
});
