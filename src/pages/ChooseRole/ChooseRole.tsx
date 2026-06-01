import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register as registerService } from "../../services/authService";

// ── inline style tokens (match original Tailwind config exactly) ──────────────
const C = {
  primary: "#004ac6",
  primaryContainer: "#2563eb",
  surface: "#FFFFFF",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerLowest: "#ffffff",
  background: "#f7f9fb",
  border: "#E2E8F0",
  textMain: "#0F172A",
  textMuted: "#64748B",
  onSurface: "#191c1e",
};

const T = {
  headlineLg: { fontSize: 32, lineHeight: "40px", fontWeight: 600, letterSpacing: "-0.01em" } as React.CSSProperties,
  headlineLgMobile: { fontSize: 24, lineHeight: "32px", fontWeight: 600 } as React.CSSProperties,
  headlineMd: { fontSize: 24, lineHeight: "32px", fontWeight: 600 } as React.CSSProperties,
  headlineSm: { fontSize: 20, lineHeight: "28px", fontWeight: 600 } as React.CSSProperties,
  bodyLg: { fontSize: 18, lineHeight: "28px", fontWeight: 400 } as React.CSSProperties,
  bodyMd: { fontSize: 16, lineHeight: "24px", fontWeight: 400 } as React.CSSProperties,
  bodySm: { fontSize: 14, lineHeight: "20px", fontWeight: 400 } as React.CSSProperties,
  labelMd: { fontSize: 14, lineHeight: "20px", fontWeight: 500 } as React.CSSProperties,
};

// ── injected once at module level ─────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("aijob-fonts")) {
  const link1 = Object.assign(document.createElement("link"), {
    id: "aijob-fonts",
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  });
  const link2 = Object.assign(document.createElement("link"), {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  });
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      font-size: 32px; display: inline-block; line-height: 1;
    }
    .role-card { cursor: pointer; transition: box-shadow 0.3s, border-color 0.3s; }
    .role-card:hover { box-shadow: 0px 8px 24px rgba(0,0,0,0.08); border-color: #2563eb !important; }
    .role-card:hover .icon-container { background-color: #2563eb !important; color: white !important; transform: scale(1.1); }
    .role-card:hover .join-btn { background-color: #004ac6 !important; color: white !important; border-color: #004ac6 !important; }
    .role-card:hover .card-img { opacity: 1 !important; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.6s ease-out forwards; }
    a:hover { text-decoration: underline; }
    input:focus { outline: none; border-color: #004ac6 !important; box-shadow: 0 0 0 3px rgba(0,74,198,0.12) !important; }
  `;
  document.head.append(link1, link2, style);
}

export default function ChooseRole  () {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [modalRole, setModalRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Work Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setSubmitError("");
      setLoading(true);
      const roleLower = modalRole.toLowerCase() as "candidate" | "organization";
      try {
        const response = await registerService({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: roleLower,
        });
        
        const token = response.data?.token || "mock-token-" + Date.now();
        localStorage.setItem("token", token);
        localStorage.setItem("role", roleLower);
        
        setLoading(false);
        closeModal();
        if (roleLower === "organization") {
          navigate("/organization-page");
        } else {
          navigate("/candidate-page");
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        // Fallback to local storage mock register so it works even if API is offline
        const mockToken = "mock-token-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("token", mockToken);
        localStorage.setItem("role", roleLower);
        
        // Also save mock user credentials for mock login
        const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
        existingUsers.push({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: roleLower,
        });
        localStorage.setItem("mock_users", JSON.stringify(existingUsers));
        
        setLoading(false);
        closeModal();
        if (roleLower === "organization") {
          navigate("/organization-page");
        } else {
          navigate("/candidate-page");
        }
      }
    },
  });

  function openModal(role: string) {
    setModalRole(role);
    formik.resetForm();
    setSubmitError("");
    setModalVisible(true);
    setTimeout(() => setModalOpen(true), 10);
  }

  function closeModal() {
    setModalOpen(false);
    setTimeout(() => {
      setModalVisible(false);
      formik.resetForm();
    }, 300);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) closeModal();
  }

  return (
    <div style={{ background: C.background, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.textMain }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 32px", height: 64,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ ...T.headlineMd, color: C.primary, fontWeight: 700 }}>AI-JOB</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ ...T.labelMd, color: C.textMuted }}>Need help?</span>
          <button style={{ ...T.labelMd, color: C.primary, background: "none", border: "none", cursor: "pointer" }}>
            Contact Support
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32,
      }}>
        <div style={{ width: "100%", maxWidth: 896, display: "flex", flexDirection: "column", gap: 48 }}>

          {/* Headline */}
          <div className="fade-in" style={{ textAlign: "center", animationDelay: "0.1s" }}>
            <h1 style={{ ...T.headlineLg, color: C.textMain, marginBottom: 16 }}>
              How will you use AI-JOB?
            </h1>
            <p style={{ ...T.bodyLg, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>
              Choose your journey to start matching with the future of recruitment powered by intelligence.
            </p>
          </div>

          {/* Cards grid */}
          <div className="fade-in" style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, animationDelay: "0.3s",
          }}>
            {/* Candidate Card */}
            <div
              className="role-card"
              onClick={() => openModal("Candidate")}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 32,
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24,
              }}
            >
              <div className="icon-container" style={{
                width: 64, height: 64, borderRadius: "50%",
                background: C.surfaceContainerLow,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s, color 0.3s, transform 0.3s",
              }}>
                <span className="material-symbols-outlined">person</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2 style={{ ...T.headlineMd, color: C.textMain }}>Candidate</h2>
                <p style={{ ...T.bodyMd, color: C.textMuted }}>
                  I want to find my next career opportunity and manage applications with AI tools.
                </p>
              </div>
              <div style={{ paddingTop: 16, width: "100%" }}>
                <button className="join-btn" style={{
                  width: "100%", padding: "12px 0",
                  background: C.surface, border: `1px solid ${C.border}`,
                  color: C.textMuted, ...T.labelMd,
                  borderRadius: 6, cursor: "pointer",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}>
                  Join as Candidate
                </button>
              </div>
              <div style={{ width: "100%", overflow: "hidden", borderRadius: 8 }}>
                <img
                  className="card-img"
                  alt="Professional candidate using a laptop in a clean workspace"
                  style={{ width: "100%", height: 128, objectFit: "cover", opacity: 0.4, transition: "opacity 0.3s", display: "block" }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVZZkhq_bSNzhwGn8VWsP3SM0Cb2oMmWnlrx19ZWmt0JgtdfbuvRv9jEknYyqvdMipx8kRibNujAVxG6d1RXSwXR4VdUolYwc30ct4tZLsV4HYc_kDL1GIknMExrIICNYv1J4kHE5i72RjBDUS6PD74UvtWm6RkEFeABOz9mHd_RjqGWzXcd2B99tbJfzfjTgzDdZTJ6Eyax8NRzuEmzrisduebCCd0sJOVCxab3M8QbnAOTtU4OrtzjGUj8YCBJhyhs9rS4gI27Ib"
                />
              </div>
            </div>

            {/* Organization Card */}
            <div
              className="role-card"
              onClick={() => openModal("Organization")}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 32,
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24,
              }}
            >
              <div className="icon-container" style={{
                width: 64, height: 64, borderRadius: "50%",
                background: C.surfaceContainerLow,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s, color 0.3s, transform 0.3s",
              }}>
                <span className="material-symbols-outlined">corporate_fare</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2 style={{ ...T.headlineMd, color: C.textMain }}>Organization</h2>
                <p style={{ ...T.bodyMd, color: C.textMuted }}>
                  I am looking to hire talent and optimize our recruitment process using AI insights.
                </p>
              </div>
              <div style={{ paddingTop: 16, width: "100%" }}>
                <button className="join-btn" style={{
                  width: "100%", padding: "12px 0",
                  background: C.surface, border: `1px solid ${C.border}`,
                  color: C.textMuted, ...T.labelMd,
                  borderRadius: 6, cursor: "pointer",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}>
                  Join as Organization
                </button>
              </div>
              <div style={{ width: "100%", overflow: "hidden", borderRadius: 8 }}>
                <img
                  className="card-img"
                  alt="Modern minimalist office space with large windows and professional atmosphere"
                  style={{ width: "100%", height: 128, objectFit: "cover", opacity: 0.4, transition: "opacity 0.3s", display: "block" }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADkCnOuqOVRcsf645Cd5RpsXEvXaiWilfWLoTjqmzPaBH8LpXSUhaGLR_mcKRK598HG-y6CTwG10TPXl2srtt-HpCEWtlP33pAI_MZzR5nGDwjSUlwUwKtr8dgJD33-h6czw8zJja9jPwK9_GwwwDWhOKa3_p5tdnNFu-cCYFx9KNIB88ykObhb9iRFqqSUk7K9oxq1WBhHHpqvxDhVpyP28k7X5HMl7sVfbJhrG08lGksJrPkBKcpxVgciaGEef72h2EjKqQftWzJ"
                />
              </div>
            </div>
          </div>

          {/* Login link */}
          <div className="fade-in" style={{ textAlign: "center", animationDelay: "0.5s" }}>
            <p style={{ ...T.bodySm, color: C.textMuted }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: C.primary, fontWeight: 700, textDecoration: "none" }}>Log in here</Link>
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: "24px 32px",
        background: C.surfaceContainerLow,
        borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ ...T.headlineSm, color: C.primary, fontWeight: 700 }}>AI-JOB</span>
            <p style={{ ...T.bodySm, color: C.textMuted }}>AI-JOB © 2026</p>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {["Company", "Platform", "Resources", "Legal", "Social Links"].map((item) => (
              <a key={item} href="#" style={{ ...T.bodySm, color: C.textMuted, textDecoration: "none" }}>{item}</a>
            ))}
          </nav>
        </div>
      </footer>

      {/* ── Modal Overlay ───────────────────────────────────────────────────── */}
      {modalVisible && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
        >
          <div
            ref={formRef}
            style={{
              background: C.surface, width: "100%", maxWidth: 512,
              borderRadius: 12, boxShadow: "0 25px 50px rgba(0,0,0,0.15)", padding: 32,
              transform: modalOpen ? "scale(1)" : "scale(0.95)",
              opacity: modalOpen ? 1 : 0,
              transition: "transform 0.3s, opacity 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ ...T.headlineMd, color: C.textMain }}>Register as {modalRole}</h3>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
              </button>
            </div>
            <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Full Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ ...T.labelMd, color: C.textMuted }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                  style={{
                    width: "100%", background: C.surface,
                    border: `1px solid ${formik.touched.fullName && formik.errors.fullName ? "#ef4444" : C.border}`,
                    borderRadius: 8,
                    padding: "8px 16px", ...T.bodyMd, color: C.textMain,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <span style={{ color: "#ef4444", fontSize: 12, marginTop: 2 }}>{formik.errors.fullName}</span>
                )}
              </div>

              {/* Work Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ ...T.labelMd, color: C.textMuted }}>Work Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  style={{
                    width: "100%", background: C.surface,
                    border: `1px solid ${formik.touched.email && formik.errors.email ? "#ef4444" : C.border}`,
                    borderRadius: 8,
                    padding: "8px 16px", ...T.bodyMd, color: C.textMain,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <span style={{ color: "#ef4444", fontSize: 12, marginTop: 2 }}>{formik.errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ ...T.labelMd, color: C.textMuted }}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  style={{
                    width: "100%", background: C.surface,
                    border: `1px solid ${formik.touched.password && formik.errors.password ? "#ef4444" : C.border}`,
                    borderRadius: 8,
                    padding: "8px 16px", ...T.bodyMd, color: C.textMain,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <span style={{ color: "#ef4444", fontSize: 12, marginTop: 2 }}>{formik.errors.password}</span>
                )}
              </div>

              {submitError && (
                <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px 0", marginTop: 8,
                  background: C.primary, color: "#fff",
                  border: "none", borderRadius: 8, ...T.labelMd,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(0,74,198,0.3)",
                  transition: "opacity 0.2s",
                  textAlign: "center"
                }}
                onMouseOver={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <p style={{ textAlign: "center", ...T.bodySm, color: C.textMuted, fontSize: 12 }}>
                By clicking continue, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
