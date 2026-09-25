import { formatCurrency } from '../utils';

interface MonthlySummaryProps {
  monthLabel: string;
  entryCount: number;
  income: number;
  expenses: number;
  balance: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthlySummary({
  monthLabel,
  entryCount,
  income,
  expenses,
  balance,
  onPrevMonth,
  onNextMonth,
}: MonthlySummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{monthLabel}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{entryCount} entries</p>
        </div>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700">
        <div className="px-4 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Income</p>
          <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
            ¥{formatCurrency(income)}
          </p>
        </div>
        <div className="px-4 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expenses</p>
          <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400">
            ¥{formatCurrency(expenses)}
          </p>
        </div>
        <div className="px-4 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance</p>
          <p className={`text-sm sm:text-base font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            ¥{formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
