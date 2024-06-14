const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const userApi = 'http://localhost:3000/Users';
const feedbackApi = 'http://localhost:3000/Feedback';

const viewFeedback = $('.view-feedback')

const combinedData =[]

    function start() {
        getdata(renderView)
    }
    start()


    // Gọi cả nhiều API đồng thời
    function getdata(callback) {
        Promise.all([
            fetch(userApi).then(response => response.json()),
            fetch(feedbackApi).then(response => response.json())
        ])
        .then(([userData, feedbackData]) => {
            // Chuyển đổi dữ liệu JSON sang dạng phù hợp cho bảng
            const users = userData;
            const feedbacks = feedbackData;
    
            // Kết hợp dữ liệu người dùng và phản hồi dựa trên ID chung
            const combinedData = users.map(user => {
                const feedback = feedbacks.find(fb => fb.id === user.id);
                return {
                    userID: user.UserID,
                    userName: user.UserName,
                    UserIndex: user.id,
                    feedbackID: feedback ? feedback.ID_Feedback : '',
                    feedbackIndex: feedback ? feedback.id : '',
                    content: feedback ? feedback.Content : ''
                };
            });
            callback(combinedData)
        })
    
    }

function renderView(data) {
    var htmls = ""
        // hien thi view feedback nha an
         data.forEach(item => {
               if(!(item.content === "" || item.content === undefined || item.content === null) ) {
                htmls += `
                <tr class = "delete-iteam-${item.feedbackIndex}" >
                <td>${item.userID}</td>
                <td>${item.feedbackID}</td>
                <td>${item.userName}</td>
                <td>${item.content}</td>
                <td>
                    <!-- option active -->
                    <div class=" flex justify-center items-center">
                        <i onclick="handleDeleteFeedback(${item.feedbackIndex})"
                            class="ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-trash"></i>
                    </div>
                </td>
                </tr>
            `
               }
        });
        viewFeedback.innerHTML = htmls
}

function handleDeleteFeedback(id) {
    var option = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    }

    // Xóa dữ liệu phản hồi và người dùng
    fetch(feedbackApi + '/' + id, option)
    .then(function(response) {
        response.json()
    })
    .then(function() {
        var feedbackItem = document.querySelector('.delete-iteam-'+id)
        if (feedbackItem) {
            feedbackItem.remove();
        }
    })
}
