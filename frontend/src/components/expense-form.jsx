"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in the format yyyy-mm-dd" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
});


export function ExpenseForm({ onAddExpense, categories }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "",
      date: new Date().toISOString().split('T')[0], // Convert the date to yyyy-mm-dd format
      description: "",
    },
  });
  

  function onSubmit(values) {
    onAddExpense(values);
    form.reset({
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-semibold text-black pb-2">
          Add New Expense
        </h2>
      </div>
      <div className="card-content">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Field */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="amount" className="text-gray-700 font-medium pb-1 sm:w-32">
              Amount
            </label>
            <div className="flex-1">
              <input
                id="amount"
                placeholder="0.00"
                {...form.register("amount")}
                type="number"
                step="0.01"
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                  form.formState.errors.amount
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              />
              {form.formState.errors.amount && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.amount.message}
                </span>
              )}
            </div>
          </div>

          {/* Category Field */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="category" className="text-gray-700 font-medium pb-1 sm:w-32">
              Category
            </label>
            <div className="flex-1">
              <select
                id="category"
                {...form.register("category")}
                className={`w-full bg-transparent text-slate-700 text-sm border rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                  form.formState.errors.category
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              >
                <option value="" className="text-slate-400">
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name} className="text-slate-700">
                    {category.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.category && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.category.message}
                </span>
              )}
            </div>
          </div>

          {/* Date Field */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="date" className="text-gray-700 font-medium pb-1 sm:w-32">
              Date
            </label>
            <div className="flex-1">
              <input
                id="date"
                type="date"
                {...form.register("date")}
                className={`w-full bg-transparent text-slate-700 text-sm border rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                  form.formState.errors.date
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              />
              {form.formState.errors.date && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.date.message}
                </span>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="description" className="text-gray-700 font-medium pb-1 sm:w-32">
              Description
            </label>
            <div className="flex-1">
              <textarea
                id="description"
                placeholder="What was this expense for?"
                {...form.register("description")}
                className={`w-full bg-transparent text-slate-700 text-sm border rounded-md px-3 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow resize-none ${
                  form.formState.errors.description
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
                rows="4"
              />
              {form.formState.errors.description && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-600 transition-all duration-200"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
