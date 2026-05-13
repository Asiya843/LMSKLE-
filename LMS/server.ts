import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

// --- Mock Database ---
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  category: string;
  coverUrl: string;
  audience: 'student' | 'employee' | 'both';
}

let books: Book[] = [
  // Literature
  {
    id: "1",
    title: "The Odyssey",
    author: "Homer",
    isbn: "978-0140268867",
    available: true,
    category: "Literature",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "2",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    available: true,
    category: "Literature",
    coverUrl: "https://images.unsplash.com/photo-1532012197367-2d2d1fdf230b?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "3",
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    isbn: "978-0141439600",
    available: true,
    category: "Literature",
    coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  // Dystopian
  {
    id: "4",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    isbn: "978-1451673319",
    available: true,
    category: "Dystopian",
    coverUrl: "https://images.unsplash.com/photo-1543004457-450c09b26461?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "5",
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    isbn: "978-0385490818",
    available: true,
    category: "Dystopian",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  {
    id: "6",
    title: "Animal Farm",
    author: "George Orwell",
    isbn: "978-0451526342",
    available: true,
    category: "Dystopian",
    coverUrl: "https://images.unsplash.com/photo-1471970333761-12ec894fa31d?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  {
    id: "6-2",
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0060850524",
    available: false,
    category: "Dystopian",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  // Fiction
  {
    id: "7",
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "978-0062315007",
    available: true,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "8",
    title: "Frankenstein",
    author: "Mary Shelley",
    isbn: "978-0141439471",
    available: true,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "9",
    title: "The Martian",
    author: "Andy Weir",
    isbn: "978-0553418026",
    available: true,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  {
    id: "9-2",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    isbn: "978-0735219090",
    available: true,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  // Technology
  {
    id: "10",
    title: "Python Crash Course",
    author: "Eric Matthes",
    isbn: "978-1593279288",
    available: true,
    category: "Technology",
    coverUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "11",
    title: "Life 3.0",
    author: "Max Tegmark",
    isbn: "978-1101946596",
    available: true,
    category: "Technology",
    coverUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'employee'
  },
  {
    id: "12",
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest, Stein",
    isbn: "978-0262033848",
    available: true,
    category: "Technology",
    coverUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  // Productivity
  {
    id: "13",
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "978-1455586691",
    available: true,
    category: "Productivity",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'employee'
  },
  {
    id: "14",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    available: true,
    category: "Productivity",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  },
  {
    id: "15",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    isbn: "978-1982137274",
    available: true,
    category: "Productivity",
    coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'employee'
  },
  // Science
  {
    id: "16",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0553380163",
    available: true,
    category: "Science",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'student'
  },
  {
    id: "17",
    title: "Cosmos",
    author: "Carl Sagan",
    isbn: "978-0345331359",
    available: true,
    category: "Science",
    coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=300&h=450",
    audience: 'both'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/books", (req, res) => {
    res.json(books);
  });

  app.post("/api/books", (req, res) => {
    const newBook = { ...req.body, id: Date.now().toString(), available: true };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...req.body };
      res.json(books[index]);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    books = books.filter(b => b.id !== id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
