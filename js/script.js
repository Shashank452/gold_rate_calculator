// Function to fetch and display the live gold rate
function fetchGoldRate(callback) {
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", "goldapi-5z18ld4gkwkcydf4-io");
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    fetch("https://www.goldapi.io/api/XAU/INR", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch the gold rate.");
            }
            return response.json();
        })
        .then((data) => {
            const goldRate = data.price_gram_24k;
            // Update the gold rate display
            document.getElementById("currentGoldRate").textContent = `₹${goldRate.toFixed(2)}`;
            callback(goldRate);
        })
        .catch((error) => {
            console.error("Error fetching gold rate:", error);
            document.getElementById("currentGoldRate").textContent = "Error fetching rate. Enter manually.";
        });
}

// Default wastage percentage based on jewelry type
function getDefaultWastage(jewelryType) {
    switch (jewelryType) {
        case "chain":
            return 3.5; // Average of 2% to 5%
        case "bangle":
            return 4.5; // Average of 3% to 6%
        case "necklace":
            return 9; // Average of 6% to 12%
        case "ring":
            return 3.5; // Average of 2% to 5%
        case "earrings":
            return 6.5; // Average of 5% to 8%
        case "pendant":
            return 5.5; // Average of 3% to 8%
        case "studded":
            return 11.5; // Average of 8% to 15%
        case "custom":
            return 15; // Average of 10% to 20%
        default:
            return 0; // Default wastage
    }
}

// Calculate the price based on purity (karats)
function adjustRateForPurity(goldRate, purity) {
    // 24K gold is considered pure, so we adjust the rate based on purity.
    return goldRate * (purity / 24); // Adjust the rate according to purity
}

// Calculate gold price based on user input
function calculateGoldPrice() {
    const location = document.getElementById("location").value;
    const manualGoldRate = parseFloat(document.getElementById("goldRate").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const jewelryType = document.getElementById("jewelryType").value;
    let wastage = parseFloat(document.getElementById("wastage").value);
    const makingCharges = parseFloat(document.getElementById("makingCharges").value) || 0;
    const purity = parseFloat(document.getElementById("purity").value) || 22; // Get purity from the dropdown, default to 22K

    if (!weight || weight <= 0) {
        alert("Please enter a valid weight.");
        return;
    }

    // Use default wastage if not provided
    if (!wastage || wastage <= 0) {
        wastage = getDefaultWastage(jewelryType);
    }

    // Function to calculate and display results
    function displayResult(goldRate) {
        const adjustedRate = adjustRateForPurity(goldRate, purity); // Adjust the rate for purity
        const wastageAmount = (weight * wastage) / 100;
        const wastagePrice = wastageAmount * adjustedRate;
        const totalWeight = weight + wastageAmount;
        const goldPrice = totalWeight * adjustedRate;
        const totalPrice = goldPrice + (makingCharges * weight);

        document.getElementById("result").style.display = "block";
        document.getElementById("result").innerHTML = `
            Gold Price (₹${purity}K): ₹${goldPrice.toFixed(2)}<br>
            Wastage: ₹${wastagePrice.toFixed(2)} (${wastageAmount.toFixed(2)} grams, ${wastage}%)<br>
            Making Charges: ₹${(makingCharges * weight).toFixed(2)}<br>
            <h2>Total Price: ₹${totalPrice.toFixed(2)}</h2>
        `;
    }

    // If gold rate is entered manually, use it; otherwise, fetch the live rate
    if (manualGoldRate && manualGoldRate > 0) {
        displayResult(manualGoldRate);
    } else {
        fetchGoldRate(displayResult);
    }
}

// Automatically fetch and display the live gold rate when the page is loaded
window.onload = function() {
    // Display "Fetching..." initially
    document.getElementById("currentGoldRate").textContent = "Fetching...";

    // Fetch the live gold rate
    fetchGoldRate((rate) => {
        console.log("Fetched gold rate:", rate);
    });
};
