export interface Transaction {
  id: string;
  name: string;
  amount: number;
  formattedAmount: string;
  date: string;
  timestamp: number;
  category: string;
  type: 'income' | 'expense';
}

export const transactionData: Transaction[] = [
  {
    id: "t1",
    name: "Salary",
    amount: 2450.00,
    formattedAmount: "+2,450.00 €",
    date: "May 5, 2025",
    timestamp: new Date(2025, 4, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t2",
    name: "Grocery Store",
    amount: -42.75,
    formattedAmount: "-42.75 €",
    date: "May 8, 2025",
    timestamp: new Date(2025, 4, 8).getTime(),
    category: "Groceries",
    type: "expense"
  },
  {
    id: "t3",
    name: "Restaurant",
    amount: -68.50,
    formattedAmount: "-68.50 €",
    date: "May 3, 2025",
    timestamp: new Date(2025, 4, 3).getTime(),
    category: "Leisure",
    type: "expense"
  },
  {
    id: "t4",
    name: "Online Shopping",
    amount: -129.99,
    formattedAmount: "-129.99 €",
    date: "May 1, 2025",
    timestamp: new Date(2025, 4, 1).getTime(),
    category: "Shopping",
    type: "expense"
  },
  {
    id: "t5",
    name: "Transport",
    amount: -32.00,
    formattedAmount: "-32.00 €",
    date: "Apr 29, 2025",
    timestamp: new Date(2025, 3, 29).getTime(),
    category: "Transportation",
    type: "expense"
  },
  {
    id: "t6",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Apr 28, 2025",
    timestamp: new Date(2025, 3, 28).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t7",
    name: "Side Project",
    amount: 350.00,
    formattedAmount: "+350.00 €",
    date: "Apr 25, 2025",
    timestamp: new Date(2025, 3, 25).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t8",
    name: "Utilities",
    amount: -120.00,
    formattedAmount: "-120.00 €",
    date: "Apr 22, 2025",
    timestamp: new Date(2025, 3, 22).getTime(),
    category: "Utilities",
    type: "expense"
  },
  {
    id: "t9",
    name: "Gym Membership",
    amount: -45.00,
    formattedAmount: "-45.00 €",
    date: "Apr 20, 2025",
    timestamp: new Date(2025, 3, 20).getTime(),
    category: "Health",
    type: "expense"
  },
  {
    id: "t10",
    name: "Dividend Payment",
    amount: 65.25,
    formattedAmount: "+65.25 €",
    date: "Apr 18, 2025",
    timestamp: new Date(2025, 3, 18).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t11",
    name: "Subscription Services",
    amount: -29.99,
    formattedAmount: "-29.99 €",
    date: "Apr 15, 2025",
    timestamp: new Date(2025, 3, 15).getTime(),
    category: "Entertainment",
    type: "expense"
  },
  {
    id: "t12",
    name: "Bonus",
    amount: 300.00,
    formattedAmount: "+300.00 €",
    date: "Apr 10, 2025",
    timestamp: new Date(2025, 3, 10).getTime(),
    category: "Income",
    type: "income"
  },
  // Adding older data going back 1.2 years
  {
    id: "t13",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Mar 5, 2025",
    timestamp: new Date(2025, 2, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t14",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Mar 1, 2025",
    timestamp: new Date(2025, 2, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t15",
    name: "Groceries",
    amount: -156.75,
    formattedAmount: "-156.75 €",
    date: "Feb 25, 2025",
    timestamp: new Date(2025, 1, 25).getTime(),
    category: "Groceries",
    type: "expense"
  },
  {
    id: "t16",
    name: "Utilities",
    amount: -132.50,
    formattedAmount: "-132.50 €",
    date: "Feb 20, 2025",
    timestamp: new Date(2025, 1, 20).getTime(),
    category: "Utilities",
    type: "expense"
  },
  {
    id: "t17",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Feb 5, 2025",
    timestamp: new Date(2025, 1, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t18",
    name: "Restaurant",
    amount: -87.20,
    formattedAmount: "-87.20 €",
    date: "Jan 28, 2025",
    timestamp: new Date(2025, 0, 28).getTime(),
    category: "Leisure",
    type: "expense"
  },
  {
    id: "t19",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Jan 1, 2025",
    timestamp: new Date(2025, 0, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t20",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Jan 5, 2025",
    timestamp: new Date(2025, 0, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t21",
    name: "Transportation Monthly Pass",
    amount: -75.00,
    formattedAmount: "-75.00 €",
    date: "Dec 28, 2024",
    timestamp: new Date(2024, 11, 28).getTime(),
    category: "Transportation",
    type: "expense"
  },
  {
    id: "t22",
    name: "Holiday Bonus",
    amount: 500.00,
    formattedAmount: "+500.00 €",
    date: "Dec 20, 2024",
    timestamp: new Date(2024, 11, 20).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t23",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Dec 5, 2024",
    timestamp: new Date(2024, 11, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t24",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Dec 1, 2024",
    timestamp: new Date(2024, 11, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t25",
    name: "Shopping",
    amount: -245.30,
    formattedAmount: "-245.30 €",
    date: "Nov 25, 2024",
    timestamp: new Date(2024, 10, 25).getTime(),
    category: "Shopping",
    type: "expense"
  },
  {
    id: "t26",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Nov 5, 2024",
    timestamp: new Date(2024, 10, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t27",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Nov 1, 2024",
    timestamp: new Date(2024, 10, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t28",
    name: "Groceries",
    amount: -142.80,
    formattedAmount: "-142.80 €",
    date: "Oct 28, 2024",
    timestamp: new Date(2024, 9, 28).getTime(),
    category: "Groceries",
    type: "expense"
  },
  {
    id: "t29",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Oct 5, 2024",
    timestamp: new Date(2024, 9, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t30",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Oct 1, 2024",
    timestamp: new Date(2024, 9, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t31",
    name: "Healthcare",
    amount: -120.50,
    formattedAmount: "-120.50 €",
    date: "Sep 25, 2024",
    timestamp: new Date(2024, 8, 25).getTime(),
    category: "Health",
    type: "expense"
  },
  {
    id: "t32",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Sep 5, 2024",
    timestamp: new Date(2024, 8, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t33",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Sep 1, 2024",
    timestamp: new Date(2024, 8, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t34",
    name: "Summer Vacation",
    amount: -750.00,
    formattedAmount: "-750.00 €",
    date: "Aug 15, 2024",
    timestamp: new Date(2024, 7, 15).getTime(),
    category: "Leisure",
    type: "expense"
  },
  {
    id: "t35",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Aug 5, 2024",
    timestamp: new Date(2024, 7, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t36",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Aug 1, 2024",
    timestamp: new Date(2024, 7, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t37",
    name: "Electronics",
    amount: -399.99,
    formattedAmount: "-399.99 €",
    date: "Jul 20, 2024",
    timestamp: new Date(2024, 6, 20).getTime(),
    category: "Shopping",
    type: "expense"
  },
  {
    id: "t38",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Jul 5, 2024",
    timestamp: new Date(2024, 6, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t39",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Jul 1, 2024",
    timestamp: new Date(2024, 6, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t40",
    name: "Birthday Gift",
    amount: -85.00,
    formattedAmount: "-85.00 €",
    date: "Jun 15, 2024",
    timestamp: new Date(2024, 5, 15).getTime(),
    category: "Shopping",
    type: "expense"
  },
  {
    id: "t41",
    name: "Salary",
    amount: 2400.00,
    formattedAmount: "+2,400.00 €",
    date: "Jun 5, 2024",
    timestamp: new Date(2024, 5, 5).getTime(),
    category: "Income",
    type: "income"
  },
  {
    id: "t42",
    name: "Rent",
    amount: -800.00,
    formattedAmount: "-800.00 €",
    date: "Jun 1, 2024",
    timestamp: new Date(2024, 5, 1).getTime(),
    category: "Rent",
    type: "expense"
  },
  {
    id: "t43",
    name: "Work Laptop",
    amount: -1600.00,
    formattedAmount: "-1600.00 €",
    date: "May 10, 2025",
    timestamp: new Date(2025, 5, 10).getTime(),
    category: "Other",
    type: "expense"
  }
];

// Define categories and their classification patterns
export const transactionCategories = {
  "Income": ["salary", "income", "payment", "bonus", "dividend", "project", "freelance", "refund"],
  "Groceries": ["grocery", "supermarket", "food", "market"],
  "Rent": ["rent", "mortgage", "housing"],
  "Utilities": ["utility", "electric", "water", "gas", "internet", "phone"],
  "Transportation": ["transport", "uber", "taxi", "bus", "train", "fuel", "gas station"],
  "Leisure": ["restaurant", "bar", "cinema", "movie", "theater", "concert", "vacation"],
  "Shopping": ["shopping", "amazon", "online", "store", "retail", "gift", "electronics"],
  "Health": ["health", "medical", "doctor", "pharmacy", "gym", "fitness", "healthcare"],
  "Entertainment": ["entertainment", "subscription", "netflix", "spotify", "game"],
  "Other": [] // Default category
};

// Function to automatically classify a transaction based on its name
export function classifyTransaction(transactionName: string): string {
  const nameLower = transactionName.toLowerCase();
  
  // If it's income (positive amount), classify as Income
  if (nameLower.includes("salary") || 
      nameLower.includes("income") || 
      nameLower.includes("dividend") ||
      nameLower.includes("bonus")) {
    return "Income";
  }
  
  // Check against our category patterns
  for (const [category, patterns] of Object.entries(transactionCategories)) {
    for (const pattern of patterns) {
      if (nameLower.includes(pattern)) {
        return category;
      }
    }
  }
  
  // Default category if no match
  return "Other";
}

// Function to automatically create a new transaction with classified category
export function createTransaction(
  name: string, 
  amount: number, 
  date: Date
): Transaction {
  const isIncome = amount > 0;
  
  // Format the amount
  const formattedAmount = `${isIncome ? '+' : ''}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} €`;
  
  // Classify the transaction
  const category = isIncome ? "Income" : classifyTransaction(name);
  
  return {
    id: `t${Date.now()}`,
    name,
    amount: isIncome ? amount : -Math.abs(amount), // Ensure expenses are negative
    formattedAmount,
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: date.getTime(),
    category,
    type: isIncome ? 'income' : 'expense'
  };
}

// Helper function to generate monthly aggregated data for charts
export function generateMonthlyData(months = 12) {
  const currentDate = new Date();
  const data = [];
  
  let runningBalance = 1000; // Starting balance
  
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (months - 1 - i), 1);
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    const yearShort = monthDate.getFullYear().toString().slice(2);
    
    // Generate random income and expense values
    const income = i === months - 1 ? 2850 : Math.round(2300 + Math.random() * 500);
    const expenses = i === months - 1 ? 1600 : Math.round(1200 + Math.random() * 400);
    
    // Update running balance
    runningBalance = runningBalance + income - expenses;
    
    data.push({
      name: `${monthName} ${yearShort}`,
      balance: runningBalance,
      income: income,
      expenses: expenses
    });
  }
  
  return data;
}

// Function to filter transactions by time period
export function filterTransactionsByPeriod(period: string): Transaction[] {
  const now = new Date();
  let cutoffDate: Date;
  
  switch (period) {
    case '1M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case '3M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case '6M':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case '1Y':
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      cutoffDate = new Date(now.setMonth(now.getMonth() - 6)); // Default to 6M
  }
  
  return transactionData.filter(transaction => transaction.timestamp >= cutoffDate.getTime());
}

// Function to aggregate transactions by month for chart display
export function aggregateTransactionsByMonth(transactions: Transaction[]) {
  const aggregated = new Map();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.timestamp);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    if (!aggregated.has(monthYear)) {
      aggregated.set(monthYear, {
        name: monthYear,
        balance: 0,
        income: 0,
        expenses: 0
      });
    }
    
    const monthData = aggregated.get(monthYear);
    
    if (transaction.type === 'income') {
      monthData.income += transaction.amount;
      monthData.balance += transaction.amount;
    } else {
      // For expenses, amount is already negative
      monthData.expenses += Math.abs(transaction.amount);
      monthData.balance += transaction.amount;
    }
  });
  
  // Convert map to array and sort by date
  const result = Array.from(aggregated.values());
  
  // Sort by date (assuming month-yy format)
  result.sort((a, b) => {
    const monthNameA = String(a.name).split(' ')[0];
    const yearA = String(a.name).split(' ')[1];
    const monthNameB = String(b.name).split(' ')[0];
    const yearB = String(b.name).split(' ')[1];
    
    const dateA = new Date(`${monthNameA} 01, 20${yearA}`);
    const dateB = new Date(`${monthNameB} 01, 20${yearB}`);
    
    return dateA.getTime() - dateB.getTime();
  });
  
  // Calculate running balance
  let runningBalance = 1000; // Starting balance
  result.forEach(item => {
    runningBalance += (item.income - item.expenses);
    item.balance = runningBalance;
  });
  
  return result;
}

// Function to aggregate transactions by category and month
export function aggregateTransactionsByCategory(transactions: Transaction[]) {
  // First, get all unique categories from the transactions
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  // Create a map to store data by month
  const monthlyDataMap = new Map<string, Record<string, number>>();
  
  // Process each transaction
  transactions.forEach(transaction => {
    const date = new Date(transaction.timestamp);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    // Initialize the month entry if it doesn't exist
    if (!monthlyDataMap.has(monthYear)) {
      const monthData: Record<string, number | string> = { name: monthYear };
      categories.forEach(cat => monthData[cat] = 0);
      monthlyDataMap.set(monthYear, monthData as Record<string, number>);
    }
    
    // Get the month data and update the category amount
    const monthData = monthlyDataMap.get(monthYear)!;
    
    // Skip entries that aren't expenses for category tracking (except Income)
    if (transaction.type === 'expense' || transaction.category === 'Income') {
      // For expenses, we store the absolute value to make charting easier
      const amountToAdd = transaction.type === 'expense' ? 
        Math.abs(transaction.amount) : transaction.amount;
      
      monthData[transaction.category] = 
        (monthData[transaction.category] || 0) + amountToAdd;
    }
  });
  
  // Convert map to array and sort by date
  const result = Array.from(monthlyDataMap.values());
  
  // Sort by date (assuming month-yy format)
  result.sort((a, b) => {
    const monthNameA = String(a.name).split(' ')[0];
    const yearA = String(a.name).split(' ')[1];
    const monthNameB = String(b.name).split(' ')[0];
    const yearB = String(b.name).split(' ')[1];
    
    const dateA = new Date(`${monthNameA} 01, 20${yearA}`);
    const dateB = new Date(`${monthNameB} 01, 20${yearB}`);
    
    return dateA.getTime() - dateB.getTime();
  });
  
  return result;
}

export const monthlyData = generateMonthlyData(12);

// Add this function to prepare Sankey diagram data
export function prepareSankeyData(transactions: Transaction[], period: string = "6M") {
  // Filter transactions based on the selected period
  const filteredTransactions = (() => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (period) {
      case '1M':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3M':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6M':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1Y':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6)); // Default to 6M
    }
    
    return transactions.filter(t => t.timestamp >= cutoffDate.getTime());
  })();
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  filteredTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount);
    });

  // Create nodes array - first node is income, followed by expense categories
  const nodes = [
    { name: "Income" },
    ...Object.keys(expensesByCategory).map(category => ({ name: category }))
  ];

  // Create a mapping of category names to their indices in the nodes array
  const nodeIndices: Record<string, number> = {};
  nodes.forEach((node, index) => {
    nodeIndices[node.name] = index;
  });

  // Create links array with numeric indices instead of string names
  const links = Object.entries(expensesByCategory).map(([category, value]) => ({
    source: nodeIndices["Income"],
    target: nodeIndices[category],
    value: value
  }));

  return { nodes, links };
}
