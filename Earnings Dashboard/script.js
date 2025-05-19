const ids = ['today', 'week', 'month', 'alltime'];

function animateValue(id, start, end, duration) {
  const input = document.getElementById(id);
  const range = end - start;
  if (range === 0) {
    input.value = '₹' + end.toLocaleString();
    return;
  }
  let current = start;
  const increment = Math.ceil(range / (duration / 25));
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    input.value = '₹' + current.toLocaleString();
  }, 25);
}

function loadEarnings() {
  ids.forEach(id => {
    const val = parseInt(localStorage.getItem(id)) || 0;
    animateValue(id, 0, val, 2000);
  });

  const chartData = JSON.parse(localStorage.getItem('chartData'));
  if (chartData) {
    myChart.data.labels = chartData.labels;
    myChart.data.datasets[0].data = chartData.data;
    myChart.update();
    createInputs();
  }
}

function saveEarning(id) {
  const raw = document.getElementById(id).value.replace(/[^\d]/g, '');
  localStorage.setItem(id, parseInt(raw) || 0);
}

const initialLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const initialData = [1500, 2400, 1800, 3200, 4000, 2200, 3700];

const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [...initialLabels],
    datasets: [{
      label: 'Earnings (₹)',
      data: [...initialData],
      fill: false,
      borderColor: '#007bff',
      tension: 0.3,
      pointBackgroundColor: '#007bff',
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y;
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          },
          stepSize: 500,
          maxTicksLimit: 10
        }
      }
    }
  }
});

function createInputs() {
  const container = document.getElementById('inputsContainer');
  container.innerHTML = '';
  myChart.data.labels.forEach((label, index) => {
    container.innerHTML += `
      <div class="editor-row">
        <input type="text" value="${label}" id="label-${index}" placeholder="Day">
        <input type="number" value="${myChart.data.datasets[0].data[index]}" id="value-${index}" placeholder="Amount">
      </div>
    `;
  });
}

function updateChart() {
  const newLabels = [];
  const newData = [];

  myChart.data.labels.forEach((_, index) => {
    const newLabel = document.getElementById(`label-${index}`).value;
    const newValue = parseFloat(document.getElementById(`value-${index}`).value);
    newLabels.push(newLabel);
    newData.push(newValue);
  });

  myChart.data.labels = newLabels;
  myChart.data.datasets[0].data = newData;
  myChart.update();

  localStorage.setItem('chartData', JSON.stringify({ labels: newLabels, data: newData }));
}

window.onload = loadEarnings;
createInputs();
