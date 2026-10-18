/* BÀI A — Thư viện ảnh tương tác */

// ---------- Phần 1: Tìm phần tử ----------
const anhLon = document.querySelector("#gallery > div > img");
const dsAnhNho = document.querySelectorAll("#gallery ul li img");
const khungAnhNho = document.querySelector("#gallery ul");
const oTimKiem = document.getElementById("o-tim-kiem");

console.log(dsAnhNho.length); // in ra: 6

// ---------- Phần 2: Đi lại trên cây DOM ----------
console.log(khungAnhNho.firstChild.nodeType); // in ra: 3
console.log(khungAnhNho.childNodes.length);   // in ra: 13

console.log(dsAnhNho[0].parentNode.nodeName); // in ra: LI

// ---------- Phần 3: Tạo và chèn phần tử ----------
const chuThich = document.createElement("p");
chuThich.id = "chu-thich";
chuThich.textContent = "Bấm vào ảnh nhỏ để đổi ảnh lớn.";
anhLon.parentNode.appendChild(chuThich);

// ---------- Phần 4: Một trình lắng nghe cho cả 6 ảnh nhỏ ----------
function doiAnh(e) {
    // Bấm vào khoảng trống hoặc mép li thì không làm gì.
    if (e.target.nodeName !== "IMG") {
        return;
    }

    anhLon.src = `images/${e.target.alt}.jpg`;
    chuThich.textContent = `Đang xem: ${e.target.alt}.jpg`;

    // Bỏ lớp đang chọn ở tất cả ảnh nhỏ.
    for (const anh of dsAnhNho) {
        anh.parentNode.className = "";
    }

    // Đánh dấu ảnh nhỏ vừa bấm.
    e.target.parentNode.className = "dang-chon";
}

khungAnhNho.addEventListener("click", doiAnh);

// Nếu gọi doiAnh() ngay khi đăng ký, sẽ báo TypeError.
// Đáp án: B

// ---------- Phần 5: Thay inline JS của ô tìm kiếm ----------
const GOI_Y = "Enter search query";

oTimKiem.addEventListener("focus", () => {
    if (oTimKiem.value === GOI_Y) {
        oTimKiem.value = "";
    }
});

oTimKiem.addEventListener("blur", () => {
    if (oTimKiem.value === "") {
        oTimKiem.value = GOI_Y;
    }
});

// ---------- Phần 6: Gỡ trình lắng nghe ----------
const nutKhoa = document.getElementById("nut-khoa");

nutKhoa.addEventListener("click", (e) => {
    khungAnhNho.removeEventListener("click", doiAnh);
    chuThich.textContent = "Thư viện ảnh đã khoá.";

    console.log(e.type);      // in ra: click
    console.log(e.target.id); // in ra: nut-khoa
});

// Dùng một hàm mũi tên vô danh mới để gỡ hàm mũi tên
// vô danh đã đăng ký trước đó sẽ không gỡ được.
// Đáp án: không

// ---------- Phần 7: Thêm một mục vào cột bên phải ----------
const dsBaiViet = document.querySelector("#posts ul");
const mucMoi = document.createElement("li");
const tieuDe = document.createElement("h5");

tieuDe.textContent = "Khuyến mãi <b>thiệp cưới</b>";
mucMoi.append(tieuDe);

dsBaiViet.prepend(mucMoi);

// Chữ hiện nguyên cả cặp thẻ <b>…</b>, không được in đậm.
console.log(dsBaiViet.querySelectorAll("li").length); // in ra: 3