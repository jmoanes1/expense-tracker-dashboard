import { TransactionsView } from '../components/transactions/TransactionsView'
import { useTransactionManager } from '../hooks/useTransactionManager'

export function TransactionsPage() {
  const manager = useTransactionManager({ pageSize: 10 })

  return (
    <TransactionsView
      manager={manager}
      title="All Transactions"
      subtitle="Every income and expense record in one place. Search by name, filter by category, date, or payment method."
    />
  )
}
