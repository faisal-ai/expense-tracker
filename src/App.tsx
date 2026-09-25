import { useState, useEffect, useCallback } from 'react';
import { Transaction, FilterType } from './types';
import { sampleTransactions } from './data';
import { calculateMonthlySummary, getMonthKey, exportToCSV } from './utils';
import MonthlySummary from './components/MonthlySummary';
import TransactionList from './components/TransactionList';
import AddEntryModal from './components/AddEntryModal';

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem('budget-workbench-transactions');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load transactions', e);
  }
  return sampleTransactions;
}

function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem('budget-workbench-transactions', JSON.stringify(transactions));
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const summary = calculateMonthlySummary(transactions, currentMonth);

  const filteredTransactions = transactions
    .filter(t => getMonthKey(t.date) === currentMonth)
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleAddTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setIsModalOpen(false);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [year, month] = currentMonth.split('-').map(Number);
  const monthLabel = `${monthNames[month - 1]} ${year}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📒</span>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Budget Workbench</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredTransactions)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Entry</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 pb-24">
        {/* Monthly Summary */}
        <MonthlySummary
          monthLabel={monthLabel}
          entryCount={summary.count}
          income={summary.income}
          expenses={summary.expenses}
          balance={summary.balance}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Filters */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transactions {filteredTransactions.length}
          </h2>
          <button
            onClick={() => exportToCSV(filteredTransactions)}
            className="sm:hidden flex items-center gap-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['all', 'expense', 'income'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                filter === f
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onDelete={handleDeleteTransaction}
        />
      </main>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <AddEntryModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTransaction}
          defaultDate={currentMonth + '-' + String(new Date().getDate()).padStart(2, '0')}
        />
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 z-50"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
