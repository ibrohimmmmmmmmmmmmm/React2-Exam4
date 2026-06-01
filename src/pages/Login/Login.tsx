import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login as loginService } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitError("");
      setSuccess(false);

      try {
        const response = await loginService({
          email: values.email,
          password: values.password,
        });

        const { token, role } = response.data;
        localStorage.setItem("token", token || "mock-token-" + Date.now());
        localStorage.setItem("role", role || "candidate");
        
        setSuccess(true);
        setLoading(false);
        
        setTimeout(() => {
          if (role === "organization") {
            navigate("/organization-page");
          } else {
            navigate("/candidate-page");
          }
        }, 1000);
      } catch (err: any) {
        console.error("Login API failed, trying mock fallback:", err);
        
        // Mock fallback login implementation
        const emailLower = values.email.toLowerCase();
        let matchedRole: "candidate" | "organization" | null = null;

        // 1. Check predefined credentials
        if (emailLower === "candidate@ai-job.com" && values.password === "password123") {
          matchedRole = "candidate";
        } else if (emailLower === "org@ai-job.com" && values.password === "password123") {
          matchedRole = "organization";
        } else {
          // 2. Check registered users in localStorage
          const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
          const foundUser = existingUsers.find(
            (u: any) => u.email.toLowerCase() === emailLower && u.password === values.password
          );
          if (foundUser) {
            matchedRole = foundUser.role;
          }
        }

        if (matchedRole) {
          localStorage.setItem("token", "mock-token-" + Math.random().toString(36).substr(2, 9));
          localStorage.setItem("role", matchedRole);
          
          setSuccess(true);
          setLoading(false);
          
          setTimeout(() => {
            if (matchedRole === "organization") {
              navigate("/organization-page");
            } else {
              navigate("/candidate-page");
            }
          }, 1000);
        } else {
          setLoading(false);
          setSubmitError("Invalid email or password. Try candidate@ai-job.com or org@ai-job.com with password123.");
        }
      }
    },
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#0f172a",
      }}
    >
      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #eef2ff 0%, #f0f4ff 40%, #dde8fd 100%)",
          borderRight: "1px solid #e2e8f0",
          boxSizing: "border-box",
        }}
      >
        {/* Blob top-right */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Blob bottom-left */}
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 400, textAlign: "center" }}>
          {/* Logo card */}
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: 20, background: "#ffffff", borderRadius: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 32,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 16,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 48 48" fill="none" width={48} height={48} xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="4.5" fill="white" />
                <circle cx="9"  cy="13" r="3" fill="white" opacity="0.75" />
                <circle cx="39" cy="13" r="3" fill="white" opacity="0.75" />
                <circle cx="9"  cy="35" r="3" fill="white" opacity="0.75" />
                <circle cx="39" cy="35" r="3" fill="white" opacity="0.75" />
                <line x1="24" y1="24" x2="9"  y2="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="24" y1="24" x2="39" y2="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="24" y1="24" x2="9"  y2="35" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="24" y1="24" x2="39" y2="35" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
              </svg>
            </div>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, marginBottom: 16 }}>
            AI-powered job &amp; recruitment platform
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 36 }}>
            Experience the next generation of talent acquisition where precision meets professional efficiency.
          </p>

          {/* Stats card */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 18px",
            background: "rgba(255,255,255,0.70)",
            backdropFilter: "blur(12px)",
            borderRadius: 14, border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            textAlign: "left",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: "rgba(16,185,129,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="#10b981" width={20} height={20}>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>98% Match Accuracy</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>Proprietary AI filtering active</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          position: "relative",
          padding: "48px 64px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>Welcome Back</h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>Enter your details to access your dashboard.</p>
          </div>

          {/* Error alert */}
          {submitError && (
            <div style={{
              marginBottom: 20, padding: "12px 14px", borderRadius: 10,
              background: "#fff1f2", border: "1px solid #fecdd3",
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <svg viewBox="0 0 24 24" fill="#e11d48" width={16} height={16} style={{ marginTop: 1, flexShrink: 0 }}>
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#be123c", margin: 0 }}>
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#64748b", marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} width={18} height={18}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="name@company.com"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                    background: "#ffffff", border: `1px solid ${formik.touched.email && formik.errors.email ? "#ef4444" : "#e2e8f0"}`, borderRadius: 10,
                    fontSize: 14, color: "#0f172a", outline: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => { if (!formik.errors.email) { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; } }}
                  onBlur={(e) => { e.target.style.borderColor = formik.touched.email && formik.errors.email ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>Password</label>
                <a href="#" style={{ fontSize: 14, fontWeight: 500, color: "#2563eb", textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} width={18} height={18}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: 40, paddingRight: 44, paddingTop: 12, paddingBottom: 12,
                    background: "#ffffff", border: `1px solid ${formik.touched.password && formik.errors.password ? "#ef4444" : "#e2e8f0"}`, borderRadius: 10,
                    fontSize: 14, color: "#0f172a", outline: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => { if (!formik.errors.password) { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; } }}
                  onBlur={(e) => { e.target.style.borderColor = formik.touched.password && formik.errors.password ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  color: "#94a3b8", display: "flex", alignItems: "center",
                }}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.password}</div>
              )}
            </div>

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                id="remember" type="checkbox"
                name="remember"
                checked={formik.values.remember}
                onChange={formik.handleChange}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#2563eb" }}
              />
              <label htmlFor="remember" style={{ fontSize: 14, color: "#64748b", cursor: "pointer", userSelect: "none" }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px 24px", borderRadius: 10,
                background: success ? "#10b981" : "#2563eb",
                color: "#ffffff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 2px 10px rgba(37,99,235,0.28)",
                opacity: loading ? 0.85 : 1,
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none" width={16} height={16}>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                    <path fill="rgba(255,255,255,0.9)" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                  </svg>
                  Verifying...
                </>
              ) : success ? "Success!" : "Log In"}
            </button>
          </form>

          {/* Social login */}
          <div style={{ marginTop: 32 }}>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", borderTop: "1px solid #e2e8f0" }} />
              </div>
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <span style={{ background: "#ffffff", padding: "0 16px", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                {
                  label: "Google",
                  icon: (
                    <svg viewBox="0 0 24 24" width={18} height={18}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  icon: (
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px 16px", background: "#ffffff",
                    border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer",
                    fontSize: 14, fontWeight: 500, color: "#334155",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", margin: 0 }}>
              Don't have an account?{" "}
              <Link to="/create-account" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                Request Access
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          position: "absolute", bottom: 28, left: 0, right: 0,
          textAlign: "center", fontSize: 12, color: "#cbd5e1", margin: 0,
        }}>
          AI-JOB © 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}
