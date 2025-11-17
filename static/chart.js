async function loadChartData() {
  // const res = await fetch("http://localhost:5001/graph");
  const res = await fetch("https://admin.djplaynow.com/graph");
  const data = await res.json();

  const ctx = document.getElementById("revenueChart").getContext("2d");
  const totalIncome = data.currentWeek.reduce((sum, val) => sum + val, 0);
  document.getElementById(
    "weekly-income"
  ).textContent = `$${totalIncome.toLocaleString()}`;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Revenue (This Week)",
          data: data.currentWeek,
          borderColor: "#3b82f6", // blue-500
          backgroundColor: "#3b82f6",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 6,
          pointBackgroundColor: "#3b82f6",
          fill: false,
        },
        {
          label: "Revenue (Last Week)",
          data: data.previousWeek,
          borderColor: "#f97316", // orange-500
          backgroundColor: "#f97316",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 6,
          pointBackgroundColor: "#f97316",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0, // 🚀 ensures Y-axis starts from 0, no negatives
          ticks: { color: "#9ca3af" },
          grid: { color: "#374151" },
        },
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "#374151" },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: "#1f2937",
          titleColor: "#fff",
          bodyColor: "#d1d5db",
        },
        legend: {
          labels: {
            color: "#d1d5db",
          },
        },
      },
    },
  });
}

loadChartData();
