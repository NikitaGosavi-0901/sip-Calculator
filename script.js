
const calculateBtn = document.getElementById("calculateBtn");
let growthChart = null;

calculateBtn.addEventListener("click", function () {
    const monthlyInput = document.getElementById("monthlyInvestment").value;
    const yearsInput = document.getElementById("years").value;
    const returnInput = document.getElementById("returnRate").value;

    const monthlyInvestment = Number(monthlyInput);
    const years = Number(yearsInput);
    const returnRate = Number(returnInput);

    const result = document.getElementById("result");

    if (
        monthlyInput === "" ||
        yearsInput === "" ||
        returnInput === "" ||
        !Number.isFinite(monthlyInvestment) ||
        !Number.isInteger(years) ||
        !Number.isFinite(returnRate) ||
        monthlyInvestment <= 0 ||
        years <= 0 ||
        years > 100 ||
        returnRate < 0 ||
        returnRate > 100
    ) {
        result.innerHTML =
            "<p>Please enter a positive monthly investment, whole years from 1 to 100, and a return rate from 0 to 100%.</p>";
        return;
    }

    const totalMonths = years * 12;
    const monthlyRate = returnRate / 100 / 12;
    const totalInvested = monthlyInvestment * totalMonths;

    let futureValue;

    if (monthlyRate === 0) {
        futureValue = totalInvested;
    } else {
        futureValue =
            monthlyInvestment *
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) /
                monthlyRate) *
            (1 + monthlyRate);
    }

    const estimatedGain = futureValue - totalInvested;
    const formatRupees = (amount) =>
        "₹" + amount.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    
    const yearlyTableBody = document.getElementById("yearlyTableBody");
    yearlyTableBody.innerHTML = "";

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        const invested = monthlyInvestment * months;

        let value;

        if (monthlyRate === 0) {
            value = invested;
        } else {
            value =
                monthlyInvestment *
                ((Math.pow(1 + monthlyRate, months) - 1) /
                    monthlyRate) *
                (1 + monthlyRate);
        }

        const gain = value - invested;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${year}</td>
            <td>${formatRupees(invested)}</td>
            <td>${formatRupees(value)}</td>
            <td>${formatRupees(gain)}</td>
        `;

        yearlyTableBody.appendChild(row);
    }


    

    
result.innerHTML = `
    <h3>✨ Your Investment Summary</h3>

    <div class="result-grid">
        <div class="stat-card">
            <p>Total Invested</p>
            <h3>${formatRupees(totalInvested)}</h3>
        </div>

        <div class="stat-card">
            <p>Estimated Gain</p>
            <h3>${formatRupees(estimatedGain)}</h3>
        </div>

        <div class="stat-card highlight-card">
            <p>Future Value</p>
            <h3>${formatRupees(futureValue)}</h3>
        </div>
    </div>

    <p class="disclaimer">
        These are illustrative estimates, not guaranteed returns.
    </p>
`;

    const labels = [];
    const investedData = [];
    const growthData = [];

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        const invested = monthlyInvestment * months;

        let value;
        if (monthlyRate === 0) {
            value = invested;
        } else {
            value =
                monthlyInvestment *
                ((Math.pow(1 + monthlyRate, months) - 1) /
                    monthlyRate) *
                (1 + monthlyRate);
        }

        labels.push("Year " + year);
        investedData.push(Number(invested.toFixed(2)));
        growthData.push(Number(value.toFixed(2)));
    }

    if (growthChart) {
        growthChart.destroy();
    }

    const chartCanvas = document.getElementById("growthChart");

    growthChart = new Chart(chartCanvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Invested",
                    data: investedData,
                    borderColor: "#087f8c",
                    backgroundColor: "rgba(8, 127, 140, 0.1)",
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Estimated Value",
                    data: growthData,
                    borderColor: "#f39c12",
                    backgroundColor: "rgba(243, 156, 18, 0.1)",
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Estimated SIP Growth Over Time"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return "₹" + Number(value).toLocaleString("en-IN");
                        }
                    }
                }
            }
        }
    });
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function () {
    document.getElementById("monthlyInvestment").value = "";
    document.getElementById("years").value = "";
    document.getElementById("returnRate").value = "";

    document.getElementById("result").innerHTML = "";
    document.getElementById("yearlyTableBody").innerHTML = "";

    if (growthChart) {
        growthChart.destroy();
        growthChart = null;
    }
});
