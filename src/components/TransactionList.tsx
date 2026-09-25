import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useState } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [swipedId, setSwipedId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-3 block">📭</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Add a new entry to get started</p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    if (!grouped[t.date]) grouped[t.date] = [];
    grouped[t.date].push(t);
  });

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Transaction items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50">
            {items.map(t => (
              <div
                key={t.id}
                className="relative"
                onTouchStart={() => setSwipedId(t.id)}
                onMouseEnter={() => setSwipedId(t.id)}
                onMouseLeave={() => setSwipedId(null)}
              >
                <div className="flex items-center px-4 py-3 gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    t.type === 'income'
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : 'bg-red-50 dark:bg-red-900/30'
                  }`}>
                    {t.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.category} · {t.type === 'income' ? 'Income' : 'Expense'}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${
                      t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                    </p>
                  </div>

                  {/* Delete button (visible on hover/tap) */}
                  {swipedId === t.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this transaction?')) {
                          onDelete(t.id);
                        }
                        setSwipedId(null);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
