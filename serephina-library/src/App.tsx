import { useEffect, useState } from "react";
import { Book, UserRole } from "./types";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import BookModal from "./components/BookModal";
import { Plus, Search, User, ShieldCheck, Briefcase, HelpCircle, ShoppingBag, ChevronRight, Heart, LayoutGrid, Star, Mail, Clock, Settings, Users, Edit3, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

type View = "catalog" | "services" | "registry" | "account" | "notifications" | "blog" | "profile_wishlist" | "profile_history" | "profile_wallet" | "profile_safety" | "logout" | "profile_edit";

export default function App() {
  const [role, setRole] = useState<UserRole>("student");
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john.doe@example.com");
  const [userPhone, setUserPhone] = useState("+91 98765 43210");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [currentView, setCurrentView] = useState<View>("catalog");
  const [booksLimit, setBooksLimit] = useState(7);
  const [blogsLimit, setBlogsLimit] = useState(3);

  const scrollToGrid = () => {
    const gridElement = document.getElementById("catalog-grid");
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateOrUpdate = async (bookData: Omit<Book, "id" | "available">) => {
    try {
      if (editingBook) {
        await fetch(`/api/books/${editingBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookData),
        });
      } else {
        await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookData),
        });
      }
      fetchBooks();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item from the collection?")) {
      try {
        await fetch(`/api/books/${id}`, { method: "DELETE" });
        fetchBooks();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const categories = ["All", ...Array.from(new Set(books.map((b) => b.category))).sort()];

  const filteredBooks = books.filter((book) => {
    const matchesRole = 
      role === "admin" || 
      book.audience === "both" || 
      book.audience === role;

    if (!matchesRole) return false;
    if (selectedCategory !== "All" && book.category !== selectedCategory) return false;

    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(searchQuery)
    );
  });

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: "student", label: "Student Portal", icon: User },
    { id: "employee", label: "Employee Portal", icon: Briefcase },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

const banner = { 
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=2000", 
    title: "The Ultimate Registry", 
    subtitle: "Curate your perfect library today." 
  };

  // Generate blog posts based on all available books
  const blogPosts = books.map((book, i) => ({
    id: book.id,
    title: `Insights: ${book.title}`,
    excerpt: `Discover the hidden depths of "${book.title}" by ${book.author}. An in-depth analysis of its cultural impact and literary significance.`,
    image: book.url || `https://images.unsplash.com/photo-${1507842217343 + i}-583bb7270b66?w=800&q=80`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
    author: "Serephina Editorial",
    category: book.category,
    mediumUrl: `https://medium.com/search?q=${encodeURIComponent(book.title)}`
  }));

  const canModify = role === "admin" || role === "employee";

  return (
    <div className="flex h-screen w-full bg-[#f3f3f3] overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {/* Nykaa-style Header */}
        <header className="bg-white px-8 flex flex-col z-40 sticky top-0 border-b border-slate-200">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div 
                onClick={() => {
                  setCurrentView("catalog");
                  setSelectedCategory("All");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-2xl font-black tracking-tighter text-serephina-pink uppercase">Serephina</span>
              </div>
              
              <nav className="hidden lg:flex items-center gap-8">
                <button 
                  onClick={() => setCurrentView("catalog")}
                  className={cn(
                    "text-sm font-black uppercase tracking-widest transition-colors relative py-2",
                    currentView === "catalog" ? "text-serephina-pink" : "text-slate-800 hover:text-serephina-pink"
                  )}
                >
                  Home
                  {currentView === "catalog" && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-serephina-pink" />
                  )}
                </button>
                <div className="relative group/blog">
                  <button 
                    onClick={() => setCurrentView("blog")}
                    className={cn(
                      "text-sm font-black uppercase tracking-widest transition-colors relative py-2 flex items-center gap-1",
                      currentView === "blog" ? "text-serephina-pink" : "text-slate-800 hover:text-serephina-pink"
                    )}
                  >
                    Blog
                    {currentView === "blog" && (
                      <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-serephina-pink" />
                    )}
                  </button>
                  
                  {/* Blog Links Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/blog:opacity-100 group-hover/blog:visible transition-all duration-300 z-50">
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-72 overflow-hidden py-4">
                      <div className="px-5 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vintage-text-muted">Book Features</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {books.slice(0, 8).map((book) => (
                          <a
                            key={book.id}
                            href={`https://medium.com/search?q=${encodeURIComponent(book.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group"
                          >
                            <div className="w-8 h-10 aspect-[3/4] bg-slate-100 rounded overflow-hidden">
                              <img src={book.url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-serephina-pink transition-colors">{book.title}</p>
                              <p className="text-[9px] text-vintage-text-muted truncate uppercase tracking-widest">{book.author}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="px-5 mt-3 pt-3 border-t border-slate-50">
                        <button 
                          onClick={() => setCurrentView("blog")}
                          className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#00ab6c] hover:text-black transition-colors"
                        >
                          View Full Publication
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            <div className="flex-1 max-w-xl mx-8">
              <div className="flex bg-slate-100 rounded-md overflow-hidden h-10 ring-serephina-pink/30 focus-within:ring-2 focus-within:bg-white transition-all border border-transparent focus-within:border-serephina-pink">
                <div className="flex items-center px-4 text-vintage-text-muted">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search Serephina Catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-2 border-none outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div 
                onClick={() => setCurrentView("account")}
                className={cn(
                  "flex flex-col items-center gap-1 cursor-pointer transition-all hover:text-serephina-pink group",
                  currentView === "account" ? "text-serephina-pink" : "text-slate-800"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                  currentView === "account" ? "bg-serephina-pink/10 border-serephina-pink" : "bg-slate-50 border-slate-200 group-hover:border-serephina-pink/30"
                )}>
                  <User className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
              </div>

              <div 
                onClick={() => setCurrentView("notifications")}
                className={cn(
                  "flex flex-col items-center gap-1 cursor-pointer transition-all hover:text-serephina-pink",
                  currentView === "notifications" ? "text-serephina-pink" : "text-slate-800"
                )}
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className={cn(
                    "absolute -top-1 -right-1 bg-serephina-pink text-white text-[8px] font-bold w-3 h-3 flex items-center justify-center rounded-full transition-all",
                    currentView === "notifications" ? "scale-125 shadow-lg shadow-serephina-pink/30" : ""
                  )}>3</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Activity</span>
              </div>
              
              {(role === "employee" || role === "admin") && (
                <button
                  onClick={() => {
                    setEditingBook(undefined);
                    setIsModalOpen(true);
                  }}
                  className="bg-serephina-pink text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm hover:bg-serephina-navy transition-all"
                >
                  Add Book
                </button>
              )}
            </div>
          </div>
          
          <div className="h-10 flex items-center gap-8 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setCurrentView("catalog");
                }}
                className={cn(
                  "hover:text-serephina-pink transition-colors h-full flex flex-col items-center justify-center relative px-2",
                  role === r.id ? "text-serephina-pink" : ""
                )}
              >
                <span>{r.label}</span>
                {role === r.id && (
                  <motion.div 
                    layoutId="portal-underline"
                    className="absolute bottom-0 h-0.5 w-full bg-serephina-pink"
                  />
                )}
              </button>
            ))}
            <button 
              onClick={() => setCurrentView("services")}
              className="ml-auto hover:text-serephina-pink transition-colors h-full flex items-center border-b-2 border-transparent"
            >
              Customer Support
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === "logout" && (
            <motion.div 
              key="logout"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center p-12 bg-white"
            >
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8">
                <LogOut className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 text-center">Goodbye for now!</h1>
              <p className="text-vintage-text-secondary text-center max-w-sm mb-12">
                You have been successfully logged out of Serephina. We can't wait to see what you'll read next.
              </p>
              <div className="flex flex-col gap-4 w-full max-w-xs text-center">
                <button 
                  onClick={() => setCurrentView("catalog")}
                  className="bg-serephina-pink text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-serephina-pink/20 hover:scale-105 transition-all"
                >
                  Log In To Serephina
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors py-2"
                >
                  Refresh Page
                </button>
              </div>
              <div className="mt-24 pt-12 border-t border-slate-50 w-full flex justify-center opacity-30">
                <span className="text-3xl font-black tracking-tighter text-slate-300 uppercase">Serephina</span>
              </div>
            </motion.div>
          )}

          {currentView === "blog" && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-12 max-w-7xl mx-auto w-full"
            >
              <div className="relative mb-16">
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-serephina-pink mb-4">Serephina Stories</span>
                  <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">The Reading Room</h1>
                  <div className="h-1 w-24 bg-serephina-pink mb-6"></div>
                  <p className="text-vintage-text-secondary max-w-2xl text-lg leading-relaxed">
                    Dive into our official Medium publication. 
                    Exclusive insights from our community of readers and librarians, 
                    representing the diverse collection within our library.
                  </p>
                </div>
                {canModify && (
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={() => {
                        setEditingBook(undefined);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-serephina-pink transition-all shadow-xl active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      Add New Library
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {blogPosts.slice(0, blogsLimit).map((post, i) => {
                      const book = books.find(b => b.id === post.id);
                      return (
                        <motion.article 
                          key={post.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-xl shadow-slate-200 transition-transform duration-500 group-hover:-translate-y-2">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-slate-900">
                              {post.category}
                            </div>
                            {canModify && book && (
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingBook(book);
                                    setIsModalOpen(true);
                                  }}
                                  className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-serephina-pink hover:text-white transition-all transform hover:scale-105"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit Library Details
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mb-3 text-[10px] font-black uppercase tracking-widest text-vintage-text-muted">
                            <span>{post.date}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span>By {post.author}</span>
                          </div>
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-serephina-pink transition-colors mb-4 leading-tight">
                            {post.title}
                          </h2>
                          <p className="text-xs text-vintage-text-secondary leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(post.mediumUrl, "_blank");
                            }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00ab6c] hover:bg-[#00ab6c]/5 px-3 py-2 rounded-lg transition-all"
                          >
                            Read on Medium <ChevronRight className="w-3 h-3" />
                          </button>
                        </motion.article>
                      );
                    })}
                  </div>

                  {blogsLimit < blogPosts.length && (
                    <div className="mt-16 flex justify-center">
                      <button 
                        onClick={() => setBlogsLimit(prev => prev + 3)}
                        className="px-10 py-3 bg-white border border-[#00ab6c]/20 text-[#00ab6c] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00ab6c] hover:text-white transition-all shadow-lg"
                      >
                        Discover More Stories
                      </button>
                    </div>
                  )}
                </div>

                {/* Blog Sidebar Links */}
                <div className="hidden lg:block space-y-8">
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-vintage-text-primary mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-serephina-pink rounded-full"></div>
                      Publication Links
                    </h3>
                    <div className="space-y-4">
                      {books.slice(0, 15).map((book) => (
                        <a
                          key={book.id}
                          href={`https://medium.com/search?q=${encodeURIComponent(book.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <p className="text-[11px] font-bold text-vintage-text-secondary group-hover:text-serephina-pink transition-colors line-clamp-2 leading-tight">
                            {book.title}
                          </p>
                          <p className="text-[9px] text-vintage-text-muted mt-1 uppercase tracking-widest">{book.category}</p>
                        </a>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50">
                      <p className="text-[10px] text-vintage-text-muted leading-relaxed font-medium">
                        These stories are curated based on our current library collection. Each piece is an editorial reflection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-24 bg-slate-900 rounded-[3rem] p-20 text-white relative overflow-hidden group">
                {canModify && (
                  <button 
                    className="absolute top-8 right-8 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900"
                    title="Edit Banner Layout"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-serephina-pink/10 -skew-x-12 transform translate-x-20"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
                      Join Our <br /> <span className="text-serephina-pink">Literary Circle</span>
                    </h2>
                    <p className="text-[#d1ccc0] text-lg max-w-md">
                      Get exclusive weekly book recommendations, author interviews, and library news delivered directly to your inbox.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex bg-white/10 backdrop-blur-md rounded-xl overflow-hidden p-1 border border-white/10 group focus-within:border-serephina-pink transition-all">
                      <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="bg-transparent border-none outline-none px-6 py-4 flex-1 text-white text-sm"
                      />
                      <button className="bg-serephina-pink text-white px-8 py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                        Subscribe
                      </button>
                    </div>
                    <p className="text-[10px] text-[#a39171] font-bold uppercase tracking-widest text-center lg:text-left">
                      Join 10,000+ readers today. No spam, ever.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {/* Hero Banner */}
              <div className="bg-white px-8 pt-6 pb-2">
                <div className="relative w-full aspect-[21/7] rounded-xl overflow-hidden group cursor-pointer">
                  <img 
                    src={banner.url} 
                    alt="Banner" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-16 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h1 className="text-6xl font-black uppercase tracking-tighter">Serephina</h1>
                      <p className="text-2xl font-bold mt-2 uppercase tracking-widest opacity-80">{banner.title}</p>
                      <p className="text-lg mt-4 max-w-lg text-[#d1ccc0]">{banner.subtitle}</p>
                      <button className="mt-8 bg-serephina-pink text-white px-10 py-3 text-sm font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-serephina-pink transition-all shadow-xl">
                        Explore Now
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Category Links */}
              <div className="bg-white px-8 py-6 border-b border-slate-100">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        scrollToGrid();
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border relative",
                        selectedCategory === cat
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                          : "bg-white text-vintage-text-secondary border-slate-100 hover:border-serephina-pink hover:text-serephina-pink"
                      )}
                    >
                      {cat === "All" ? "Every Genre" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid Area */}
              <div id="catalog-grid" className="p-8 max-w-8xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-serephina-pink bg-serephina-pink/10 px-2 py-0.5 rounded">
                        {role === 'admin' ? 'Administrative Control' : role === 'employee' ? 'Internal Employee Portal' : 'Official Student Portal'}
                      </span>
                    </div>
                  <div className="inline-block relative">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                      {selectedCategory === "All" ? "Every Book You Love" : `${selectedCategory} Collection`}
                    </h2>
                    <div className="h-1 w-1/3 bg-serephina-pink mt-1"></div>
                  </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter By:</span>
                    <select className="bg-white border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 outline-none focus:ring-1 focus:ring-serephina-pink cursor-pointer">
                      <option>Relevance</option>
                      <option>Popularity</option>
                      <option>Newest</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-serephina-pink"></div>
                  </div>
                ) : (
                  <>
                    <ProductGrid
                      books={filteredBooks.slice(0, booksLimit)}
                      role={role}
                      onEdit={(b) => {
                        setEditingBook(b);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDelete}
                      canModify={role === "admin" || role === "employee"}
                    />
                    
                    {booksLimit < filteredBooks.length && (
                      <div className="mt-12 flex justify-center">
                        <button 
                          onClick={() => setBooksLimit(prev => prev + 7)}
                          className="px-12 py-4 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xl shadow-slate-200/50"
                        >
                          Load More Products
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {currentView === "notifications" && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Activity Center</h1>
                  <p className="text-xs font-bold text-vintage-text-muted uppercase tracking-widest mt-1">Status updates, alerts & community news</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-serephina-pink hover:underline">Mark all as read</button>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    type: "order", 
                    title: "Book Ready for Checkout", 
                    time: "2 mins ago", 
                    body: "The Hobbit (Collector's Edition) is now available at the Main Branch. Please pick it up within 48 hours.",
                    status: "important"
                  },
                  { 
                    type: "system", 
                    title: "Membership Update", 
                    time: "1 hour ago", 
                    body: "Your Serephina Privé status has been upgraded to Platinum. Check your account for new benefits.",
                    status: "new"
                  },
                  { 
                    type: "community", 
                    title: "New Review on Your Wishlist", 
                    time: "4 hours ago", 
                    body: "J.K. Rowling just posted a community update regarding the Fantastic Beasts illustrated series.",
                    status: "read"
                  },
                  { 
                    type: "order", 
                    title: "Waitlist Update", 
                    time: "Yesterday", 
                    body: "You are now #2 in line for 'Project Hail Mary'. Estimated availability: 3 days.",
                    status: "read"
                  }
                ].map((notif, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "bg-white p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer group flex items-start gap-5",
                      notif.status === "important" ? "border-serephina-pink/20 bg-serephina-pink/[0.02]" : "border-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      notif.type === "order" ? "bg-emerald-50 text-emerald-600" : 
                      notif.type === "system" ? "bg-serephina-pink/10 text-serephina-pink" : 
                      "bg-slate-100 text-slate-500"
                    )}>
                      {notif.type === "order" ? <ShoppingBag className="w-5 h-5" /> : 
                       notif.type === "system" ? <ShieldCheck className="w-5 h-5" /> : 
                       <Users className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-vintage-text-primary uppercase tracking-tight group-hover:text-serephina-pink transition-colors">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-bold text-vintage-text-muted uppercase tracking-widest">{notif.time}</span>
                      </div>
                      <p className="text-xs text-vintage-text-secondary mt-2 leading-relaxed">{notif.body}</p>
                      {notif.status === "important" && (
                        <div className="mt-4 flex gap-2">
                          <button className="px-4 py-1.5 bg-serephina-pink text-white text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-slate-900">
                            Confirm Pickup
                          </button>
                          <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-widest rounded transition-all hover:bg-slate-50">
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>

                    {notif.status === "new" && (
                      <div className="w-2 h-2 rounded-full bg-serephina-pink mt-1 ring-4 ring-serephina-pink/10" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Serephina Insight</h3>
                  <p className="text-sm text-vintage-text-muted mt-2 max-w-sm">Based on your activity, you might like the upcoming book signing event in Downtown Mumbai next week.</p>
                  <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-serephina-pink hover:text-white transition-colors">RSVP Early Access →</button>
                </div>
                <div className="absolute top-0 right-0 p-8 h-full opacity-10">
                  <Star className="w-48 h-48 -rotate-12" />
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "services" && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Customer Service</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: ShoppingBag, title: "Book Returns", desc: "Easy returns for your borrowed items." },
                  { icon: Clock, title: "Loan History", desc: "Track every book you've ever read." },
                  { icon: Mail, title: "Contact Us", desc: "24/7 support from our librarian team." },
                  { icon: HelpCircle, title: "Search Help", desc: "Find anything on our library guides." },
                  { icon: Star, title: "Beauty Rewards", desc: "Earn points for every borrow." },
                  { icon: ShieldCheck, title: "Account Safety", desc: "Manage your library security." },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-serephina-pink/5 rounded-full text-serephina-pink group-hover:bg-serephina-pink group-hover:text-white transition-all transform">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-vintage-text-primary uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xs text-vintage-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === "profile_edit" && (
            <motion.div 
              key="profile_edit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("account")} className="hover:text-serephina-pink transition-colors">Profile</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Edit Personal Details</span>
              </div>
              
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-50">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">Edit Profile</h2>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-vintage-text-muted">Full Name</label>
                      <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-vintage-text-primary font-bold focus:ring-2 focus:ring-serephina-pink outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-vintage-text-muted">Portal Access (Role)</label>
                      <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-vintage-text-primary font-bold focus:ring-2 focus:ring-serephina-pink outline-none transition-all cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-vintage-text-muted">Email Address</label>
                      <input 
                        type="email" 
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-vintage-text-primary font-bold focus:ring-2 focus:ring-serephina-pink outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-vintage-text-muted">Phone Number</label>
                      <input 
                        type="tel" 
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-vintage-text-primary font-bold focus:ring-2 focus:ring-serephina-pink outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
                    <button 
                      onClick={() => setCurrentView("account")}
                      className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setCurrentView("account")}
                      className="bg-slate-900 text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-serephina-pink transition-all shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "profile_wishlist" && (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("account")} className="hover:text-serephina-pink transition-colors">Profile</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Saved Wishlist</span>
              </div>
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-50 min-h-[400px] flex flex-col items-center justify-center text-center">
                <Heart className="w-16 h-16 text-slate-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 uppercase">Your Wishlist is Empty</h3>
                <p className="text-vintage-text-secondary mt-2 max-w-xs">Start browsing our catalog to save your favorite literary pieces.</p>
                <button 
                  onClick={() => setCurrentView("catalog")}
                  className="mt-8 bg-serephina-pink text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
                >
                  Explore Catalog
                </button>
              </div>
            </motion.div>
          )}

          {currentView === "profile_history" && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("account")} className="hover:text-serephina-pink transition-colors">Profile</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Reading History</span>
              </div>
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-50">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">Recently Borrowed</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="w-12 h-16 bg-slate-100 rounded shadow-sm overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-${1512820790803 + i}-83ca734da794?w=100)` }}></div>
                      <div>
                        <h4 className="font-bold text-slate-900">Classic Literature Vol. {i+1}</h4>
                        <p className="text-[10px] font-bold text-vintage-text-muted uppercase tracking-widest mt-1">Returned on May {10 - i}, 2024</p>
                      </div>
                      <button className="ml-auto text-[10px] font-black text-serephina-pink uppercase tracking-widest hover:underline">View Review</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "profile_wallet" && (
            <motion.div 
              key="wallet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("account")} className="hover:text-serephina-pink transition-colors">Profile</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Serephina Wallet</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden h-64 flex flex-col justify-end">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                      <Star className="w-48 h-48 rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-serephina-pink">Available Balance</span>
                      <h2 className="text-6xl font-black mt-2">₹1,450.00</h2>
                      <p className="text-xs text-vintage-text-muted mt-4 font-bold uppercase tracking-widest">Serephina Privé Platinum Reward Credits Included</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-50">
                    <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Recent Transactions</h3>
                    <div className="space-y-6">
                      {[1, 2].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <Star className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">Monthly Reward Credit</p>
                              <p className="text-[10px] text-vintage-text-muted font-bold uppercase tracking-widest">May 01, 2024</p>
                            </div>
                          </div>
                          <span className="font-black text-emerald-600">+₹500.00</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-50 text-center">
                    <ShoppingBag className="w-10 h-10 text-serephina-pink mx-auto mb-4" />
                    <h4 className="font-black text-slate-900 uppercase">Top Up Balance</h4>
                    <p className="text-xs text-vintage-text-secondary mt-2">Add credits to your account for late fees or premium rentals.</p>
                    <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-serephina-pink">Add Funds</button>
                  </div>
                  <div className="bg-serephina-pink rounded-3xl p-8 text-white text-center">
                    <Mail className="w-10 h-10 mx-auto mb-4" />
                    <h4 className="font-black uppercase">Redeem Gift Card</h4>
                    <button className="w-full mt-6 bg-white text-serephina-pink py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white">Redeem Now</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "profile_safety" && (
            <motion.div 
              key="safety"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("account")} className="hover:text-serephina-pink transition-colors">Profile</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Security Center</span>
              </div>
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-50">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8">Account & Privacy</h2>
                <div className="space-y-6">
                  {[
                    { title: "Two-Factor Authentication", enabled: true, desc: "Add an extra layer of security to your account." },
                    { title: "Personalized Content", enabled: true, desc: "Use your reading history to show better recommendations." },
                    { title: "Marketing Emails", enabled: false, desc: "Receive updates about new releases and events." },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900">{pref.title}</h4>
                        <p className="text-xs text-vintage-text-secondary mt-1">{pref.desc}</p>
                      </div>
                      <div className={cn(
                        "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                        pref.enabled ? "bg-serephina-pink" : "bg-slate-300"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          pref.enabled ? "right-1" : "left-1"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-12 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 uppercase mb-4">Password Management</h3>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-serephina-pink transition-all shadow-lg">Change Password</button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "account" && (
            <motion.div 
              key="account"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="p-12 max-w-6xl mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <button onClick={() => setCurrentView("catalog")} className="hover:text-serephina-pink transition-colors">Serephina</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Personal Profile</span>
              </div>

              <div className="bg-white rounded-3xl p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 h-full flex flex-col justify-center opacity-10">
                  <User className="w-64 h-64 text-serephina-pink" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-8 mb-12">
                    <div className="w-24 h-24 bg-gradient-to-tr from-serephina-pink to-serephina-navy rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                      JD
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{userName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-3 py-1 bg-serephina-pink text-white text-[10px] font-black rounded-full uppercase tracking-widest">Privé Platinum</span>
                        <span className="text-[10px] text-vintage-text-muted font-bold uppercase tracking-widest">Member since Oct 2024</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "My Profile", icon: User, view: "profile_edit" },
                      { title: "My History", icon: Clock, view: "profile_history" },
                      { title: "Address Book", icon: Settings, view: "account" },
                      { title: "Wishlist", icon: Heart, view: "profile_wishlist" },
                      { title: "Serephina Wallet", icon: Star, view: "profile_wallet" },
                      { title: "Security", icon: ShieldCheck, view: "profile_safety" },
                    ].map((sec, i) => (
                      <div 
                        key={i} 
                        onClick={() => setCurrentView(sec.view as View)}
                        className="bg-slate-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group border border-transparent hover:border-slate-100"
                      >
                        <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-serephina-pink transition-colors">
                          <sec.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm text-slate-800 uppercase tracking-tight">{sec.title}</span>
                        <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-serephina-pink group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-12 border-t border-slate-100 flex justify-between items-center">
                    <button 
                      onClick={() => setCurrentView("logout")}
                      className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                    >
                      Sign Out
                    </button>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-serephina-pink transition-all shadow-lg">Delete Account</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingBook}
      />
    </div>
  );
}
