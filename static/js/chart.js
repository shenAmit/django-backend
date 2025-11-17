const labels = JSON.parse(document.getElementById("labels").value);
const values = JSON.parse(document.getElementById("values").value);

const ctx = document.getElementById("eventChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Event Attendance",
        data: values,
        backgroundColor: "lime",
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  },
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems){
            const index = tooltipItems[0].dataIndex;
            return labels[index];
          },
        },
      },
    },
    scales: {
      x: {
          offset: true, // <-- Add this line
        title: {
          display: true,
          text: "Events",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
          callback: function (value, index){
            const label = this.getLabelForValue(value);
            const firstWord = label.split(" ")[0];
            return firstWord.length < label.length ? `${firstWord}...` : firstWord;
          }
        },
        grid: {
          display: false,
        },
        // 💡 This reduces spacing
        barPercentage: 0.4,
        categoryPercentage: 0.6,
      },
      y: {
        title: {
          display: true,
          text: "Event Attendance",
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  },
});

const canvas = document.getElementById("eventChart");
canvas.addEventListener("mousemove", function (evt) {
  const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
  canvas.style.cursor = points.length ? "pointer" : "default";
});
