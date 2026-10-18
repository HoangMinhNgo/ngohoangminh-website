/* BÀI B — Giỏ hàng của xưởng in
   Hoàn thiện class GioHang và hàm napGioHang. */

// ---------- DỮ LIỆU ĐÃ CHO (không sửa) ----------
const DANH_MUC = [
    { id: "TC01", ten: "Thiệp cưới cotton", loai: "thiep cuoi", gia: 1500 },
    { id: "TC02", ten: "Thiệp cưới kraft", loai: "thiep cuoi", gia: 900 },
    { id: "DT01", ten: "Danh thiếp ép kim", loai: "danh thiep", gia: 1200 },
    { id: "PB01", ten: "Phong bì lót lụa", loai: "phu kien", gia: 500 }
];

// ---------- PHẦN BẠN VIẾT ----------
class GioHang {
    constructor() {
        // Mỗi dòng gồm đúng 5 thuộc tính.
        this.dsDong = [];
    }

    // 1. Thêm sản phẩm vào giỏ.
    them(sanPham, soLuong) {
        // Số lượng phải là number, số nguyên và lớn hơn 0.
        if (
            typeof soLuong !== "number" ||
            !Number.isInteger(soLuong) ||
            soLuong <= 0
        ) {
            return false;
        }

        // Tìm sản phẩm đã có trong giỏ theo id.
        const dongCu = this.dsDong.find(
            dong => dong.id === sanPham.id
        );

        if (dongCu) {
            // Đã có thì cộng dồn số lượng.
            dongCu.soLuong += soLuong;
        } else {
            // Chưa có thì tạo object mới, không giữ tham chiếu
            // tới object sản phẩm bên ngoài.
            this.dsDong.push({
                id: sanPham.id,
                ten: sanPham.ten,
                loai: sanPham.loai,
                gia: sanPham.gia,
                soLuong: soLuong
            });
        }

        return true;
    }

    // 2. Xóa dòng theo id.
    xoa(id) {
        const viTri = this.dsDong.findIndex(
            dong => dong.id === id
        );

        if (viTri === -1) {
            return false;
        }

        this.dsDong.splice(viTri, 1);
        return true;
    }

    // 3. Tổng tiền của giỏ.
    tongTien() {
        return this.dsDong.reduce(
            (tong, dong) => tong + dong.gia * dong.soLuong,
            0
        );
    }

    // 4. Thống kê tổng tiền theo loại sản phẩm.
    thongKeTheoLoai() {
        const ketQua = {};

        this.dsDong.forEach(dong => {
            const thanhTien = dong.gia * dong.soLuong;

            ketQua[dong.loai] =
                (ketQua[dong.loai] || 0) + thanhTien;
        });

        return ketQua;
    }

    // 5. Trả về dòng có thành tiền lớn nhất.
    // Bằng nhau thì lấy dòng đứng trước.
    // Trả về bản sao, có thêm thanhTien.
    dongDatNhat() {
        if (this.dsDong.length === 0) {
            return null;
        }

        let dongMax = this.dsDong[0];

        for (let i = 1; i < this.dsDong.length; i++) {
            const dong = this.dsDong[i];

            if (
                dong.gia * dong.soLuong >
                dongMax.gia * dongMax.soLuong
            ) {
                dongMax = dong;
            }
        }

        return {
            ...dongMax,
            thanhTien: dongMax.gia * dongMax.soLuong
        };
    }

    // 6. Trả về mảng bản sao, mỗi dòng có thêm thanhTien.
    layDanhSach() {
        return this.dsDong.map(dong => ({
            ...dong,
            thanhTien: dong.gia * dong.soLuong
        }));
    }

    // 7. Xuất chuỗi JSON gồm đúng 5 thuộc tính mỗi dòng.
    xuatJSON() {
        return JSON.stringify(this.dsDong);
    }
}

// 8. Nạp giỏ hàng từ chuỗi JSON.
function napGioHang(chuoiJSON) {
    const duLieu = JSON.parse(chuoiJSON);
    const gio = new GioHang();

    gio.dsDong = duLieu.map(dong => ({
        id: dong.id,
        ten: dong.ten,
        loai: dong.loai,
        gia: dong.gia,
        soLuong: dong.soLuong
    }));

    return gio;
}

// ---------- CHẠY THỬ (không sửa) ----------
const gio = new GioHang();

gio.them(DANH_MUC[0], 100);
gio.them(DANH_MUC[3], 200);
gio.them(DANH_MUC[0], 50);

veGioHang(gio.layDanhSach(), gio.tongTien());
console.table(gio.layDanhSach());

hienThi(`JSON gửi lên máy chủ: ${gio.xuatJSON()}`);