/* BÀI B — Lọc tin và đăng tin nhanh (news.html)
   Không sửa news.html hoặc CSS. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter.
document.querySelector("#searchbar form").addEventListener(
    "submit",
    (e) => e.preventDefault()
);

// ---------- LẤY CÁC PHẦN TỬ HTML ----------
const oTimKiem = document.querySelector("#o-tim-kiem");
const dsTin = document.querySelector("#list");
const boDem = document.querySelector("#bo-dem");
const khongThay = document.querySelector("#khong-thay");

const oTieuDe = document.querySelector("#tin-tieu-de");
const oNoiDung = document.querySelector("#tin-noi-dung");
const nutDang = document.querySelector("#nut-dang");
const baoLoi = document.querySelector("#bao-loi");

// ---------- F1. BỘ ĐẾM ----------
function capNhatBoDem() {
    const cacTin = dsTin.querySelectorAll("li");
    let soTinHien = 0;

    for (const tin of cacTin) {
        if (!tin.classList.contains("an")) {
            soTinHien++;
        }
    }

    boDem.textContent =
        `Đang hiển thị ${soTinHien}/${cacTin.length} tin`;
}

// ---------- F2 + F3. LỌC TIN VÀ THÔNG BÁO ----------
function locTin() {
    const tuKhoaGoc = oTimKiem.value;
    const tuKhoa = tuKhoaGoc.trim().toLowerCase();

    const cacTin = dsTin.querySelectorAll("li");
    let soTinKhop = 0;

    for (const tin of cacTin) {
        const tieuDe = tin.querySelector("h3").textContent;
        const noiDung = tin.querySelector("p").textContent;

        const khop =
            tuKhoa === "" ||
            tieuDe.toLowerCase().includes(tuKhoa) ||
            noiDung.toLowerCase().includes(tuKhoa);

        if (khop) {
            tin.classList.remove("an");
            soTinKhop++;
        } else {
            tin.classList.add("an");
        }
    }

    if (soTinKhop === 0) {
        khongThay.classList.remove("an");
        khongThay.textContent =
            `Không tìm thấy tin nào cho "${tuKhoaGoc}"`;
    } else {
        khongThay.classList.add("an");
        khongThay.textContent = "";
    }

    capNhatBoDem();
}

// Lọc tin khi người dùng gõ.
oTimKiem.addEventListener("keyup", locTin);

// ---------- F4. MỞ RỘNG / THU GỌN TIN ----------
// Chỉ đăng ký một trình lắng nghe click trên #list.
dsTin.addEventListener("click", (e) => {
    // Chỉ xử lý khi bấm đúng nút Read more hoặc Thu gọn.
    const nut = e.target.closest("button.more");

    if (!nut || !dsTin.contains(nut)) {
        return;
    }

    const tin = nut.closest("li");
    const doanVan = tin.querySelector("p");

    if (!doanVan) {
        return;
    }

    if (doanVan.classList.contains("day-du")) {
        doanVan.classList.remove("day-du");
        nut.textContent = "Read more >>";
    } else {
        doanVan.classList.add("day-du");
        nut.textContent = "Thu gọn <<";
    }
});

// ---------- F5. ĐĂNG TIN NHANH ----------
nutDang.addEventListener("click", () => {
    const tieuDe = oTieuDe.value;
    const noiDung = oNoiDung.value;

    // Kiểm tra tiêu đề và nội dung.
    if (tieuDe.trim() === "" || noiDung.trim() === "") {
        baoLoi.textContent =
            "Vui lòng nhập đủ tiêu đề và nội dung.";
        return;
    }

    // Tạo các phần tử HTML bằng DOM.
    // Không dùng innerHTML để tránh diễn giải input
    // của người dùng thành mã HTML hoặc JavaScript.
    const tinMoi = document.createElement("li");

    const ngay = document.createElement("span");
    ngay.className = "time";
    ngay.textContent = homNay();

    const tieuDeMoi = document.createElement("h3");
    tieuDeMoi.textContent = tieuDe;

    const noiDungMoi = document.createElement("p");
    noiDungMoi.textContent = noiDung;

    const nutMoRong = document.createElement("button");
    nutMoRong.type = "button";
    nutMoRong.className = "more";
    nutMoRong.textContent = "Read more >>";

    // Giữ cấu trúc giống các tin có sẵn.
    tinMoi.append(
        ngay,
        tieuDeMoi,
        noiDungMoi,
        nutMoRong
    );

    // Chèn tin mới vào đầu danh sách.
    dsTin.prepend(tinMoi);

    // Xoá nội dung hai ô nhập và thông báo lỗi.
    oTieuDe.value = "";
    oNoiDung.value = "";
    baoLoi.textContent = "";

    // Áp dụng lại bộ lọc hiện tại và cập nhật bộ đếm.
    // Tin mới không khớp từ khóa sẽ bị ẩn ngay.
    locTin();
});

// ---------- KHỞI TẠO KHI TẢI TRANG ----------
// Cập nhật bộ đếm ngay khi trang được mở.
locTin();