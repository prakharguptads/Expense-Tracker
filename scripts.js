function saveExpense() {
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const commentInput = document.getElementById('comment');

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;

  if (amount === '' || category === '' || date === '') {
    alert('Please fill in all fields.');
    return;
  }

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  const expense = {
    id: Date.now(),
    amount: parseFloat(amount),
    category,
    date,
    comment
  };

  expenses.push(expense);

  localStorage.setItem('expenses', JSON.stringify(expenses));

  amountInput.value = '';
  categoryInput.selectedIndex = 0;
  dateInput.value = '';
  commentInput.value = '';

  alert('Expense saved successfully.');

  displayTotals();
  showCategoryExpenses(category);
}

function displayTotals() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categoryTotals = {};
  let totalExpense = 0;

  expenses.forEach(expense => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
    totalExpense += expense.amount;
  });

  const totalsDiv = document.getElementById('totals');
  totalsDiv.innerHTML = '';

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement('p');
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = 'pointer';
    totalElement.onclick = () => showCategoryExpenses(category);
    totalsDiv.appendChild(totalElement);
  }

  const totalExpenseElement = document.createElement('p');
  totalExpenseElement.textContent = `Total Expense: ₹${totalExpense.toFixed(2)}`;
  totalExpenseElement.style.fontWeight = 'bold';
  totalsDiv.appendChild(totalExpenseElement);
}

function showCategoryExpenses(category) {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categoryExpensesDiv = document.getElementById('categoryExpenses');
  const selectedCategorySpan = document.getElementById('selectedCategory');
  const categoryExpensesList = document.getElementById('categoryExpensesList');

  const categoryExpenses = expenses.filter(expense => expense.category === category);

  selectedCategorySpan.textContent = category;
  categoryExpensesList.innerHTML = '';

  if (categoryExpenses.length === 0) {
    categoryExpensesList.innerHTML = 'No expenses for this category.';
  } else {
    categoryExpenses.forEach(expense => {
      const expenseItem = document.createElement('div');
      expenseItem.classList.add('expense-item');

      const deleteButton = document.createElement('div');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = `<button onclick="deleteExpense(${expense.id})">Delete</button>`;

      const editButton = document.createElement('div');
      editButton.classList.add('edit-button');
      editButton.innerHTML = `<button onclick="editExpense(${expense.id})">Edit</button>`;

      const expenseInfo = document.createElement('div');
      expenseInfo.classList.add('info');
      expenseInfo.innerHTML = `
        <strong>Date:</strong> ${expense.date}<br>
        <strong>Amount:</strong> ₹${expense.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${expense.comment || 'N/A'}`;

      expenseItem.appendChild(expenseInfo);
      expenseItem.appendChild(editButton);
      expenseItem.appendChild(deleteButton);

      categoryExpensesList.appendChild(expenseItem);
    });
  }

  categoryExpensesDiv.style.display = 'block';
}

function deleteExpense(id) {
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  displayTotals();
  const selectedCategory = document.getElementById('selectedCategory').textContent;
  showCategoryExpenses(selectedCategory);
}

function editExpense(id) {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expense = expenses.find(expense => expense.id === id);

  if (expense) {
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    document.getElementById('comment').value = expense.comment;

    window.editingId = id;

    document.querySelector('.button-group button').textContent = 'Update Expense';
    document.querySelector('.button-group button').onclick = updateExpense;
  }
}

function updateExpense() {
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const commentInput = document.getElementById('comment');

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;

  if (amount === '' || category === '' || date === '') {
    alert('Please fill in all fields.');
    return;
  }

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expenseIndex = expenses.findIndex(expense => expense.id === window.editingId);

  if (expenseIndex !== -1) {
    expenses[expenseIndex] = {
      id: window.editingId,
      amount: parseFloat(amount),
      category,
      date,
      comment
    };

    localStorage.setItem('expenses', JSON.stringify(expenses));

    alert('Expense updated successfully.');

    amountInput.value = '';
    categoryInput.selectedIndex = 0;
    dateInput.value = '';
    commentInput.value = '';

    displayTotals();
    showCategoryExpenses(category);

    document.querySelector('.button-group button').textContent = 'Save';
    document.querySelector('.button-group button').onclick = saveExpense;
    window.editingId = null;
  }
}

function downloadExpenses() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  if (expenses.length === 0) {
    alert('No expenses to download.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(expenses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  XLSX.writeFile(workbook, 'expenses.xlsx');
}

function downloadMonthExpenses() {
  const yearInput = document.getElementById('year');
  const monthInput = document.getElementById('month');
  const selectedYear = yearInput.value;
  const selectedMonth = monthInput.value.padStart(2, '0');

  if (!selectedYear || !selectedMonth) {
    alert('Please select both year and month.');
    return;
  }

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const filteredExpenses = expenses.filter(expense => 
    expense.date.startsWith(`${selectedYear}-${selectedMonth}`)
  );

  if (filteredExpenses.length === 0) {
    alert('No expenses for the selected month.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Expenses');
  XLSX.writeFile(workbook, `expenses_${selectedYear}_${selectedMonth}.xlsx`);
}

function filterExpenses() {
  const yearInput = document.getElementById('year');
  const monthInput = document.getElementById('month');
  const selectedYear = yearInput.value;
  const selectedMonth = monthInput.value.padStart(2, '0');

  if (!selectedYear || !selectedMonth) {
    alert('Please select both year and month.');
    return;
  }

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const filteredExpenses = expenses.filter(expense => 
    expense.date.startsWith(`${selectedYear}-${selectedMonth}`)
  );

  if (filteredExpenses.length === 0) {
    alert('No expenses for the selected month.');
    return;
  }

  const categoryTotals = {};
  filteredExpenses.forEach(expense => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  const totalsDiv = document.getElementById('totals');
  totalsDiv.innerHTML = '';

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement('p');
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = 'pointer';
    totalElement.onclick = () => showCategoryExpenses(category);
    totalsDiv.appendChild(totalElement);
  }
}

function clearFilter() {
  document.getElementById('year').value = '';
  document.getElementById('month').value = '';
  displayTotals();
  document.getElementById('categoryExpenses').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', displayTotals);
