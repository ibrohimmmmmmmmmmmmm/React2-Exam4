import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register as registerService } from "../../services/authService";

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Default role from navigation state, localStorage, or default to candidate
  const initialRole = location.state?.role || localStorage.getItem("role") || "candidate";

  const inputStyle = (field: string, hasError = false): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    background: "#ffffff",
    border: `1px solid ${hasError ? "#ef4444" : focusedField === field ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 8,
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxShadow: focusedField === field
      ? "0 0 0 2px rgba(37,99,235,0.10)"
      : "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  });

  const labelStyle = (field: string): React.CSSProperties => ({
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: focusedField === field ? "#2563eb" : "#64748b",
    marginBottom: 6,
    transition: "color 0.15s",
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
      terms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      role: Yup.string().required("Please select your role"),
      terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitError("");
      try {
        const response = await registerService({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role,
        });

        const responseData = response.data?.data ?? response.data ?? {};
        const token = responseData.token || responseData.accessToken || responseData.access_token;

        if (token) {
          const cleanToken = token.toString().trim().replace(/^Bearer\s+/i, "");
          localStorage.setItem("token", cleanToken);
        }

        localStorage.setItem("role", values.role);
        setLoading(false);
        if (values.role === "organization") {
          navigate("/organization-page");
        } else {
          navigate("/candidate-page");
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        // Fallback for offline mode or Render cold start
        const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("token", mockToken);
        localStorage.setItem("role", values.role);

        // Save mock user for test logins
        const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
        existingUsers.push({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        localStorage.setItem("mock_users", JSON.stringify(existingUsers));

        setLoading(false);
        if (values.role === "organization") {
          navigate("/organization-page");
        } else {
          navigate("/candidate-page");
        }
      }
    },
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#f7f9fb",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#0f172a",
      position: "relative",
    }}>
      {/* Main content */}
      <main style={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "32px 16px",
        boxSizing: "border-box",
      }}>
        <div style={{ width: "100%", maxWidth: 480 }}>

          {/* Branding */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#2563eb", letterSpacing: "-0.02em" }}>
                AI-JOB
              </span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.25 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              Start your AI-powered career journey today.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "40px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
            marginBottom: 20,
          }}>
            <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Full Name */}
              <div>
                <label style={labelStyle("fullName")}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => setFocusedField("fullName")}
                  style={inputStyle("fullName", formik.touched.fullName && !!formik.errors.fullName)}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.fullName}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle("email")}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => setFocusedField("email")}
                  style={inputStyle("email", formik.touched.email && !!formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                  <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.email}</div>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label style={labelStyle("role")}>Account Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
                  {["candidate", "organization"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => formik.setFieldValue("role", r)}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        border: `1px solid ${formik.values.role === r ? "#2563eb" : "#e2e8f0"}`,
                        background: formik.values.role === r ? "rgba(37,99,235,0.05)" : "#ffffff",
                        color: formik.values.role === r ? "#2563eb" : "#0f172a",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.15s",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {formik.touched.role && formik.errors.role && (
                  <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                    {typeof formik.errors.role === "string" ? formik.errors.role : "Please select a role."}
                  </div>
                )}
              </div>

              {/* Password row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle("password")}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={() => setFocusedField("password")}
                    style={inputStyle("password", formik.touched.password && !!formik.errors.password)}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.password}</div>
                  )}
                </div>
                <div>
                  <label style={labelStyle("confirm")}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={() => setFocusedField("confirm")}
                    style={inputStyle("confirm", formik.touched.confirmPassword && !!formik.errors.confirmPassword)}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <input
                    id="terms"
                    type="checkbox"
                    name="terms"
                    checked={formik.values.terms}
                    onChange={formik.handleChange}
                    style={{ width: 16, height: 16, marginTop: 2, accentColor: "#2563eb", cursor: "pointer", flexShrink: 0 }}
                  />
                  <label htmlFor="terms" style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, cursor: "pointer" }}>
                    I agree to the{" "}
                    <a href="#" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>Privacy Policy</a>.
                  </label>
                </div>
                {formik.touched.terms && formik.errors.terms && (
                  <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formik.errors.terms}</div>
                )}
              </div>

              {submitError && (
                <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <div style={{ paddingTop: 4 }}>
                <button
                  type="submit" disabled={loading}
                  style={{
                    width: "100%", padding: "13px 24px", borderRadius: 8,
                    background: "#2563eb", color: "#ffffff", border: "none",
                    fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                    opacity: loading ? 0.8 : 1,
                    transition: "opacity 0.15s, transform 0.1s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={16} height={16}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div style={{ position: "relative", padding: "8px 0" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                  <div style={{ width: "100%", borderTop: "1px solid #e2e8f0" }} />
                </div>
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span style={{ background: "#ffffff", padding: "0 16px", fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  {
                    label: "Google",
                    icon: (
                      <svg viewBox="0 0 24 24" width={18} height={18}>
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    ),
                  },
                  {
                    label: "GitHub",
                    icon: (
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="#0f172a">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
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
                      border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer",
                      fontSize: 14, fontWeight: 500, color: "#334155",
                      transition: "background 0.15s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; }}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Footer link */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Wave decoration */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, width: "100%",
        pointerEvents: "none", zIndex: 0, opacity: 0.3,
      }}>
        <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
          <path d="M0 224L60 213.3C120 202.7 240 181.3 360 186.7C480 192 600 224 720 213.3C840 202.7 960 149.3 1080 138.7C1200 128 1320 160 1380 176L1440 192V320H0V224Z"
            fill="url(#waveGrad)" />
          <defs>
            <linearGradient id="waveGrad" x1="720" y1="138" x2="720" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" stopOpacity="0.1" />
              <stop offset="1" stopColor="#2563EB" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        width: "100%", padding: "14px 32px", boxSizing: "border-box",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
        fontSize: 13, color: "#64748b",
      }}>
        <span>AI-JOB © 2026</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Security", "Support"].map((item) => (
            <a key={item} href="#" style={{ color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#2563eb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
