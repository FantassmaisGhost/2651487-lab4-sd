document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("input");
    const button = document.querySelector("button");
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");

    button.addEventListener("click", () => {
        const countryName = input.value.trim();
        if (countryName === "") {
            displayError("Please enter a country name.");
            return;
        }
        fetchCountryData(countryName);
    });

    async function fetchCountryData(countryName) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            if (!response.ok) throw new Error("Country not found. Try again!");
            
            const data = await response.json();
            const country = data[0];

            // Extract country info
            const { capital, population, region, flags, borders } = country;
            const countryHTML = `
                <h2>${country.name.common}</h2>
                <img src="${flags.svg}" alt="Flag of ${country.name.common}" width="150">
                <p><strong>Capital:</strong> ${capital ? capital[0] : "N/A"}</p>
                <p><strong>Population:</strong> ${population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${region}</p>
            `;

            countryInfo.innerHTML = countryHTML;

            // Fetch bordering countries
            if (borders) {
                fetchBorderingCountries(borders);
            } else {
                borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            }
        } catch (error) {
            displayError(error.message);
        }
    }

    async function fetchBorderingCountries(borderCodes) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`);
            if (!response.ok) throw new Error("Error fetching bordering countries.");

            const data = await response.json();
            borderingCountries.innerHTML = "<h3>Bordering Countries:</h3>";

            data.forEach(country => {
                const countryDiv = document.createElement("div");
                countryDiv.classList.add("bordering-country");
                countryDiv.innerHTML = `
                    <p>${country.name.common}</p>
                    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="50">
                `;
                borderingCountries.appendChild(countryDiv);
            });
        } catch (error) {
            borderingCountries.innerHTML = "<p>Could not load bordering countries.</p>";
        }
    }

    function displayError(message) {
        countryInfo.innerHTML = `<p style="color: red;">${message}</p>`;
        borderingCountries.innerHTML = "";
    }
});
