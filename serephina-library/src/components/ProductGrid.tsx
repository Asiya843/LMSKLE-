import React from "react";
import { Book, UserRole } from "../types";
import { ShoppingBag, Star, Heart, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface ProductGridProps {
  books: Book[];
  role: UserRole;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  canModify: boolean;
}

export default function ProductGrid({ books, role, onEdit, onDelete, canModify }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <motion.div
          key={book.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group flex flex-col bg-white border border-slate-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {canModify && (
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(book);
                  }}
                  className="bg-white text-slate-900 p-2 rounded-full shadow-lg hover:bg-serephina-pink hover:text-white transition-all transform hover:scale-110"
                  title="Update Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-serephina-pink transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            {!book.available && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white/90 text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Sold Out
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-full bg-serephina-pink text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 hover:bg-serephina-navy transition-colors">
                <ShoppingBag className="w-3 h-3" />
                Add to Bag
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] group-hover:text-serephina-pink transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-vintage-text-secondary mt-1">{book.author}</p>
            
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-serephina-pink text-serephina-pink" />
                ))}
              </div>
              <span className="text-[10px] text-vintage-text-muted">(4.8)</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-900">₹{Math.floor((book.id.charCodeAt(0) || 0) * 5) + 399}</span>
              <span className="text-[10px] text-vintage-text-muted line-through">₹{Math.floor((book.id.charCodeAt(0) || 0) * 8) + 899}</span>
              <span className="text-[10px] font-bold text-emerald-600">40% Off</span>
            </div>

            {canModify && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                <button
                  onClick={() => onEdit(book)}
                  className="w-full py-2 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-serephina-pink transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  Edit Item
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="w-full py-2 bg-white text-slate-400 border border-slate-100 rounded text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                >
                  Remove Permanently
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
