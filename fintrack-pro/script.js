const STORAGE_KEYS = {
      transactions: "fintrack_transactions",
      profile: "fintrack_profile"
    };

    const currencySymbols = {
      INR: "\u20b9",
      USD: "$",
      EUR: "\u20ac",
      GBP: "Â£",
      JPY: "Â¥"
    };

    const categoryIcons = {
      Salary: "ðŸ’¼",
      Food: "ðŸ½ï¸",
      Transport: "ðŸš•",
      Shopping: "ðŸ›ï¸",
      Bills: "ðŸ§¾",
      Entertainment: "ðŸŽ¬",
      Other: "ðŸ“Œ"
    };

    let transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
    let profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)) || {
      name: "",
      currency: "INR",
      darkMode: false
    };
    let activeFilter = "all";
    let cashFlowChart;

    const dashboardPage = document.getElementById("dashboardPage");
    const settingsPage = document.getElementById("settingsPage");
    const dashboardNav = document.getElementById("dashboardNav");
    const settingsNav = document.getElementById("settingsNav");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const transactionForm = document.getElementById("transactionForm");
    const transactionTable = document.getElementById("transactionTable");
    const emptyState = document.getElementById("emptyState");
    const searchInput = document.getElementById("searchInput");
    const nameInput = document.getElementById("nameInput");
    const currencyInput = document.getElementById("currencyInput");
    const darkModeInput = document.getElementById("darkModeInput");
    const resetBtn = document.getElementById("resetBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    function saveTransactions() {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
    }

    function saveProfile() {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    }

    function formatMoney(amount) {
      const symbol = currencySymbols[profile.currency] || "\u20b9";
      return `${symbol}${Number(amount).toFixed(2)}`;
    }

    function showPage(pageName) {
      const isDashboard = pageName === "dashboard";
      dashboardPage.classList.toggle("active", isDashboard);
      settingsPage.classList.toggle("active", !isDashboard);
      dashboardNav.classList.toggle("active", isDashboard);
      settingsNav.classList.toggle("active", !isDashboard);
    }

    function openModal() {
      document.getElementById("dateInput").valueAsDate = new Date();
      modalBackdrop.classList.add("open");
    }

    function closeModal() {
      modalBackdrop.classList.remove("open");
      transactionForm.reset();
    }

    function getFilteredTransactions() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      return transactions.filter((transaction) => {
        const matchesFilter = activeFilter === "all" || transaction.type === activeFilter;
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
      });
    }

    function renderSummary() {
      const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const expense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const balance = income - expense;

      document.getElementById("balanceValue").textContent = formatMoney(balance);
      document.getElementById("incomeValue").textContent = formatMoney(income);
      document.getElementById("expenseValue").textContent = formatMoney(expense);
      document.getElementById("countValue").textContent = transactions.length;
      document.getElementById("transactionBadge").textContent = transactions.length;
      document.getElementById("welcomeTitle").textContent = profile.name ? `Welcome back, ${profile.name}` : "Welcome back";
    }

    function renderTable() {
      const visibleTransactions = getFilteredTransactions();
      transactionTable.innerHTML = "";
      emptyState.style.display = visibleTransactions.length ? "none" : "block";

      visibleTransactions.forEach((transaction) => {
        const row = document.createElement("tr");
        const typeClass = transaction.type === "income" ? "income" : "expense";
        row.innerHTML = `
          <td>${transaction.description}</td>
          <td>${categoryIcons[transaction.category] || "ðŸ“Œ"} ${transaction.category}</td>
          <td class="${typeClass}">${transaction.type}</td>
          <td>${transaction.date}</td>
          <td class="${typeClass}">${formatMoney(transaction.amount)}</td>
          <td><button class="delete-btn" data-id="${transaction.id}" type="button">Delete</button></td>
        `;
        transactionTable.appendChild(row);
      });
    }

    function buildChartData() {
      const grouped = {};
      transactions.forEach((transaction) => {
        if (!grouped[transaction.date]) {
          grouped[transaction.date] = { income: 0, expense: 0 };
        }
        grouped[transaction.date][transaction.type] += transaction.amount;
      });

      const labels = Object.keys(grouped).sort();
      return {
        labels,
        income: labels.map((date) => grouped[date].income),
        expense: labels.map((date) => grouped[date].expense)
      };
    }

    function renderChart() {
      const chartCanvas = document.getElementById("cashFlowChart");
      const data = buildChartData();

      if (cashFlowChart) {
        cashFlowChart.destroy();
      }

      cashFlowChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: data.labels.length ? data.labels : ["No data"],
          datasets: [
            {
              label: "Income",
              data: data.income.length ? data.income : [0],
              backgroundColor: "#16a34a"
            },
            {
              label: "Expenses",
              data: data.expense.length ? data.expense : [0],
              backgroundColor: "#dc2626"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              labels: {
                color: getComputedStyle(document.body).getPropertyValue("--text").trim()
              }
            }
          }
        }
      });
    }

    function applyProfile() {
      document.body.classList.toggle("dark", profile.darkMode);
      nameInput.value = profile.name;
      currencyInput.value = profile.currency;
      darkModeInput.checked = profile.darkMode;
    }

    function refreshApp() {
      saveTransactions();
      saveProfile();
      applyProfile();
      renderSummary();
      renderTable();
      renderChart();
    }

    function exportCsv() {
      if (!transactions.length) {
        alert("No transactions available to export.");
        return;
      }

      const headers = ["Description", "Category", "Type", "Date", "Amount"];
      const rows = transactions.map((transaction) => [
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.date,
        transaction.amount
      ]);
      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fintrack-transactions.csv";
      link.click();
      URL.revokeObjectURL(url);
    }

    dashboardNav.addEventListener("click", () => showPage("dashboard"));
    settingsNav.addEventListener("click", () => showPage("settings"));
    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);
    exportCsvBtn.addEventListener("click", exportCsv);

    modalBackdrop.addEventListener("click", (event) => {
      if (event.target === modalBackdrop) {
        closeModal();
      }
    });

    transactionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const description = document.getElementById("descriptionInput").value.trim();
      const amount = Number(document.getElementById("amountInput").value);
      const date = document.getElementById("dateInput").value;
      const category = document.getElementById("categoryInput").value;
      const type = document.getElementById("typeInput").value;

      if (!description || !amount || !date || !category || !type) {
        alert("Please fill all transaction fields.");
        return;
      }

      transactions.push({
        id: Date.now(),
        description,
        amount,
        date,
        category,
        type
      });

      closeModal();
      refreshApp();
    });

    transactionTable.addEventListener("click", (event) => {
      if (!event.target.matches(".delete-btn")) {
        return;
      }

      const id = Number(event.target.dataset.id);
      transactions = transactions.filter((transaction) => transaction.id !== id);
      refreshApp();
    });

    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("primary"));
        button.classList.add("primary");
        renderTable();
      });
    });

    searchInput.addEventListener("input", renderTable);

    nameInput.addEventListener("input", () => {
      profile.name = nameInput.value.trim();
      refreshApp();
    });

    currencyInput.addEventListener("change", () => {
      profile.currency = currencyInput.value;
      refreshApp();
    });

    darkModeInput.addEventListener("change", () => {
      profile.darkMode = darkModeInput.checked;
      refreshApp();
    });

    resetBtn.addEventListener("click", () => {
      const confirmed = confirm("This will delete all saved FinTrack Pro data. Continue?");
      if (!confirmed) {
        return;
      }

      transactions = [];
      profile = {
        name: "",
        currency: "INR",
        darkMode: false
      };
      refreshApp();
    });

    applyProfile();
    refreshApp();
