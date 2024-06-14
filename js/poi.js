const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const viewPoi = $('.view-poi')
const studyApi = 'http://localhost:3000/students'


const combinedData =[]

function start() {
    getData(renderData)
}
start()

function getData(callback) {
    fetch(studyApi) 
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function renderData(data) {
            
var element = data.map(student => {

    return `
        <table class="border border-collapse mb-[20px]">
            <thead class="text-[#fe5e0e]">
                <tr>
                    <th>ID Học Sinh</th>
                    <th>Tên học sinh</th>
                    <th>Tên lớp</th>
                    <th>Tên môn học</th>
                    <th>Điểm</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="13">${student.student_id}</td>
                    <td rowspan="13">${student.student_name}</td>
                    <td rowspan="13">${student.class}</td>
                    
                </tr>
                ${student.scores.map(score => `
                    <tr>
                        <td>${score.subject_name}</td>
                        <td>${score.score}</td>
                        <td>
                            <div class="flex justify-center items-center">
                                <i class="ml-5 mt-5 mb-5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-user-pen"></i>
                                <i class="ml-5 mt-5 mb-5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-trash"></i>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}).join('');

viewPoi.innerHTML = element;
}
