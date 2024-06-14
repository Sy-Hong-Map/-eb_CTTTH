const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const bodyPoi = $('.body-poi')

const studyApi = 'http://localhost:3000/HS_HoSoHocSinh'
const subjectApi = 'http://localhost:3000/FK_MonThi'
const poiApi = 'http://localhost:3000/HS_DiemThi'
const lopApi = 'http://localhost:3000/DM_LOP'

const combinedData =[]

function start() {
    getData(renderData)
}
start()

function getData(callback) {
    Promise.all([
        fetch(studyApi).then(response => response.json()),
        fetch(subjectApi).then(response => response.json()),
        fetch(poiApi).then(response => response.json()),
        fetch(lopApi).then(response => response.json())
    ])

    .then(([studyData , subjectData , poiData, lopData]) => {
        const studys = studyData
        const subjects = subjectData
        const pois = poiData
        const lops = lopData

        const combinedData = studys.map(study => {
            const subject = subjects.find(subject => subject.id === study.id)
            const poi = pois.find(poi => poi.id === study.id)
            const lop = lops.find(lop => lop.id === study.id)

            return {
                studyID: study.HocSinhID,
                studyName: study.Ten,
                IDMon: subject.FK_MonHocID,
                NameMon: subject.TenMon,
                IdLop: lop.ma_lop,
                TenLop: lop.ten_lop,
                Diem: poi.DiemThi,
                studyIndex: study.id,
                poiIndex:poi.id,
                lopIndex:lop.id

            }
        })
        callback(combinedData)
    })
}

function renderData(data) {
    console.log(data);
    var element =""
        data.map(data => { 
                    element += `
                         <tr>
                        <td>${data.studyID}</td>
                        <td>${data.studyName}</td>
                        <td>${data.IDMon}</td>
                        <td>${data.NameMon}</td>
                        <td>${data.IdLop}</td>
                        <td>${data.TenLop}</td>
                        <td>${data.Diem}</td>
                         <td>
                            <!-- option active -->
                                <div class=" flex justify-center items-center">
                                    <i class="ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-user-pen"></i>
                                    <i class="ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-trash"></i>
                                </div>
                        </td> 
                    </tr>
                    `
        })
        bodyPoi.innerHTML = element
}
