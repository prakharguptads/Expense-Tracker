function saveExpense() {
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const commentInput = document.getElementById('comment');
  
    const amount = amountInput.value;
    const category = categoryInput.value;
    const comment = commentInput.value;
  
    if (!amount || !category) {
      alert('Please enter both amount and select a category.');
      return;
    }
  
    // Get existing expenses from local storage or initialize an empty array
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  
    // Add the new expense to the array
    expenses.push({ amount: parseFloat(amount), category, comment });
  
    // Save the updated expenses array to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
  
    // Reset the input fields
    amountInput.value = '';
    categoryInput.selectedIndex = 0;
    commentInput.value = '';
  
    alert('Expense saved successfully.');
  
    // Update the totals display and category-wise expenses
    displayTotals();
    showCategoryExpenses(category);
  }
  
  function displayTotals() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const categoryTotals = {};
  
    // Calculate the totals for each category
    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });
  
    // Display the totals on the page
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
  
  function showCategoryExpenses(category) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const categoryExpensesDiv = document.getElementById('categoryExpenses');
    const selectedCategorySpan = document.getElementById('selectedCategory');
    const categoryExpensesList = document.getElementById('categoryExpensesList');
  
    // Filter expenses for the selected category
    const categoryExpenses = expenses.filter((expense) => expense.category === category);
  
    // Display the category expenses
    selectedCategorySpan.textContent = category;
    categoryExpensesList.innerHTML = '';
  
    if (categoryExpenses.length === 0) {
      categoryExpensesList.innerHTML = 'No expenses for this category.';
    } else {
      categoryExpenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');
  
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = `<button onclick="deleteExpense(${expenses.indexOf(expense)})">Delete</button>`;
  
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('info');
        expenseInfo.innerHTML = `
          <strong>Amount:</strong> ₹${expense.amount.toFixed(2)}<br>
          <strong>Comment:</strong> ${expense.comment || 'N/A'}`;
  
        expenseItem.appendChild(expenseInfo);
        expenseItem.appendChild(deleteButton);
  
        categoryExpensesList.appendChild(expenseItem);
      });
    }
  
    categoryExpensesDiv.style.display = 'block';
  }
  
  function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (index >= 0 && index < expenses.length) {
      expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      displayTotals();
      const selectedCategory = document.getElementById('selectedCategory').textContent;
      showCategoryExpenses(selectedCategory);
    }
  }
  
  // Initial display of totals when the page loads
  displayTotals();
  