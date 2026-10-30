import { useState } from "react";

export default function Login({ onLogin, error, clearError }) {
  const [mode, setMode] = useState("login");

  function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onLogin({
      mode,
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      password: String(form.get("password") || "")
    });
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">▣</div>
        <p className="eyebrow centered">YOUR CAMPUS LIBRARY</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="muted centered">A simpler way to manage your library.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="stack-form" onSubmit={submit}>
          {mode === "register" && (
            <label>Full name<input name="name" placeholder="Enter your name" required /></label>
          )}
          <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
          <label>Password<input name="password" type="password" minLength="6" placeholder="At least 6 characters" required /></label>
          <button className="button button-primary button-wide" type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="demo-note">
          <strong>Demo credentials</strong><br />
          student@gmail.com / 123456
        </div>
        <p className="auth-switch">
          {mode === "login" ? "New to the portal?" : "Already registered?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); clearError(); }}>
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}