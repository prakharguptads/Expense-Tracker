// Update category and sub-category options dynamically
const categories = {
  fixed: [
    "Rent/Mortgage",
    "Utilities",
    "Insurance",
    "Loan Repayments",
    "Subscriptions",
  ],
  variable: [
    "Groceries",
    "Dining Out",
    "Food Delivery",
    "Transportation",
    "Entertainment",
    "Clothing",
    "Gifts/Donations",
  ],
  discretionary: ["Travel", "Hobbies", "Electronics", "Beauty & Personal Care"],
  healthcare: ["Medical Bills", "Medications", "Gym/Health Club"],
  education: ["Tuition Fees", "Books & Supplies", "Online Courses"],
  home_maintenance: ["Repairs", "Cleaning", "Gardening/Lawn Care"],
  childcare: ["Childcare", "School Fees", "Pet Care"],
  debt_repayment: ["Credit Card Payments", "Personal Loans"],
  miscellaneous: ["Unexpected Expenses", "Other"],
};

function saveExpense() {
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("date");
  const commentInput = document.getElementById("comment");
  const subcategoryInput = document.getElementById("sub-category");

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;
  const subcategory = subcategoryInput.value;

  if (amount === "" || category === "" || date === "" || subcategory === "") {
    alert("Please fill in all fields.");
    return;
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const expense = {
    id: Date.now(),
    amount: parseFloat(amount),
    category,
    date,
    comment,
    subcategory,
  };

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  amountInput.value = "";
  categoryInput.selectedIndex = 0;
  dateInput.value = "";
  commentInput.value = "";
  subcategoryInput.value = "";

  alert("Expense saved successfully.");

  displayTotals();
  updateSubCategoryOptions();
  showCategoryExpenses(category);
}

function displayTotals() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const categoryTotals = {};
  let totalExpense = 0;

  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
    totalExpense += expense.amount;
  });

  const totalsDiv = document.getElementById("totals");
  totalsDiv.innerHTML = "";

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement("p");
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = "pointer";
    totalElement.onclick = () => showCategoryExpenses(category);
    totalsDiv.appendChild(totalElement);
  }

  const totalExpenseElement = document.createElement("p");
  totalExpenseElement.textContent = `Total Expense: ₹${totalExpense.toFixed(
    2
  )}`;
  totalExpenseElement.style.fontWeight = "bold";
  totalsDiv.appendChild(totalExpenseElement);
}

function showCategoryExpenses(category) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const categoryExpensesDiv = document.getElementById("categoryExpenses");
  const selectedCategorySpan = document.getElementById("selectedCategory");
  const categoryExpensesList = document.getElementById("categoryExpensesList");

  const categoryExpenses = expenses.filter(
    (expense) => expense.category === category
  );

  selectedCategorySpan.textContent = category;
  categoryExpensesList.innerHTML = "";

  if (categoryExpenses.length === 0) {
    categoryExpensesList.innerHTML = "No expenses for this category.";
  } else {
    categoryExpenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.classList.add("expense-item");

      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = `<button onclick="deleteExpense(${expense.id})">Delete</button>`;

      const editButton = document.createElement("div");
      editButton.classList.add("edit-button");
      editButton.innerHTML = `<button onclick="editExpense(${expense.id})">Edit</button>`;

      const expenseInfo = document.createElement("div");
      expenseInfo.classList.add("info");
      expenseInfo.innerHTML = `
        <strong>Date:</strong> ${expense.date}<br>
        <strong>Amount:</strong> ₹${expense.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${expense.comment || "N/A"}<br>
        <strong>Sub Category:</strong> ${expense.subcategory || "N/A"}`;

      expenseItem.appendChild(expenseInfo);
      expenseItem.appendChild(editButton);
      expenseItem.appendChild(deleteButton);

      categoryExpensesList.appendChild(expenseItem);
    });
  }

  categoryExpensesDiv.style.display = "block";
}

function deleteExpense(id) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses = expenses.filter((expense) => expense.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayTotals();
  const selectedCategory =
    document.getElementById("selectedCategory").textContent;
  showCategoryExpenses(selectedCategory);
}

function editExpense(id) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expense = expenses.find((expense) => expense.id === id);

  if (expense) {
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;
    document.getElementById("comment").value = expense.comment;

    window.editingId = id;

    document.querySelector(".button-group button").textContent =
      "Update Expense";
    document.querySelector(".button-group button").onclick = updateExpense;
  }
}

function updateExpense() {
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("date");
  const commentInput = document.getElementById("comment");
  const subcategoryInput = document.getElementById("sub-category");

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;
  const subcategory = subcategoryInput.value;

  if (amount === "" || category === "" || date === "" || subcategory === "") {
    alert("Please fill in all fields.");
    return;
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expenseIndex = expenses.findIndex(
    (expense) => expense.id === window.editingId
  );

  if (expenseIndex !== -1) {
    expenses[expenseIndex] = {
      id: window.editingId,
      amount: parseFloat(amount),
      category,
      date,
      comment,
      subcategory,
    };

    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Expense updated successfully.");

    amountInput.value = "";
    categoryInput.selectedIndex = 0;
    dateInput.value = "";
    commentInput.value = "";
    subcategoryInput.value = "";

    displayTotals();
    updateSubCategoryOptions();
    showCategoryExpenses(category);

    document.querySelector(".button-group button").textContent = "Save";
    document.querySelector(".button-group button").onclick = saveExpense;
    window.editingId = null;
  }
}

function downloadExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (expenses.length === 0) {
    alert("No expenses to download.");
    return;
  }

  // Calculate total expense
  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Group expenses by category and subcategory
  const summaryByCategory = {};
  expenses.forEach((expense) => {
    if (!summaryByCategory[expense.category]) {
      summaryByCategory[expense.category] = {};
    }
    if (!summaryByCategory[expense.category][expense.subcategory]) {
      summaryByCategory[expense.category][expense.subcategory] = 0;
    }
    summaryByCategory[expense.category][expense.subcategory] += expense.amount;
  });

  // Convert expenses to sheet format
  const worksheet = XLSX.utils.json_to_sheet(expenses);

  // Add total expense as a row at the end
  const totalRow = { date: "Total", amount: totalAmount.toFixed(2) };
  XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

  // Create a summary sheet for category and subcategory
  const categorySummary = [];
  for (const category in summaryByCategory) {
    for (const subcategory in summaryByCategory[category]) {
      categorySummary.push({
        category,
        subcategory,
        total: summaryByCategory[category][subcategory].toFixed(2),
      });
    }
  }
  const summaryWorksheet = XLSX.utils.json_to_sheet(categorySummary);

  // Create a new workbook and append sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Category Summary");

  // Download the workbook as an Excel file
  XLSX.writeFile(workbook, "expenses.xlsx");
}


function downloadMonthExpenses() {
  const yearInput = document.getElementById("year");
  const monthInput = document.getElementById("month");
  const selectedYear = yearInput.value;
  const selectedMonth = monthInput.value.padStart(2, "0");

  if (!selectedYear || !selectedMonth) {
    alert("Please select both year and month.");
    return;
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const filteredExpenses = expenses.filter((expense) =>
    expense.date.startsWith(`${selectedYear}-${selectedMonth}`)
  );

  if (filteredExpenses.length === 0) {
    alert("No expenses for the selected month.");
    return;
  }

  // Calculate total expense for the selected month
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Group expenses by category and subcategory
  const summaryByCategory = {};
  filteredExpenses.forEach((expense) => {
    if (!summaryByCategory[expense.category]) {
      summaryByCategory[expense.category] = {};
    }
    if (!summaryByCategory[expense.category][expense.subcategory]) {
      summaryByCategory[expense.category][expense.subcategory] = 0;
    }
    summaryByCategory[expense.category][expense.subcategory] += expense.amount;
  });

  // Convert filtered expenses to sheet format
  const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);

  // Add total expense for the month as a row at the end
  const totalRow = { date: "Total", amount: totalAmount.toFixed(2) };
  XLSX.utils.sheet_add_json(worksheet, [totalRow], { skipHeader: true, origin: -1 });

  // Create a summary sheet for category and subcategory
  const categorySummary = [];
  for (const category in summaryByCategory) {
    for (const subcategory in summaryByCategory[category]) {
      categorySummary.push({
        category,
        subcategory,
        total: summaryByCategory[category][subcategory].toFixed(2),
      });
    }
  }
  const summaryWorksheet = XLSX.utils.json_to_sheet(categorySummary);

  // Create a new workbook and append sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Expenses_${selectedYear}_${selectedMonth}`);
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Category Summary");

  // Download the workbook as an Excel file
  XLSX.writeFile(workbook, `expenses_${selectedYear}_${selectedMonth}.xlsx`);
}


function filterExpenses() {
  const yearInput = document.getElementById("year");
  const monthInput = document.getElementById("month");
  const selectedYear = yearInput.value;
  const selectedMonth = monthInput.value.padStart(2, "0");

  if (!selectedYear || !selectedMonth) {
    alert("Please select both year and month.");
    return;
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const filteredExpenses = expenses.filter((expense) =>
    expense.date.startsWith(`${selectedYear}-${selectedMonth}`)
  );

  if (filteredExpenses.length === 0) {
    alert("No expenses for the selected month.");
    return;
  }

  const categoryTotals = {};
  filteredExpenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  const totalsDiv = document.getElementById("totals");
  totalsDiv.innerHTML = "";

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement("p");
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = "pointer";
    totalElement.onclick = () => showCategoryExpenses(category);
    totalsDiv.appendChild(totalElement);
  }
}

function clearFilter() {
  document.getElementById("year").value = "";
  document.getElementById("month").value = "";
  displayTotals();
  document.getElementById("categoryExpenses").style.display = "none";
}

// Function to switch between tabs
function switchTab(tab) {
  const expenseTabContent = document.getElementById("expenseTabContent");
  const earningTabContent = document.getElementById("earningTabContent");
  const investmentTabContent = document.getElementById("investmentTabContent");

  const expenseTabButton = document.getElementById("expenseTab");
  const earningTabButton = document.getElementById("earningTab");
  const investmentTabButton = document.getElementById("investmentTab");

  // Hide all content
  expenseTabContent.style.display = "none";
  earningTabContent.style.display = "none";
  investmentTabContent.style.display = "none";

  // Remove active class from all tabs
  expenseTabButton.classList.remove("active");
  earningTabButton.classList.remove("active");
  investmentTabButton.classList.remove("active");

  // Show the selected tab content
  if (tab === "expense") {
    expenseTabContent.style.display = "block";
    expenseTabButton.classList.add("active");
  } else if (tab === "earning") {
    earningTabContent.style.display = "block";
    earningTabButton.classList.add("active");
  } else if (tab === "investment") {
    investmentTabContent.style.display = "block";
    investmentTabButton.classList.add("active");
  }
}
// Function to save investment
function saveInvestment() {
  const investmentAmountInput = document.getElementById("investmentAmount");
  const investmentTypeInput = document.getElementById("investmentType");
  const investmentDateInput = document.getElementById("investmentDate");
  const investmentCommentInput = document.getElementById("investmentComment");

  const amount = investmentAmountInput.value;
  const type = investmentTypeInput.value;
  const date = investmentDateInput.value;
  const comment = investmentCommentInput.value;

  if (amount === "" || type === "" || date === "") {
    alert("Please fill in all fields.");
    return;
  }

  const investments = JSON.parse(localStorage.getItem("investments")) || [];

  const investment = {
    id: Date.now(),
    amount: parseFloat(amount),
    type,
    date,
    comment,
  };

  investments.push(investment);

  localStorage.setItem("investments", JSON.stringify(investments));

  investmentAmountInput.value = "";
  investmentTypeInput.selectedIndex = 0;
  investmentDateInput.value = "";
  investmentCommentInput.value = "";

  alert("Investment saved successfully.");

  displayInvestmentTotals();
  showInvestmentDetails(type);
}

// Function to display investment totals
function displayInvestmentTotals() {
  const investments = JSON.parse(localStorage.getItem("investments")) || [];
  const typeTotals = {};
  let totalInvestment = 0;

  investments.forEach((investment) => {
    if (typeTotals[investment.type]) {
      typeTotals[investment.type] += investment.amount;
    } else {
      typeTotals[investment.type] = investment.amount;
    }
    totalInvestment += investment.amount;
  });

  const totalsDiv = document.getElementById("investmentTotals");
  totalsDiv.innerHTML = "";

  for (const type in typeTotals) {
    const totalAmount = typeTotals[type];
    const totalElement = document.createElement("p");
    totalElement.textContent = `${type}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = "pointer";
    totalElement.onclick = () => showInvestmentDetails(type);
    totalsDiv.appendChild(totalElement);
  }

  const totalInvestmentElement = document.createElement("p");
  totalInvestmentElement.textContent = `Total Investment: ₹${totalInvestment.toFixed(
    2
  )}`;
  totalInvestmentElement.style.fontWeight = "bold";
  totalsDiv.appendChild(totalInvestmentElement);
}

// Function to show details of a specific investment type
function showInvestmentDetails(type) {
  const investments = JSON.parse(localStorage.getItem("investments")) || [];
  const investmentDetailsDiv = document.getElementById("investmentDetails");
  const investmentDetailsList = document.getElementById(
    "investmentDetailsList"
  );

  const filteredInvestments = investments.filter(
    (investment) => investment.type === type
  );

  investmentDetailsList.innerHTML = "";

  if (filteredInvestments.length === 0) {
    investmentDetailsList.innerHTML = "No investments for this type.";
  } else {
    filteredInvestments.forEach((investment) => {
      const investmentItem = document.createElement("div");
      investmentItem.classList.add("investment-item");

      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = `<button onclick="deleteInvestment(${investment.id})">Delete</button>`;

      const expenseInfo = document.createElement("div");
      expenseInfo.classList.add("info");
      expenseInfo.innerHTML = `
        <strong>Date:</strong> ${investment.date}<br>
        <strong>Amount:</strong> ₹${investment.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${investment.comment || "N/A"}`;

      investmentItem.appendChild(expenseInfo);
      investmentItem.appendChild(deleteButton);

      investmentDetailsList.appendChild(investmentItem);
    });
  }

  investmentDetailsDiv.style.display = "block";
}

// Function to delete an investment
function deleteInvestment(id) {
  let investments = JSON.parse(localStorage.getItem("investments")) || [];
  investments = investments.filter((investment) => investment.id !== id);
  localStorage.setItem("investments", JSON.stringify(investments));

  displayInvestmentTotals();
  const selectedType = document.getElementById("selectedType").textContent;
  showInvestmentDetails(selectedType);
}

// Function to save earnings
function saveEarning() {
  const earningAmountInput = document.getElementById("earningAmount");
  const earningCategoryInput = document.getElementById("earningCategory");
  const earningDateInput = document.getElementById("earningDate");
  const earningCommentInput = document.getElementById("earningComment");

  const amount = earningAmountInput.value;
  const category = earningCategoryInput.value;
  const date = earningDateInput.value;
  const comment = earningCommentInput.value;

  if (amount === "" || category === "" || date === "") {
    alert("Please fill in all fields.");
    return;
  }

  const earnings = JSON.parse(localStorage.getItem("earnings")) || [];

  const earning = {
    id: Date.now(),
    amount: parseFloat(amount),
    category,
    date,
    comment,
  };

  earnings.push(earning);

  localStorage.setItem("earnings", JSON.stringify(earnings));

  earningAmountInput.value = "";
  earningCategoryInput.selectedIndex = 0;
  earningDateInput.value = "";
  earningCommentInput.value = "";

  alert("Earning saved successfully.");

  displayEarningTotals();
  showEarningDetails(category);
}

// Function to display earning totals
function displayEarningTotals() {
  const earnings = JSON.parse(localStorage.getItem("earnings")) || [];
  const categoryTotals = {};
  let totalEarning = 0;

  earnings.forEach((earning) => {
    if (categoryTotals[earning.category]) {
      categoryTotals[earning.category] += earning.amount;
    } else {
      categoryTotals[earning.category] = earning.amount;
    }
    totalEarning += earning.amount;
  });

  const totalsDiv = document.getElementById("earningTotals");
  totalsDiv.innerHTML = "";

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement("p");
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = "pointer";
    totalElement.onclick = () => showEarningDetails(category);
    totalsDiv.appendChild(totalElement);
  }

  const totalEarningElement = document.createElement("p");
  totalEarningElement.textContent = `Total Earnings: ₹${totalEarning.toFixed(
    2
  )}`;
  totalEarningElement.style.fontWeight = "bold";
  totalsDiv.appendChild(totalEarningElement);
}

// Function to show details of a specific earning category
function showEarningDetails(category) {
  const earnings = JSON.parse(localStorage.getItem("earnings")) || [];
  const earningDetailsDiv = document.getElementById("earningDetails");
  const earningDetailsList = document.getElementById("earningDetailsList");

  const filteredEarnings = earnings.filter(
    (earning) => earning.category === category
  );

  earningDetailsList.innerHTML = "";

  if (filteredEarnings.length === 0) {
    earningDetailsList.innerHTML = "No earnings for this category.";
  } else {
    filteredEarnings.forEach((earning) => {
      const earningItem = document.createElement("div");
      earningItem.classList.add("earning-item");

      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = `<button onclick="deleteEarning(${earning.id})">Delete</button>`;

      const earningInfo = document.createElement("div");
      earningInfo.classList.add("info");
      earningInfo.innerHTML = `
        <strong>Date:</strong> ${earning.date}<br>
        <strong>Amount:</strong> ₹${earning.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${earning.comment || "N/A"}`;

      earningItem.appendChild(earningInfo);
      earningItem.appendChild(deleteButton);

      earningDetailsList.appendChild(earningItem);
    });
  }

  earningDetailsDiv.style.display = "block";
}

// Function to delete an earning
function deleteEarning(id) {
  let earnings = JSON.parse(localStorage.getItem("earnings")) || [];
  earnings = earnings.filter((earning) => earning.id !== id);
  localStorage.setItem("earnings", JSON.stringify(earnings));

  displayEarningTotals();
  const selectedCategory =
    document.getElementById("selectedCategory").textContent;
  showEarningDetails(selectedCategory);
}

// Function to update the sub-category select based on the main category
// Update sub-category options based on the category selected
function updateSubCategoryOptions() {
  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("sub-category");
  const subCategoryFilterSelect = document.getElementById("subcategoryFilter");
  const selectedCategory = categorySelect.value;
  const subCategories = categories[selectedCategory] || [];

  // Clear existing sub-category options
  subCategorySelect.innerHTML = "";
  subCategoryFilterSelect.innerHTML = "<option value=''>Select Subcategory</option>"; // Clear filter options

  // Add new sub-category options to both the subcategory input and the filter dropdown
  subCategories.forEach((subCategory) => {
    const option = document.createElement("option");
    option.value = subCategory.toLowerCase().replace(/ /g, "-");
    option.textContent = subCategory;

    // Add to both the sub-category input and the filter dropdown
    subCategorySelect.appendChild(option);
    const filterOption = document.createElement("option");
    filterOption.value = subCategory.toLowerCase().replace(/ /g, "-");
    filterOption.textContent = subCategory;
    subCategoryFilterSelect.appendChild(filterOption);
  });
}

// Function to filter expenses based on subcategory
// Function to filter expenses based on subcategory and show the total
function filterBySubcategory() {
  const subcategorySelect = document.getElementById("subcategoryFilter");
  const selectedSubcategory = subcategorySelect.value;

  if (!selectedSubcategory) {
    alert("Please select a subcategory to filter.");
    return;
  }

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const filteredExpenses = expenses.filter(
    (expense) => expense.subcategory === selectedSubcategory
  );

  // Calculate the total amount for the filtered subcategory
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Update the display with the filtered expenses and the total
  const categoryExpensesDiv = document.getElementById("categoryExpenses");
  const categoryExpensesList = document.getElementById("categoryExpensesList");
  categoryExpensesList.innerHTML = "";

  // Show total amount above the filtered expenses
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.innerHTML = `<strong>Total for ${selectedSubcategory.replace(
    /-/g,
    " "
  )}:</strong> ₹${totalAmount.toFixed(2)}`;
  categoryExpensesList.appendChild(totalDiv);

  if (filteredExpenses.length === 0) {
    categoryExpensesList.innerHTML += "No expenses for this subcategory.";
  } else {
    filteredExpenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.classList.add("expense-item");

      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = `<button onclick="deleteExpense(${expense.id})">Delete</button>`;

      const editButton = document.createElement("div");
      editButton.classList.add("edit-button");
      editButton.innerHTML = `<button onclick="editExpense(${expense.id})">Edit</button>`;

      const expenseInfo = document.createElement("div");
      expenseInfo.classList.add("info");
      expenseInfo.innerHTML = `
        <strong>Date:</strong> ${expense.date}<br>
        <strong>Amount:</strong> ₹${expense.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${expense.comment || "N/A"}<br>
        <strong>Sub Category:</strong> ${expense.subcategory || "N/A"}`;

      expenseItem.appendChild(expenseInfo);
      expenseItem.appendChild(editButton);
      expenseItem.appendChild(deleteButton);

      categoryExpensesList.appendChild(expenseItem);
    });
  }

  categoryExpensesDiv.style.display = "block";
}


// Event listener for the filter button
document
  .getElementById("filterSubcategoryButton")
  .addEventListener("click", filterBySubcategory);


document.addEventListener("DOMContentLoaded", displayTotals);
// Event listener to trigger sub-category update when the main category is changed
document
  .getElementById("category")
  .addEventListener("change", updateSubCategoryOptions);

// Initialize sub-category options on page load
document.addEventListener("DOMContentLoaded", updateSubCategoryOptions);

document.addEventListener("DOMContentLoaded", () => {
  displayEarningTotals();
  displayInvestmentTotals();
  switchTab("expense");
});


//--------------------------------------------------firebase-----------------------------------------------