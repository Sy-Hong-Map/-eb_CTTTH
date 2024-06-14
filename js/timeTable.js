const classApi = 'http://localhost:3000/HS_LopHoc';
const buoiHocApi = 'http://localhost:3000/DM_BuoiHoc';
const studentApi = 'http://localhost:3000/students';
const teacherApi = 'http://localhost:3000/dm_giao_vien';
const timeTableApi = 'http://localhost:3000/timeTable';

function start() {
    getUserInfoFromLocalStorage();
    getData(renderData);
}

start();

// Hàm lấy thông tin người dùng từ localStorage
function getUserInfoFromLocalStorage() {
    const storedUser = localStorage.getItem('DataUserLogin');
    if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        return currentUser; // Trả về currentUser
    } else {
        console.log('Không có người dùng nào đang đăng nhập.');
        return null; // Trả về null nếu không có người dùng nào đang đăng nhập
    }
}

async function getData(callback) {
    const [ClassData, buoiHocData, studentData, teacherData, timeTableData] = await Promise.all([
        fetch(classApi).then(response => response.json()),
        fetch(buoiHocApi).then(response => response.json()),
        fetch(studentApi).then(response => response.json()),
        fetch(teacherApi).then(response => response.json()),
        fetch(timeTableApi).then(response => response.json())
    ]);
    callback(ClassData, buoiHocData, studentData, teacherData, timeTableData);
}

function renderData(ClassData, buoiHocData, studentData, teacherData, timeTableData) {
    const userLoginData = getUserInfoFromLocalStorage();

    // Kiểm tra thông tin đăng nhập
    if (!userLoginData) {
        return;
    }

    console.log(studentData);
    console.log(userLoginData);

    // logic khi người dùng đăng nhập vào hệ thống hiển thị thời khóa biểu là học sinh
    if(userLoginData.role==="Học Sinh") {
        let studentElement = studentData.map(student => {
            const timeTable = timeTableData.find(table => table.Ten_Lop === student.class);
    
            if (userLoginData.username === student.student_id) {
                document.querySelector('.txt-tkb').innerHTML = 'Thời Khóa Biểu Học Sinh'
                return `
                    <table class="w-[1140px] mt-[30px]">
                        <thead>
                            <tr>
                                <th class="bg-[#ffa400] text-center">Lớp</th>
                                <th class="bg-[#ffa400] text-center">Buổi</th>
                                <th class="bg-[#ffa400] text-center">Tiết</th>
                                <th class="bg-[#ffa400] text-center">Thứ 2</th>
                                <th class="bg-[#ffa400] text-center">Thứ 3</th>
                                <th class="bg-[#ffa400] text-center">Thứ 4</th>
                                <th class="bg-[#ffa400] text-center">Thứ 5</th>
                                <th class="bg-[#ffa400] text-center">Thứ 6</th>
                                <th class="bg-[#ffa400] text-center">Thứ 7</th>
                                <th class="bg-[#ffa400] text-center">Chủ nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                        <td rowspan="7" class="text-center text-[24px]">${student.class}</td>
                            ${generateTimeTableRows(timeTable.table,student.class)}
                        </tbody>
                    </table>
                `;
            }
        }).join('');
    
        document.querySelector('.timeTable-sang').innerHTML = studentElement;
    }

    // logic khi người dùng đăng nhập vào hệ thống hiện thông tin thời khóa biểu là giáo viên
   if(userLoginData.role==='Giáo viên') {
    let teacherElement = teacherData.map(teacher => {
        if (userLoginData.username === teacher.ID_GV) {
            document.querySelector('.txt-tkb').innerHTML = 'Lịch Dạy Giáo Viên';
            let teacherTimeTable = timeTableData.filter(table => {
                return table.table.some(day => day.periods.some(period => period.teacher === teacher.teacher));
            });

            return teacherTimeTable.map(table => `
                <table class="w-[1140px] mt-[30px]">
                    <thead>
                        <tr>
                            <th class="bg-[#ffa400] text-center">Lớp</th>
                            <th class="bg-[#ffa400] text-center">Buổi</th>
                            <th class="bg-[#ffa400] text-center">Tiết</th>
                            <th class="bg-[#ffa400] text-center">Thứ 2</th>
                            <th class="bg-[#ffa400] text-center">Thứ 3</th>
                            <th class="bg-[#ffa400] text-center">Thứ 4</th>
                            <th class="bg-[#ffa400] text-center">Thứ 5</th>
                            <th class="bg-[#ffa400] text-center">Thứ 6</th>
                            <th class="bg-[#ffa400] text-center">Thứ 7</th>
                            <th class="bg-[#ffa400] text-center">Chủ nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td class="text-center text-[24px]">${table.Ten_Lop}</td>
                        ${generateTeacherTimeTableRows(table.table, teacher.teacher)}
                    </tbody>
                </table>
            `).join('');
        }
    }).join('');

    document.querySelector('.timeTable-sang').innerHTML = teacherElement;
   }
}

//  xu ly ra timeTable
function generateTimeTableRows(timeTable) {
    console.log(timeTable);
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    let rows = '';
    for (let period = 1; period < 6; period++) {
        rows += '<tr>';
        rows += period === 1 ? `<td rowspan="6" class="text-center text-[24px]">Sáng</td>` : '';
        rows += `<td class="text-center text-[18px]">${period}</td>`;
        days.forEach(day => {
            const dayTable = timeTable.find(d => d.Ten_Ngay === day);
            if (dayTable) {
                const periodInfo = dayTable.periods[period - 1];
                rows += periodInfo ? `<td class="text-center text-[18px]">${periodInfo.subject}</td>` : '<td class="text-center text-[18px]">-</td>';
            } else {
                rows += '<td class="text-center text-[18px]">-</td>';
            }
        });
        rows += '</tr>';
    }
    return rows;
}

// Hàm xử lý và hiển thị thời khóa biểu giáo viên
function generateTeacherTimeTableRows(timeTable, teacher) {
    console.log(timeTable);
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    let rows = '';
    for (let period = 1; period <= 5; period++) {
        rows += '<tr>';
        rows += period === 1 ? `<td rowspan="5" class="text-center text-[24px]">Sáng</td>` : '';
        rows += `<td class="text-center text-[18px]">${period}</td>`;
        days.forEach(day => {
            const dayTable = timeTable.find(d => d.Ten_Ngay === day);
            if (dayTable) {
                const periodInfo = dayTable.periods.find(p => p.period === period && p.teacher === teacher);
                rows += periodInfo ? `<td class="text-center text-[18px]">${periodInfo.subject}</td>` : '<td class="text-center text-[18px]">-</td>';
            } else {
                rows += '<td class="text-center text-[18px]">-</td>';
            }
        });
        rows += '</tr>';
    }
    return rows;
}
