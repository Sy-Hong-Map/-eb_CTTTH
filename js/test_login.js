const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const TeacherApi = 'http://localhost:3000/dm_giao_vien';
const StudentApi = 'http://localhost:3000/students';
const AdminApi = 'http://localhost:3000/admin';

const btnLog = $('.btn-login');
const inAccount = $('.inAccount');
const inPass = $('.inPass');
const inRole = $('.inRole');
let currentUser = null;

// Hàm đăng nhập cho học sinh
async function loginStudent(username, password) {
    const response = await fetch(`${StudentApi}?username=${username}&password=${password}`);

    if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && username === data[0].student_id && password === data[0].Password) {
            currentUser = { role: 'Học Sinh', username: data[0].student_id };
            console.log("Đăng nhập với tư cách là học sinh thành công");
            displayUserInfo();
            window.location.href = 'timeTable.html';
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    }
}

// Hàm đăng nhập cho giáo viên
async function loginTeacher(username, password) {
    const response = await fetch(`${TeacherApi}?username=${username}&password=${password}`);

    if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && username === data[0].ID_GV && password === data[0].Password) {
            currentUser = { role: 'Giáo viên', username: data[0].ID_GV };
            console.log("Đăng nhập với tư cách là giáo viên thành công");
            displayUserInfo();
            window.location.href = 'timeTable.html';
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    }
}

// Hàm đăng nhập cho quản trị viên
async function loginAdmin(username, password) {
    const response = await fetch(`${AdminApi}?username=${username}&password=${password}`);

    if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && username === data[0].Account && password === data[0].Password) {
            currentUser = { role: 'admin', username: data[0].ID_Admin };
            console.log("Đăng nhập với tư cách là admin thành công");
            displayUserInfo();
            window.location.href = 'admin.html';
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    }
}

// Sử dụng khi người dùng click nút đăng nhập
btnLog.onclick = function() {
    const username = inAccount.value;
    const password = inPass.value;
    const role = inRole.value;

    if (role === 'hs') {
        loginStudent(username, password);
    } else if (role === "gv") {
        loginTeacher(username, password);
    } else if (role === "ad") {
        loginAdmin(username, password);
    }
}

// Hiển thị thông tin khi đăng nhập
function displayUserInfo() {
    console.log(currentUser);
    localStorage.setItem('DataUserLogin', JSON.stringify(currentUser));
}

// Lấy thông tin người dùng từ localStorage
function getUserInfoFromLocalStorage() {
    const storedUser = localStorage.getItem('DataUserLogin');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        console.log(currentUser);
    }
}

// Gọi hàm getUserInfoFromLocalStorage khi tải trang để khôi phục phiên người dùng
window.onload = getUserInfoFromLocalStorage;

