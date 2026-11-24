const { useState, useEffect, useCallback } = React;
// Component con: ô tìm kiếm. Giá trị được quản lý tập trung tại App.
function SearchForm({ onChangeValue }) {
    return (React.createElement("div", { className: "search-row" },
        React.createElement("label", { className: "sr-only", htmlFor: "user-search" }, "T\u00ECm ng\u01B0\u1EDDi d\u00F9ng"),
        React.createElement("input", { id: "user-search", type: "search", placeholder: "T\u00ECm theo name ho\u1EB7c username...", onChange: (event) => onChangeValue(event.target.value) })));
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
        }
        else {
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
    return (React.createElement("section", { className: "panel add-panel" },
        React.createElement("div", { className: "panel-heading" },
            React.createElement("div", null,
                React.createElement("p", { className: "eyebrow" }, "DANH B\u1EA0"),
                React.createElement("h2", null, "Th\u00EAm ng\u01B0\u1EDDi d\u00F9ng")),
            React.createElement("button", { className: "button button-primary", type: "button", onClick: () => setAdding(true) }, "+ Th\u00EAm m\u1EDBi")),
        adding && (React.createElement("form", { className: "user-form", onSubmit: handleAdd },
            React.createElement("div", { className: "form-grid" },
                React.createElement("label", null,
                    "Name *",
                    React.createElement("input", { id: "name", value: user.name, onChange: handleChange, required: true })),
                React.createElement("label", null,
                    "Username *",
                    React.createElement("input", { id: "username", value: user.username, onChange: handleChange, required: true })),
                React.createElement("label", null,
                    "Email",
                    React.createElement("input", { id: "email", type: "email", value: user.email, onChange: handleChange })),
                React.createElement("label", null,
                    "Street",
                    React.createElement("input", { id: "street", value: user.address.street, onChange: handleChange })),
                React.createElement("label", null,
                    "Suite",
                    React.createElement("input", { id: "suite", value: user.address.suite, onChange: handleChange })),
                React.createElement("label", null,
                    "City",
                    React.createElement("input", { id: "city", value: user.address.city, onChange: handleChange })),
                React.createElement("label", null,
                    "Phone",
                    React.createElement("input", { id: "phone", value: user.phone, onChange: handleChange })),
                React.createElement("label", null,
                    "Website",
                    React.createElement("input", { id: "website", value: user.website, onChange: handleChange }))),
            React.createElement("div", { className: "form-actions" },
                React.createElement("button", { className: "button button-primary", type: "submit" }, "L\u01B0u ng\u01B0\u1EDDi d\u00F9ng"),
                React.createElement("button", { className: "button button-light", type: "button", onClick: () => { setAdding(false); setUser(emptyUser()); } }, "H\u1EE7y")),
            React.createElement("p", { className: "hint" }, "* Name v\u00E0 Username l\u00E0 hai tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c.")))));
}
// Component con: tải dữ liệu, tìm kiếm, hiển thị, sửa và xóa.
function ResultTable({ keyword, user, onAdded }) {
    var _a, _b, _c;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(null);
    // Tải dữ liệu từ API một lần khi component được mount.
    useEffect(() => {
        let isMounted = true;
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => {
            if (!response.ok)
                throw new Error("Không thể tải danh sách người dùng.");
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
    const filteredUsers = users.filter((item) => (item.name || "").toLowerCase().includes(normalizedKeyword) ||
        (item.username || "").toLowerCase().includes(normalizedKeyword));
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
        }
        else {
            setEditing((previous) => ({ ...previous, [field]: value }));
        }
    }
    function saveUser(event) {
        event.preventDefault();
        if (!editing.name.trim() || !editing.username.trim()) {
            window.alert("Vui lòng nhập Name và Username!");
            return;
        }
        setUsers((previous) => previous.map((item) => item.id === editing.id
            ? { ...editing, address: { ...(editing.address || {}) } }
            : item));
        setEditing(null);
    }
    function removeUser(id) {
        setUsers((previous) => previous.filter((item) => item.id !== id));
    }
    if (loading) {
        return React.createElement("section", { className: "panel state-message" }, "\u0110ang t\u1EA3i danh s\u00E1ch ng\u01B0\u1EDDi d\u00F9ng...");
    }
    if (error) {
        return React.createElement("section", { className: "panel error-message" },
            "L\u1ED7i: ",
            error,
            " Vui l\u00F2ng t\u1EA3i l\u1EA1i trang \u0111\u1EC3 th\u1EED l\u1EA1i.");
    }
    return (React.createElement("section", { className: "panel" },
        React.createElement("div", { className: "panel-heading table-heading" },
            React.createElement("div", null,
                React.createElement("p", { className: "eyebrow" }, "QU\u1EA2N L\u00DD D\u1EEE LI\u1EC6U"),
                React.createElement("h2", null, "Danh s\u00E1ch ng\u01B0\u1EDDi d\u00F9ng")),
            React.createElement("span", { className: "count-pill" },
                filteredUsers.length,
                " / ",
                users.length,
                " ng\u01B0\u1EDDi d\u00F9ng")),
        React.createElement("div", { className: "table-wrap" },
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "ID"),
                        React.createElement("th", null, "H\u1ECD t\u00EAn"),
                        React.createElement("th", null, "Username"),
                        React.createElement("th", null, "Email"),
                        React.createElement("th", null, "\u0110\u1ECBa ch\u1EC9"),
                        React.createElement("th", null, "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"),
                        React.createElement("th", null, "Thao t\u00E1c"))),
                React.createElement("tbody", null,
                    filteredUsers.map((item) => {
                        var _a, _b, _c;
                        return (React.createElement("tr", { key: item.id },
                            React.createElement("td", null, item.id),
                            React.createElement("td", { className: "name-cell" }, item.name),
                            React.createElement("td", null, item.username),
                            React.createElement("td", null, item.email),
                            React.createElement("td", null, (_a = item.address) === null || _a === void 0 ? void 0 :
                                _a.street,
                                ", ", (_b = item.address) === null || _b === void 0 ? void 0 :
                                _b.suite,
                                ", ", (_c = item.address) === null || _c === void 0 ? void 0 :
                                _c.city),
                            React.createElement("td", null, item.phone),
                            React.createElement("td", null,
                                React.createElement("div", { className: "row-actions" },
                                    React.createElement("button", { className: "button button-small button-edit", onClick: () => editUser(item) }, "S\u1EEDa"),
                                    React.createElement("button", { className: "button button-small button-delete", onClick: () => removeUser(item.id) }, "X\u00F3a")))));
                    }),
                    filteredUsers.length === 0 && (React.createElement("tr", null,
                        React.createElement("td", { className: "empty-row", colSpan: "7" }, "Kh\u00F4ng t\u00ECm th\u1EA5y ng\u01B0\u1EDDi d\u00F9ng ph\u00F9 h\u1EE3p.")))))),
        editing && (React.createElement("div", { className: "modal-overlay", role: "presentation", onMouseDown: (event) => {
                if (event.target === event.currentTarget)
                    setEditing(null);
            } },
            React.createElement("form", { className: "modal-content", onSubmit: saveUser },
                React.createElement("div", { className: "panel-heading" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "eyebrow" }, "C\u1EACP NH\u1EACT"),
                        React.createElement("h2", null, "S\u1EEDa ng\u01B0\u1EDDi d\u00F9ng")),
                    React.createElement("button", { type: "button", className: "icon-button", "aria-label": "\u0110\u00F3ng", onClick: () => setEditing(null) }, "\u00D7")),
                React.createElement("div", { className: "form-grid" },
                    React.createElement("label", null,
                        "Name *",
                        React.createElement("input", { value: editing.name, onChange: (e) => handleEditChange("name", e.target.value), required: true })),
                    React.createElement("label", null,
                        "Username *",
                        React.createElement("input", { value: editing.username, onChange: (e) => handleEditChange("username", e.target.value), required: true })),
                    React.createElement("label", null,
                        "Email",
                        React.createElement("input", { type: "email", value: editing.email || "", onChange: (e) => handleEditChange("email", e.target.value) })),
                    React.createElement("label", null,
                        "Street",
                        React.createElement("input", { value: ((_a = editing.address) === null || _a === void 0 ? void 0 : _a.street) || "", onChange: (e) => handleEditChange("street", e.target.value) })),
                    React.createElement("label", null,
                        "Suite",
                        React.createElement("input", { value: ((_b = editing.address) === null || _b === void 0 ? void 0 : _b.suite) || "", onChange: (e) => handleEditChange("suite", e.target.value) })),
                    React.createElement("label", null,
                        "City",
                        React.createElement("input", { value: ((_c = editing.address) === null || _c === void 0 ? void 0 : _c.city) || "", onChange: (e) => handleEditChange("city", e.target.value) })),
                    React.createElement("label", null,
                        "Phone",
                        React.createElement("input", { value: editing.phone || "", onChange: (e) => handleEditChange("phone", e.target.value) })),
                    React.createElement("label", null,
                        "Website",
                        React.createElement("input", { value: editing.website || "", onChange: (e) => handleEditChange("website", e.target.value) }))),
                React.createElement("div", { className: "form-actions" },
                    React.createElement("button", { className: "button button-primary", type: "submit" }, "L\u01B0u thay \u0111\u1ED5i"),
                    React.createElement("button", { className: "button button-light", type: "button", onClick: () => setEditing(null) }, "H\u1EE7y")))))));
}
// Component cha: quản lý state dùng chung và truyền props xuống các component con.
function App() {
    const [kw, setKeyword] = useState("");
    const [newUser, setNewUser] = useState(null);
    const handleAdded = useCallback(() => setNewUser(null), []);
    return (React.createElement("main", { className: "app-shell" },
        React.createElement("header", { className: "hero" },
            React.createElement("div", { className: "hero-mark" }, "USER MANAGEMENT / REACT CRUD"),
            React.createElement("h1", null, "Qu\u1EA3n l\u00FD ng\u01B0\u1EDDi d\u00F9ng"),
            React.createElement("p", null, "Th\u00EAm, t\u00ECm ki\u1EBFm, ch\u1EC9nh s\u1EEDa v\u00E0 x\u00F3a th\u00F4ng tin ng\u01B0\u1EDDi d\u00F9ng trong m\u1ED9t giao di\u1EC7n.")),
        React.createElement("div", { className: "toolbar-grid" },
            React.createElement("section", { className: "panel search-panel" },
                React.createElement("p", { className: "eyebrow" }, "T\u00CCM KI\u1EBEM"),
                React.createElement("h2", null, "Tra c\u1EE9u danh b\u1EA1"),
                React.createElement(SearchForm, { onChangeValue: setKeyword }),
                React.createElement("p", { className: "help-text" }, "T\u00ECm theo h\u1ECD t\u00EAn ho\u1EB7c username. K\u1EBFt qu\u1EA3 c\u1EADp nh\u1EADt khi nh\u1EADp.")),
            React.createElement(AddUser, { onAdd: setNewUser })),
        React.createElement(ResultTable, { keyword: kw, user: newUser, onAdded: handleAdded }),
        React.createElement("footer", { className: "footer" }, "B\u00E0i th\u1EF1c h\u00E0nh React c\u01A1 b\u1EA3n \u00B7 CRUD \u00B7 State Lifting")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App, null));
