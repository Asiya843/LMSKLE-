import React from "react";
import { Book, UserRole } from "../types";
import { Edit2, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface BookTableProps {
  books: Book[];
  role: UserRole;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  selectedCategory: string;
}

export default function BookTable({ books, role, onEdit, onDelete, selectedCategory }: BookTableProps) {
  const canModify = role === "employee" || role === "admin";

  const categories = selectedCategory === "All" 
    ? Array.from(new Set(books.map((b) => b.category)))
    : [selectedCategory];

  return (
    <div className="flex flex-col min-h-0">
      {/* Search Result info */}
      <div className="flex items-center justify-between mb-4 px-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-sm font-medium text-serephina-navy">
            1-{books.length} of {books.length} results for <span className="text-serephina-pink font-bold font-sans">"{selectedCategory === "All" ? "Main Collection" : selectedCategory}"</span>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-serephina-navy">Sort by:</span>
          <select className="bg-slate-100 border border-slate-300 rounded text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-serephina-pink font-sans text-serephina-navy">
            <option>Featured</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      <motion.div 
        layout
        className="bg-white border border-slate-200 shadow-sm flex flex-col rounded-sm"
      >
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-sm font-bold text-serephina-navy">
                <th className="px-6 py-3">Book Details</th>
                <th className="px-4 py-3">Identifier</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Availability status</th>
                {canModify && <th className="px-6 py-3 text-right">Settings</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => {
                const categoryBooks = books.filter(b => b.category === cat);
                if (categoryBooks.length === 0) return null;

                return (
                  <React.Fragment key={cat}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {categoryBooks.map((book) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={book.id}
                          className="hover:bg-serephina-light-pink/30 transition-colors group"
                        >
                          <td className="px-6 py-6 min-w-[400px]">
                            <div className="flex items-start gap-6">
                              <div className="w-32 h-44 bg-slate-50 shrink-0 shadow-sm border border-slate-100 p-1 flex items-center justify-center">
                                <img src={book.coverUrl} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div className="flex flex-col gap-1.5 py-1">
                                <h3 className="text-lg font-bold text-black cursor-pointer line-clamp-2 leading-snug group-hover:text-serephina-pink transition-colors">
                                  {book.title}
                                </h3>
                                <p className="text-sm text-serephina-navy">by <span className="text-serephina-pink hover:underline cursor-pointer">{book.author}</span></p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div key={i} className="text-serephina-pink text-xs">★</div>
                                  ))}
                                  <span className="text-xs text-serephina-pink ml-1 font-medium hover:underline cursor-pointer">4.8 (240)</span>
                                </div>
                                <div className="mt-3 flex flex-col gap-1">
                                  <div className="text-xs font-bold text-black">Paperback</div>
                                  <div className="text-xl font-bold text-black">$14.99 <span className="text-sm font-normal text-slate-500 line-through">$19.99</span></div>
                                  <div className="text-xs font-medium text-serephina-navy italic">Get it as soon as Tomorrow, May 13</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-8 align-top">
                            <span className="text-sm font-mono text-serephina-navy bg-slate-50 px-2 py-1 rounded border border-slate-100">{book.isbn}</span>
                          </td>
                          <td className="px-4 py-8 align-top">
                            <span className="text-xs font-bold text-serephina-pink bg-serephina-pink/10 px-3 py-1 rounded-full border border-serephina-pink/20">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-4 py-8 align-top">
                            <div className="flex flex-col gap-1">
                              <div className={cn(
                                "text-sm font-bold",
                                book.available ? "text-emerald-700" : "text-amber-700 font-normal"
                              )}>
                                {book.available ? "In Stock." : "Temporarily Out of Stock."}
                              </div>
                              <div className="text-xs text-serephina-navy mt-1">Ships from and sold by Serephina.</div>
                            </div>
                          </td>
                          {canModify && (
                            <td className="px-6 py-8 align-top text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => onEdit(book)}
                                  className="w-20 py-1.5 bg-serephina-pink hover:bg-serephina-navy text-white rounded shadow-sm text-xs font-bold transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => onDelete(book.id)}
                                  className="w-20 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded shadow-sm text-xs font-bold border border-slate-300 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          
          {books.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No results for your query</h3>
              <p className="text-sm text-slate-500 max-w-xs">Try checking your spelling or use more general terms</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-200 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded shadow-sm hover:bg-white bg-slate-100 disabled:opacity-50 transition-all" disabled>
              <span>Previous</span>
            </button>
            <div className="flex gap-4">
              <button className="text-serephina-pink underline">1</button>
              <button className="hover:text-serephina-pink transition-colors">2</button>
              <button className="hover:text-serephina-pink transition-colors">3</button>
              <span>...</span>
              <button className="hover:text-serephina-pink transition-colors">10</button>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded shadow-sm hover:bg-white bg-slate-100 transition-all">
              <span>Next</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Results are based on your current library access level.</div>
        </div>
      </motion.div>
    </div>
  );
}
