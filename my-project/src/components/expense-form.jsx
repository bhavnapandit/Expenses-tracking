"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.date(),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
})

export function ExpenseForm({ onAddExpense, categories }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
    },
  })

  function onSubmit(values) {
    onAddExpense(values)
    form.reset({
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-semibold text-black pb-2">Add New Expense</h2>
      </div>
      <div className="card-content">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Amount Field */}
          <div className="flex flex-col">
            <label htmlFor="amount" className="text-gray-700 font-medium pb-1">Amount</label>
            <input
              id="amount"
              placeholder="0.00"
              {...form.register("amount")}
              type="number"
              step="0.01"
              className={`p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${form.formState.errors.amount ? "border-red-500" : "border-gray-300"}`}
            />
            {form.formState.errors.amount && (
              <span className="text-red-500 text-sm">{form.formState.errors.amount.message}</span>
            )}
          </div>

          {/* Category Field */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-gray-700 font-medium pb-1">Category</label>
            <select
              id="category"
              {...form.register("category")}
              className={`p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${form.formState.errors.category ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <span className="text-red-500 text-sm">{form.formState.errors.category.message}</span>
            )}
          </div>

          {/* Date Field */}
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-700 font-medium pb-1">Date</label>
            <input
              id="date"
              type="date"
              {...form.register("date")}
              className={`p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${form.formState.errors.date ? "border-red-500" : "border-gray-300"}`}
            />
            {form.formState.errors.date && (
              <span className="text-red-500 text-sm">{form.formState.errors.date.message}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700 font-medium pb-1">Description</label>
            <textarea
              id="description"
              placeholder="What was this expense for?"
              {...form.register("description")}
              className={`p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${form.formState.errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {form.formState.errors.description && (
              <span className="text-red-500 text-sm">{form.formState.errors.description.message}</span>
            )}
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
  )
}
