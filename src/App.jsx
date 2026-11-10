import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard, Users, UserPlus, Settings, Search, Bell, ChevronDown,
  MoreHorizontal, ArrowUpRight, BriefcaseBusiness, Clock3, CircleCheck,
  Menu, X, Plus, RefreshCw, Pencil, Trash2, Mail, Building2, Sparkles
} from "lucide-react";

const API_URL = "http://localhost:5000";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "NA";

const colors = ["lavender", "peach", "mint", "blue", "pink"];

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [form, setForm] = useState({ name: "", role: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);

  async function loadEmployees() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/employees`);
      const data = response.data;
      if (!Array.isArray(data)) throw new Error("GET /employees should return an array.");
      setEmployees(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not connect to the backend. Make sure your Express server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  const filteredEmployees = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return employees;
    return employees.filter((employee) =>
      `${employee.name} ${employee.role} ${employee.id}`.toLowerCase().includes(term)
    );
  }, [employees, search]);

  function openAddEmployeeModal() {
    setEditingEmployee(null);
    setForm({ name: "", role: "" });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function editEmployee(employee) {
    setEditingEmployee(employee);
    setForm({
      name: employee.name || "",
      role: employee.role || ""
    });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function closeEmployeeModal() {
    setModalOpen(false);
    setEditingEmployee(null);
    setForm({ name: "", role: "" });
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const isEditing = editingEmployee !== null;
    const url = isEditing
      ? `${API_URL}/employees/${editingEmployee.id}`
      : `${API_URL}/employees`;

    try {
      const response = isEditing
        ? await axios.put(url, form)
        : await axios.post(url, form);

      const data = response.data;

      closeEmployeeModal();
      setNotice(isEditing ? "Employee updated successfully." : "Employee added successfully.");
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        (isEditing ? "Unable to update employee." : "Unable to add employee.")
      );
    }
  }

  const activeCount = employees.length;
  const developerCount = employees.filter((e) => /developer|engineer/i.test(e.role || "")).length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Users size={21} strokeWidth={2.5} /></div>
          <span>people<span className="brand-light">desk</span></span>
          <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={18} /> <span>Overview</span></a>
          <a className="nav-item" href="#employees"><Users size={18} /> <span>Employees</span><span className="nav-count">{employees.length}</span></a>
          <button className="nav-item" onClick={openAddEmployeeModal}><UserPlus size={18} /> <span>Add employee</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Sparkles size={17} /></div>
            <strong>Your team, in sync.</strong>
            <p>Keep employee information organised in one place.</p>
          </div>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
          <div className="profile">
            <div className="profile-avatar">RB</div>
            <div className="profile-copy"><strong>Raghu Babu</strong><span>Administrator</span></div>
            <MoreHorizontal size={19} className="profile-more" />
          </div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-actions">
            <div className="date-chip"><span className="status-dot" /> Workspace active</div>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="top-avatar">RB</div>
            <ChevronDown size={16} className="muted-icon" />
          </div>
        </header>

        <section className="page-wrap">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">MONDAY, YOUR WORKSPACE</div>
              <h1>Good morning, Raghu <span>✦</span></h1>
              <p className="subtitle">Here’s what’s happening with your team today.</p>
            </div>
            <button className="primary-button" onClick={openAddEmployeeModal}><Plus size={18} /> Add employee</button>
          </div>

          {error && <div className="alert error-alert"><span>{error}</span><button onClick={loadEmployees}><RefreshCw size={15} /> Retry</button></div>}
          {notice && <div className="alert success-alert"><CircleCheck size={17} /> {notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}

          <div className="stats-grid">
            <StatCard icon={<Users size={19} />} label="Total employees" value={loading ? "—" : activeCount} note="People in your workspace" tone="purple" />
            <StatCard icon={<BriefcaseBusiness size={19} />} label="Developer roles" value={loading ? "—" : developerCount} note="Based on current job titles" tone="orange" />
            <StatCard icon={<CircleCheck size={19} />} label="API connection" value={error ? "Offline" : loading ? "Checking" : "Connected"} note="Express · Port 5000" tone="green" />
            <StatCard icon={<Clock3 size={19} />} label="Last synced" value={loading ? "—" : "Just now"} note="Refresh to fetch latest data" tone="blue" />
          </div>

          <section className="panel employee-panel" id="employees">
            <div className="panel-heading">
              <div>
                <div className="section-kicker">PEOPLE DIRECTORY</div>
                <h2>All employees <span className="total-pill">{employees.length}</span></h2>
                <p>Manage and keep track of everyone on your team.</p>
              </div>
              <button className="secondary-button" onClick={loadEmployees}><RefreshCw size={16} /> Refresh</button>
            </div>
            <div className="table-toolbar">
              <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, role or ID..." /></div>
              <span className="results-label">{filteredEmployees.length} results</span>
            </div>

            <div className="table-scroll">
              
              <table>
                <thead><tr><th>EMPLOYEE</th><th>EMPLOYEE ID</th><th>ROLE / POSITION</th><th>STATUS</th><th className="action-heading">ACTION</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="empty-state">Loading employees…</td></tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state">{search ? "No employees match your search." : "No employees yet. Add your first team member."}</td></tr>
                  ) : filteredEmployees.map((employee, index) => (
                    <tr key={employee.id ?? index}>
                      <td><div className="employee-cell"><div className={`employee-avatar ${colors[index % colors.length]}`}>{initials(employee.name)}</div><div><strong>{employee.name}</strong><span><Mail size={12} /> Team member</span></div></div></td>
                      <td><span className="id-label">EMP-{String(employee.empNo).padStart(3, "0")}</span></td>
                      <td><div className="role-cell"><Building2 size={15} /> {employee.role || "Not specified"}</div></td>
                      <td><span className="active-badge"><i /> Active</span></td>
                      <td>
                        <button
                          className="row-action"
                          title={`Edit ${employee.name}`}
                          aria-label={`Edit ${employee.name}`}
                          onClick={() => editEmployee(employee)}
                        >
                          <Pencil size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees</span><span className="footer-live"><i /> Live from your API</span></div>
          </section>
          <footer className="footer"><span>© 2026 PeopleDesk</span><span>Built with React + Express</span></footer>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeEmployeeModal(); }}>
          <form className="modal" onSubmit={saveEmployee}>
            <div className="modal-top"><div className="modal-icon">{editingEmployee ? <Pencil size={21} /> : <UserPlus size={21} />}</div><button type="button" className="icon-button" onClick={closeEmployeeModal} aria-label="Close"><X size={19} /></button></div>
            <div className="section-kicker">{editingEmployee ? "UPDATE TEAM MEMBER" : "NEW TEAM MEMBER"}</div>
            <h2>{editingEmployee ? "Edit employee" : "Add an employee"}</h2>
            <p className="modal-description">{editingEmployee ? "Update this employee’s information." : "Add someone new to your workspace directory."}</p>
            <label>Full name<input autoFocus required minLength="2" placeholder="e.g. Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Role / position<input required placeholder="e.g. Frontend Developer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeEmployeeModal}>Cancel</button><button className="primary-button" type="submit">{editingEmployee ? <><Pencil size={17} /> Update employee</> : <><Plus size={17} /> Save employee</>}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note} <ArrowUpRight size={13} /></div>
    </div>
  );
}

export default App;
