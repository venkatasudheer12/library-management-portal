import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Members from "./pages/Members.jsx";
import IssueBook from "./pages/IssueBook.jsx";
import Transactions from "./pages/Transactions.jsx";
import { booksAPI, membersAPI, transactionsAPI } from "./services/api";

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("libraryUser"));
  const [page, setPage] = useState("Dashboard");
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bookData, memberData, transactionData] = await Promise.all([
        booksAPI.getAll(), membersAPI.getAll(), transactionsAPI.getAll()
      ]);
      setBooks(bookData);
      setMembers(memberData);
      setTransactions(transactionData);
    } catch (err) {
      setError(err.message || "Unable to load library data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  function showNotice(text) {
    setNotice(text);
    setError("");
  }

  async function runAction(action, successMessage) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await loadData();
      showNotice(successMessage);
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function handleAuth({ mode, name, email, password }) {
    const savedUsers = JSON.parse(localStorage.getItem("libraryUsers") || "[]");
    if (mode === "register") {
      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }
      if (email.toLowerCase() === "student@gmail.com" || savedUsers.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
        setError("This email is already registered.");
        return;
      }
      savedUsers.push({ name, email, password });
      localStorage.setItem("libraryUsers", JSON.stringify(savedUsers));
    } else {
      const validDemo = email === "student@gmail.com" && password === "123456";
      const validSaved = savedUsers.some((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
      if (!validDemo && !validSaved) {
        setError("Invalid email or password.");
        return;
      }
    }
    localStorage.setItem("libraryUser", email);
    setUser(email);
    setError("");
  }

  function logout() {
    localStorage.removeItem("libraryUser");
    setUser(null);
    setPage("Dashboard");
    setNotice("");
    setError("");
  }

  async function saveBook(form, editing) {
    const data = { ...form };
    if (editing) {
      await runAction(() => booksAPI.update(editing.id, { ...editing, ...data }), "Book updated successfully.");
    } else {
      await runAction(() => booksAPI.add({ ...data, status: "Available" }), "Book added successfully.");
    }
  }

  async function deleteBook(book) {
    if (book.status === "Issued") {
      setError("Return this book before deleting it.");
      return;
    }
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    await runAction(() => booksAPI.remove(book.id), "Book deleted successfully.");
  }

  async function saveMember(form, editing) {
    if (editing) {
      await runAction(() => membersAPI.update(editing.id, { ...editing, ...form }), "Member updated successfully.");
    } else {
      await runAction(() => membersAPI.add(form), "Member added successfully.");
    }
  }

  async function deleteMember(member) {
    const hasActiveLoan = transactions.some((item) => String(item.memberId) === String(member.id) && item.status === "Issued");
    if (hasActiveLoan) {
      setError("This member has an issued book. Return it before deleting the member.");
      return;
    }
    if (!window.confirm(`Delete member "${member.name}"?`)) return;
    await runAction(() => membersAPI.remove(member.id), "Member deleted successfully.");
  }

  async function issueBook(bookId, memberId) {
    const book = books.find((item) => String(item.id) === String(bookId));
    const member = members.find((item) => String(item.id) === String(memberId));
    if (!book || !member) {
      setError("Select both a book and a member.");
      return false;
    }
    if (book.status === "Issued") {
      setError("This book is already issued.");
      return false;
    }

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);
    return runAction(async () => {
      await transactionsAPI.add({
        bookId: book.id,
        memberId: member.id,
        bookTitle: book.title,
        memberName: member.name,
        issueDate: localDate(today),
        dueDate: localDate(due),
        returnDate: "",
        status: "Issued"
      });
      await booksAPI.update(book.id, { ...book, status: "Issued" });
    }, "Book issued successfully.");
  }

  async function returnBook(transaction) {
    if (transaction.status !== "Issued") return;
    const book = books.find((item) => String(item.id) === String(transaction.bookId));
    await runAction(async () => {
      await transactionsAPI.update(transaction.id, {
        ...transaction,
        status: "Returned",
        returnDate: localDate(new Date())
      });
      if (book) await booksAPI.update(book.id, { ...book, status: "Available" });
    }, "Book returned successfully.");
  }

  if (!user) {
    return <Login onLogin={handleAuth} error={error} clearError={() => setError("")} />;
  }

  function renderPage() {
    const common = { busy };
    switch (page) {
      case "Books":
        return <Books books={books} onSave={saveBook} onDelete={deleteBook} {...common} />;
      case "Members":
        return <Members members={members} onSave={saveMember} onDelete={deleteMember} {...common} />;
      case "Issue Book":
        return <IssueBook books={books} members={members} transactions={transactions} onIssue={issueBook} onReturn={returnBook} {...common} />;
      case "Transactions":
        return <Transactions transactions={transactions} onReturn={returnBook} />;
      default:
        return <Dashboard books={books} members={members} transactions={transactions} onReturn={returnBook} onNavigate={setPage} />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={(nextPage) => { setPage(nextPage); setError(""); setNotice(""); }} user={user} onLogout={logout} />
      <main className="main-area">
        <Header user={user} />
        {error && <div className="alert alert-error" role="alert"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss">×</button></div>}
        {notice && <div className="alert alert-success" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
        {loading ? <div className="loading-state"><span className="spinner" /> Loading library data…</div> : renderPage()}
        <footer className="app-footer">Library Management Portal <span>•</span> Built for learning</footer>
      </main>
    </div>
  );
}