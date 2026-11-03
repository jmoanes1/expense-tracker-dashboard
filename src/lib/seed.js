import { monthOffset, today, uid } from './format'

/**
 * Sample data is generated relative to today so the dashboard always shows
 * a full range of months. Each row: [type, name, amount, category, monthOffset, day, method]
 */
const ROWS = [
  ['income', 'Monthly Salary', 5200, 'Salary', 0, 1, 'Bank Transfer'],
  ['income', 'Freelance Design Project', 850, 'Freelance', 0, 12, 'UPI'],
  ['income', 'Dividend Payout', 180, 'Investment', 0, 18, 'Bank Transfer'],
  ['expense', 'Weekly Groceries', 132.4, 'Food', 0, 4, 'Credit Card'],
  ['expense', 'Apartment Rent', 1450, 'Bills', 0, 3, 'Bank Transfer'],
  ['expense', 'Electricity Bill', 96.2, 'Bills', 0, 9, 'Debit Card'],
  ['expense', 'Metro Card Top-up', 45, 'Transportation', 0, 6, 'Wallet'],
  ['expense', 'Dinner with Friends', 78.5, 'Food', 0, 8, 'Credit Card'],
  ['expense', 'Streaming Bundle', 24.99, 'Entertainment', 0, 11, 'Credit Card'],
  ['expense', 'Pharmacy — Vitamins', 31.6, 'Healthcare', 0, 14, 'Debit Card'],

  ['income', 'Monthly Salary', 5200, 'Salary', -1, 1, 'Bank Transfer'],
  ['income', 'Consulting Fee', 600, 'Freelance', -1, 21, 'Bank Transfer'],
  ['expense', 'Apartment Rent', 1450, 'Bills', -1, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 268.75, 'Food', -1, 7, 'Credit Card'],
  ['expense', 'Fuel', 88.3, 'Transportation', -1, 10, 'Credit Card'],
  ['expense', 'New Running Shoes', 129.99, 'Shopping', -1, 15, 'Debit Card'],
  ['expense', 'Internet & Phone', 79.99, 'Bills', -1, 19, 'Credit Card'],
  ['expense', 'Concert Tickets', 145, 'Entertainment', -1, 22, 'Credit Card'],
  ['expense', 'Dentist Check-up', 165, 'Healthcare', -1, 25, 'Debit Card'],

  ['income', 'Monthly Salary', 5200, 'Salary', -2, 1, 'Bank Transfer'],
  ['income', 'Stock Sale Profit', 940, 'Investment', -2, 24, 'Bank Transfer'],
  ['expense', 'Apartment Rent', 1450, 'Bills', -2, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 241.1, 'Food', -2, 6, 'Credit Card'],
  ['expense', 'Online Shopping Spree', 386.45, 'Shopping', -2, 13, 'Credit Card'],
  ['expense', 'Taxi Rides', 62.8, 'Transportation', -2, 17, 'Wallet'],
  ['expense', 'Gym Membership', 55, 'Healthcare', -2, 2, 'Debit Card'],
  ['expense', 'Birthday Gift', 75, 'Shopping', -2, 20, 'Cash'],
  ['expense', 'Weekend Trip', 320.6, 'Entertainment', -2, 27, 'Credit Card'],

  ['income', 'Monthly Salary', 5000, 'Salary', -3, 1, 'Bank Transfer'],
  ['income', 'Cash Gift', 300, 'Gift', -3, 14, 'Cash'],
  ['expense', 'Apartment Rent', 1450, 'Bills', -3, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 255.35, 'Food', -3, 8, 'Credit Card'],
  ['expense', 'Car Service', 210, 'Transportation', -3, 11, 'Debit Card'],
  ['expense', 'Online Course', 149, 'Education', -3, 16, 'Credit Card'],
  ['expense', 'Restaurant Weekend', 96.2, 'Food', -3, 22, 'Credit Card'],

  ['income', 'Monthly Salary', 5000, 'Salary', -4, 1, 'Bank Transfer'],
  ['income', 'Freelance Website Build', 1250, 'Freelance', -4, 19, 'UPI'],
  ['expense', 'Apartment Rent', 1450, 'Bills', -4, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 232.8, 'Food', -4, 5, 'Credit Card'],
  ['expense', 'Winter Clothing', 289.5, 'Shopping', -4, 12, 'Credit Card'],
  ['expense', 'Bus Pass', 78, 'Transportation', -4, 4, 'Cash'],
  ['expense', 'Movie Night', 42.3, 'Entertainment', -4, 21, 'Wallet'],
  ['expense', 'Doctor Visit', 120, 'Healthcare', -4, 26, 'Debit Card'],

  ['income', 'Monthly Salary', 5000, 'Salary', -5, 1, 'Bank Transfer'],
  ['expense', 'Apartment Rent', 1400, 'Bills', -5, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 248.65, 'Food', -5, 9, 'Credit Card'],
  ['expense', 'Headphones', 179.99, 'Shopping', -5, 15, 'Credit Card'],
  ['expense', 'Train Tickets', 64.5, 'Transportation', -5, 18, 'Debit Card'],
  ['expense', 'Water & Waste Bill', 71.4, 'Bills', -5, 23, 'Bank Transfer'],

  ['income', 'Monthly Salary', 5000, 'Salary', -6, 1, 'Bank Transfer'],
  ['income', 'Business Side Income', 480, 'Business', -6, 27, 'Bank Transfer'],
  ['expense', 'Apartment Rent', 1400, 'Bills', -6, 3, 'Bank Transfer'],
  ['expense', 'Groceries', 219.4, 'Food', -6, 7, 'Credit Card'],
  ['expense', 'Textbooks', 134.25, 'Education', -6, 13, 'Debit Card'],
  ['expense', 'Eating Out', 156.8, 'Food', -6, 20, 'Credit Card'],
]

export function buildSeedTransactions() {
  const base = today()
  const currentDay = Number(base.slice(8, 10))
  return ROWS.map(([type, name, amount, category, offset, day, method]) => {
    // keep the current month free of future-dated records
    const monthShift = offset === 0 && day > currentDay ? offset - 1 : offset
    return {
      id: uid() + offset,
      type,
      name,
      amount,
      category,
      date: monthOffset(base, monthShift).slice(0, 8) + String(day).padStart(2, '0'),
      method,
      note: '',
      createdAt: monthOffset(base, monthShift),
    }
  })
}
