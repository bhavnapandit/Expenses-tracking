"use client";

import { format } from "date-fns";
import { ArrowDownAZ, ArrowUpAZ, Trash } from "lucide-react";
import { useState } from "react";

export function ExpenseList({ expenses, categories, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description &&
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const aDate = new Date(a.date); // Ensure it's a Date object
    const bDate = new Date(b.date); // Ensure it's a Date object

    if (sortField === "date") {
      return sortOrder === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    } else if (sortField === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === "category") {
      return sortOrder === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get category color
  const getCategoryColor = (categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "bg-gray-500";
  };

  return (
    <div className="card">
      <div className="card-header flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your Expenses</h2>
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:gap-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              placeholder="Search expenses..."
              className="pl-8 pr-4 py-2 rounded-md shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></div>
                  <span>{category.name}</span>
                </div>
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-content mt-6">
        {sortedExpenses.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <button
                      className="flex items-center gap-1 text-gray-700 font-medium"
                      onClick={() => toggleSort("date")}
                    >
                      Date
                      {sortField === "date" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpAZ className="h-4 w-4" />
                        ) : (
                          <ArrowDownAZ className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      className="flex items-center gap-1 text-gray-700 font-medium"
                      onClick={() => toggleSort("category")}
                    >
                      Category
                      {sortField === "category" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpAZ className="h-4 w-4" />
                        ) : (
                          <ArrowDownAZ className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">
                    <button
                      className="flex items-center gap-1 text-gray-700 font-medium"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount
                      {sortField === "amount" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpAZ className="h-4 w-4" />
                        ) : (
                          <ArrowDownAZ className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-2 w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">
                      {format(expense.date, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getCategoryColor(
                            expense.category
                          )}`}
                        ></div>
                        <span>{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{expense.description}</td>
                    <td className="px-4 py-2 text-right">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-all duration-200"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400">
              {expenses.length > 0
                ? "Try changing your search or filter criteria"
                : "Add your first expense to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
