import React, { useEffect, useState } from "react";
import { Book } from "../types";
import { X, Save, Image as ImageIcon, Tag, User, BookOpen, Hash, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<Book, "id" | "available">) => void;
  initialData?: Book;
}

export default function BookModal({ isOpen, onClose, onSubmit, initialData }: BookModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    coverUrl: "",
    audience: "student" as "student" | "employee" | "both",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        isbn: initialData.isbn,
        category: initialData.category,
        coverUrl: initialData.coverUrl,
        audience: initialData.audience || "student",
      });
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        coverUrl: "",
        audience: "student",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-serephina-light-pink/20">
              <h2 className="text-xl font-bold text-serephina-navy">
                {initialData ? "Edit Item Details" : "Add New Item to Catalog"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-serephina-light-pink rounded-full transition-colors text-serephina-pink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-serephina-navy ml-0.5">
                    Item Title
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all shadow-sm"
                      placeholder="e.g. The Hobbit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-serephina-navy ml-0.5">
                      Author
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all shadow-sm"
                      placeholder="J.R.R. Tolkien"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-serephina-navy ml-0.5">
                      Category
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all shadow-sm"
                      placeholder="Fantasy"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-serephina-navy ml-0.5">
                    ISBN-13
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all shadow-sm"
                    placeholder="978-0261103252"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-serephina-navy ml-0.5">
                    Image Link
                  </label>
                  <input
                    required
                    type="url"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all shadow-sm"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-serephina-navy ml-0.5">
                    Target User Access
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-serephina-pink focus:border-serephina-pink transition-all cursor-pointer shadow-sm"
                  >
                    <option value="student">Student</option>
                    <option value="employee">Employee</option>
                    <option value="both">Both (Public)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium hover:bg-slate-50 transition-all text-serephina-navy"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-serephina-pink hover:bg-serephina-navy text-white rounded shadow-sm text-sm font-bold border border-serephina-pink transition-all flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {initialData ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
