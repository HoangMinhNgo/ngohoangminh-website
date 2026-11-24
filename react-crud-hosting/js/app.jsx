const { useState, useEffect, useCallback } = React;

// Component con: ô tìm kiếm. Giá trị được quản lý tập trung tại App.
function SearchForm({ onChangeValue }) {
  return (
    <div className="search-row">
      <label className="sr-only" htmlFor="user-search">Tìm người dùng</label>
      <input
        id="user-search"
        type="search"
        placeholder="Tìm theo name hoặc username..."
        onChange={(event) => onChangeValue(event.target.value)}
      />
    </div>
  );
}

const emptyUser = () => ({
  name: "",
  username: "",
  email: "",
  address: { street: "", suite: "", city: "" },
  phone: "",
  website: ""
});

// Component con: form thêm người dùng.
function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState(emptyUser);

  function handleChange(event) {
    const { id, value } = event.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser((previous) => ({
        ...previous,
        address: { ...previous.address, [id]: value }
      }));
    } else {
      setUser((previous) => ({ ...previous, [id]: value }));
    }
  }

  function handleAdd(event) {
    event.preventDefault();
    if (!user.name.trim() || !user.username.trim()) {
      window.alert("Vui lòng nhập Name và Username!");
      return;
    }

    // Gửi một bản sao lên App, không chia sẻ object state nội bộ của form.
    onAdd({ ...user, address: { ...user.address } });
    setUser(emptyUser());
    setAdding(false);
  }

  return (
    <section className="panel add-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">DANH BẠ</p>
          <h2>Thêm người dùng</h2>
        </div>
        <button className="button button-primary" type="button" onClick={() => setAdding(true)}>
          + Thêm mới
        </button>
      </div>

      {adding && (
        <form className="user-form" onSubmit={handleAdd}>
          <div className="form-grid">
            <label>Name *<input id="name" value={user.name} onChange={handleChange} required /></label>
            <label>Username *<input id="username" value={user.username} onChange={handleChange} required /></label>
            <label>Email<input id="email" type="email" value={user.email} onChange={handleChange} /></label>
            <label>Street<input id="street" value={user.address.street} onChange={handleChange} /></label>
            <label>Suite<input id="suite" value={user.address.suite} onChange={handleChange} /></label>
            <label>City<input id="city" value={user.address.city} onChange={handleChange} /></label>
            <label>Phone<input id="phone" value={user.phone} onChange={handleChange} /></label>
            <label>Website<input id="website" value={user.website} onChange={handleChange} /></label>
          </div>
          <div className="form-actions">
            <button className="button button-primary" type="submit">Lưu người dùng</button>
            <button className="button button-light" type="button" onClick={() => { setAdding(false); setUser(emptyUser()); }}>
              Hủy
            </button>
          </div>
          <p className="hint">* Name và Username là hai trường bắt buộc.</p>
        </form>
      )}
    </section>
  );
}

// Component con: tải dữ liệu, tìm kiếm, hiển thị, sửa và xóa.
function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  // Tải dữ liệu từ API một lần khi component được mount.
  useEffect(() => {
    let isMounted = true;

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải danh sách người dùng.");
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  // Khi App gửi user mới xuống, thêm user vào danh sách.
  useEffect(() => {
    if (user) {
      setUsers((previous) => {
        const nextId = previous.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
        return [...previous, { ...user, address: { ...user.address }, id: nextId }];
      });
      onAdded();
    }
  }, [user, onAdded]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredUsers = users.filter((item) =>
    (item.name || "").toLowerCase().includes(normalizedKeyword) ||
    (item.username || "").toLowerCase().includes(normalizedKeyword)
  );

  function editUser(item) {
    // Deep copy object address để form sửa không làm đổi dữ liệu gốc.
    setEditing({ ...item, address: { ...(item.address || {}) } });
  }

  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing((previous) => ({
        ...previous,
        address: { ...(previous.address || {}), [field]: value }
      }));
    } else {
      setEditing((previous) => ({ ...previous, [field]: value }));
    }
  }

  function saveUser(event) {
    event.preventDefault();
    if (!editing.name.trim() || !editing.username.trim()) {
      window.alert("Vui lòng nhập Name và Username!");
      return;
    }
    setUsers((previous) => previous.map((item) =>
      item.id === editing.id
        ? { ...editing, address: { ...(editing.address || {}) } }
        : item
    ));
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((previous) => previous.filter((item) => item.id !== id));
  }

  if (loading) {
    return <section className="panel state-message">Đang tải danh sách người dùng...</section>;
  }

  if (error) {
    return <section className="panel error-message">Lỗi: {error} Vui lòng tải lại trang để thử lại.</section>;
  }

  return (
    <section className="panel">
      <div className="panel-heading table-heading">
        <div>
          <p className="eyebrow">QUẢN LÝ DỮ LIỆU</p>
          <h2>Danh sách người dùng</h2>
        </div>
        <span className="count-pill">{filteredUsers.length} / {users.length} người dùng</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Username</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="name-cell">{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.address?.street}, {item.address?.suite}, {item.address?.city}</td>
                <td>{item.phone}</td>
                <td>
                  <div className="row-actions">
                    <button className="button button-small button-edit" onClick={() => editUser(item)}>Sửa</button>
                    <button className="button button-small button-delete" onClick={() => removeUser(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td className="empty-row" colSpan="7">Không tìm thấy người dùng phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditing(null);
        }}>
          <form className="modal-content" onSubmit={saveUser}>
            <div className="panel-heading">
              <div><p className="eyebrow">CẬP NHẬT</p><h2>Sửa người dùng</h2></div>
              <button type="button" className="icon-button" aria-label="Đóng" onClick={() => setEditing(null)}>×</button>
            </div>
            <div className="form-grid">
              <label>Name *<input value={editing.name} onChange={(e) => handleEditChange("name", e.target.value)} required /></label>
              <label>Username *<input value={editing.username} onChange={(e) => handleEditChange("username", e.target.value)} required /></label>
              <label>Email<input type="email" value={editing.email || ""} onChange={(e) => handleEditChange("email", e.target.value)} /></label>
              <label>Street<input value={editing.address?.street || ""} onChange={(e) => handleEditChange("street", e.target.value)} /></label>
              <label>Suite<input value={editing.address?.suite || ""} onChange={(e) => handleEditChange("suite", e.target.value)} /></label>
              <label>City<input value={editing.address?.city || ""} onChange={(e) => handleEditChange("city", e.target.value)} /></label>
              <label>Phone<input value={editing.phone || ""} onChange={(e) => handleEditChange("phone", e.target.value)} /></label>
              <label>Website<input value={editing.website || ""} onChange={(e) => handleEditChange("website", e.target.value)} /></label>
            </div>
            <div className="form-actions">
              <button className="button button-primary" type="submit">Lưu thay đổi</button>
              <button className="button button-light" type="button" onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

// Component cha: quản lý state dùng chung và truyền props xuống các component con.
function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);
  const handleAdded = useCallback(() => setNewUser(null), []);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-mark">USER MANAGEMENT / REACT CRUD</div>
        <h1>Quản lý người dùng</h1>
        <p>Thêm, tìm kiếm, chỉnh sửa và xóa thông tin người dùng trong một giao diện.</p>
      </header>

      <div className="toolbar-grid">
        <section className="panel search-panel">
          <p className="eyebrow">TÌM KIẾM</p>
          <h2>Tra cứu danh bạ</h2>
          <SearchForm onChangeValue={setKeyword} />
          <p className="help-text">Tìm theo họ tên hoặc username. Kết quả cập nhật khi nhập.</p>
        </section>
        <AddUser onAdd={setNewUser} />
      </div>

      <ResultTable keyword={kw} user={newUser} onAdded={handleAdded} />
      <footer className="footer">Bài thực hành React cơ bản · CRUD · State Lifting</footer>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
