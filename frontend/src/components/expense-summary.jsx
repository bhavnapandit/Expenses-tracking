"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function ExpenseSummary({ expenses, categories }) {
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map()

    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0
      categoryMap.set(expense.category, currentAmount + expense.amount)
    })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name)
        return {
          name,
          value,
          color: category?.color.replace("bg-", "") || "gray-500",
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [expenses, categories])

  // Get tailwind color as hex
  const getTailwindColor = (colorClass) => {
    // This is a simplified mapping of Tailwind colors to hex values
    const colorMap = {
      "red-500": "#ef4444",
      "blue-500": "#3b82f6",
      "yellow-500": "#eab308",
      "green-500": "#22c55e",
      "purple-500": "#a855f7",
      "gray-500": "#6b7280",
    }
    return colorMap[colorClass] || "#6b7280"
  }

  return (
    <div className="space-y-6">
      {/* Total Expenses Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
        <div className="text-center mt-4">
          <p className="text-lg text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
        </div>

        {/* Pie Chart */}
        {expenses.length > 0 && (
          <div className="mt-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTailwindColor(entry.color)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                  itemStyle={{
                    color: "#333",
                    fontWeight: "600",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Expenses by Category */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">Expenses by Category</h2>
        <div className="space-y-4 mt-4">
          {expensesByCategory.length > 0 ? (
            expensesByCategory.map((category) => (
              <div key={category.name} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full`}
                    style={{ backgroundColor: getTailwindColor(category.color) }}
                  ></div>
                  <span className="text-lg text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">${category.value.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">
                    ({((category.value / totalExpenses) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
