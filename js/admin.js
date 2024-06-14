
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const iteamUser1 = $('.iteam-user1')
const iteamUser2 = $('.iteam-user2')
const iteamUser3 = $('.iteam-user3')
const iteamFeedback = $('.iteam-feedback')
const view = $('.view')
const btnCreate = $('.btn-Create')
const create = $('.create')
const bodyTable = $('.body-table')
const addUser = $('.add-user')
const editUser = $('.edit-user')
const editIteam = $('.edit-iteam')
const viewuser = $('.view-user')
const bodyAccount = $('.body-account')
const bodyEdit = $('.body-edit')
const updateForm = $('.edit-iteam')
const saveBtn = $('.btn-save')
const CreateAdd = $('.btn-add')
const iconEdit = $('.icon-edit')

const userApi = 'http://localhost:3000/Users';
const loginApi = 'http://localhost:3000/login';
const roleApi = 'http://localhost:3000/Role';

const combinedData =[]

function start() {
    getdata(renderView)
    handleCreateForm()
    getdata(handleCreateFormUser)
}
start()

// Gọi cả nhiều API đồng thời
function getdata(callback) {
    Promise.all([
        fetch(userApi).then(response => response.json()),
        fetch(loginApi).then(response => response.json()),
        fetch(roleApi).then(response => response.json())
    ])
    .then(([userData, loginData,roleData]) => {
        // Chuyển đổi dữ liệu JSON sang dạng phù hợp cho bảng
        const users = userData
        const logins = loginData
        const roles = roleData

        // Kết hợp dữ liệu người dùng và phản hồi dựa trên ID chung
        const combinedData = users.map(user => {
            const role = roles.find(role =>role.id === user.id)
            const login = logins.find(login => login.id === user.id)
            return {
                UserID: user.UserID,
                userName: user.UserName,
                userDate:user.Date,
                userEmail:user.Email,
                userAddress:user.Address,
                userSDT:user.PhoneNumber,
                userCreateDate:user.CreateDate,
                UserIndex: user.id,
                Account: login ? login.Account : '',
                Password: login ? login.Password : '',
                loginIndex: login ? login.id : '',
                roleId: role ? role.id_role : '',
                roleName: role ? role.RoleName : '',
                roleIndex: role ? role.id : '',
            }
          });
          callback(combinedData)
        })
        

}
    // hien thi view 
    function renderView(data) {
        var element=""
        // hien thi view user ra man hinh table view user
            data.map(data => {
                if(data.loginIndex === data.UserIndex && data.loginIndex  === data.roleIndex) {
                iteamUser1.style.borderBottom = '3px solid #7c5fe3'
                iteamUser2.style.borderBottom = 'none'
                iteamUser3.style.borderBottom = 'none'
                    element +=`
                        <tr>
                        <td>${data.UserID}</td>
                        <td>${data.userName}</td>
                        <td>${data.userDate}</td>
                        <td>${data.userAddress}</td>
                        <td>${data.userEmail}</td>
                        <td>${data.userSDT}</td>
                        <td>${data.userCreateDate}</td>
                        <td>${data.roleName}</td>
                    </tr>
                `
                }
        })
        
    bodyTable.innerHTML = element

    // hien thi thong tin tk mk user
    const accLogin = data.map(data => {
        if(data.loginIndex === data.UserIndex && data.loginIndex  === data.roleIndex) 
            {
                return`
            <tr>
            <td>${data.UserID}</td>
            <td>${data.userName}</td>
            <td>${data.Account}</td>
            <td>${data.Password}</td>
        </tr>
    `
            }
    })
    bodyAccount.innerHTML = accLogin.join('')

    // hien thi view edit 
    const editView = data.map(data => {
       if(data.loginIndex === data.UserIndex && data.loginIndex  === data.roleIndex) {
        if(!(data.UserID === "" || data.UserID === undefined || data.UserID === null)) {
        return`
                <tr class="user-iteam-${data.UserIndex}">
                <td>${data.UserID}</td>
                <td>${data.userName}</td>
                <td>${data.userCreateDate}</td>
                <td>${data.roleName}</td>
                <td>${data.Account}</td>
                <td>${data.Password}</td>
                <td>
                <!-- option active -->
                <div class=" flex justify-center items-center">
                    <i onclick ="handleUpdateUser(${data.UserIndex}, handleCreateFormUser())" class="icon-edit ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-user-pen"></i>
                    <i onclick="handleDeleteUser(${data.UserIndex})" class="icon-delete ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-trash"></i>
                </div>
            </td>
            </tr>
        `
       }
    }
        })
        bodyEdit.innerHTML = editView.join('')
                                   
}
         // li hien thi border bottom
        iteamUser1.onclick = function() {
            iteamUser1.style.borderBottom = '3px solid #7c5fe3'
            iteamUser2.style.borderBottom= 'none'
            iteamUser3.style.borderBottom= 'none'
            viewuser.classList.remove('hidden')
            addUser.classList.add('hidden')
            btnCreate.classList.add('hidden')
            editUser.classList.add('hidden')
            $('.btn-edit').classList.add('hidden')
        }

        iteamUser2.onclick = function() {
            iteamUser2.style.borderBottom = '3px solid #7c5fe3'
            iteamUser1.style.borderBottom= 'none'
            iteamUser3.style.borderBottom= 'none'
            addUser.classList.remove('hidden')
            viewuser.classList.add('hidden')
            editUser.classList.add('hidden')
            btnCreate.classList.remove('hidden')
            $('.btn-edit').classList.add('hidden')

        }

        iteamUser3.onclick = function() {
            iteamUser3.style.borderBottom = '3px solid #7c5fe3'
            iteamUser1.style.borderBottom= 'none'
            iteamUser2.style.borderBottom= 'none'
            editUser.classList.remove('hidden')
            viewuser.classList.add('hidden')
            addUser.classList.add('hidden')
            btnCreate.classList.add('hidden')
            $('.btn-edit').classList.remove('hidden')

        }
        
        // click sẽ hiển thị các danh mục để mình chỉnh sửa thông tin
        $('.btn-edit').onclick = function () {
            $('.edit-iteam').classList.remove('hidden')
        }

        // lưu data User
        function saveUser(data, callback) {
            var option = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            fetch(userApi, option)
            .then(function(response) {
                return response.json(); 
            })
            .then(data => {
                console.log('User saved:', data);  
                callback(data);
            })
        }
        
        // Hàm lưu login
        function saveLogin(data, callback) {
            var option = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            fetch(loginApi, option)
            .then(function(response) {
                return response.json();  
            })
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error('Error saving login:', error);
            });
        }
        
        // Hàm lưu role
        function saveRole(data, callback) {
            var option = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            fetch(roleApi, option)
            .then(function(response) {
                return response.json(); 
            })
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error('Error saving role:', error);
            });
        }

        // create form moi
        function handleCreateForm() {
            btnCreate.onclick = function () {
                var iteam_Id = $('.ID').value
                var iteam_Name = $('.Name').value
                var iteam_Date = $('.Date').value
                var iteam_Address = $('.Address').value
                var iteam_Email = $('.Email').value
                var iteam_SDT = $('.SDT').value
                var iteam_CreateDate = $('.CreateDate').value
                var iteam_Account = $('.Account').value
                var iteam_Pass = $('.Pass').value
                var iteam_Role = $('.role').value

                var formDataUser = {
                    id:iteam_Id,
                    UserID:iteam_Id,
                    UserName:iteam_Name,
                    Date:iteam_Date,
                    Address:iteam_Address,
                    Email:iteam_Email,
                    PhoneNumber:iteam_SDT,
                    CreateDate:iteam_CreateDate,
                }

                var formDataLogin = {
                    id:iteam_Id,
                    Account: iteam_Account,
                    Password:iteam_Pass
                }

                var formDataRole = {
                    id:iteam_Id,
                    RoleName:iteam_Role
                }
                
                saveUser(formDataUser,function() {
                    getdata(renderView)
                 })
 
                 saveLogin(formDataLogin,function() {
                    getdata(renderView)
                 })
 
                 saveRole(formDataRole,function() {
                    getdata(renderView)
                 })

            }
        }


        // xoa form user
        function handleDeleteUser(id) {
            var option = {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
            };
        
            function xoaVaLoaiBo(apiUrl, selectorClass) {
                fetch(apiUrl + '/' + id, option)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function() {
                        var item = document.querySelector(selectorClass + '-' + id);
                        if (item) {
                            item.remove();
                        }
                    });
            }
        
            xoaVaLoaiBo(userApi, '.user-item');
            xoaVaLoaiBo(loginApi, '.login-item');
            xoaVaLoaiBo(roleApi, '.role-item');
        }
        // Hien thi view edit

        // Hàm xử lý tạo form mới     
        function handleUpdateUser(id, data) {
            var optionsUser = {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data.user),
            };
        
            var optionsLogin = {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data.login),
            };
        
            var optionsRole = {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data.role),
            };
        
            Promise.all([
                fetch(userApi + '/' + id, optionsUser).then(response => response.json()),
                fetch(loginApi + '/' + id, optionsLogin).then(response => response.json()),
                fetch(roleApi + '/' + id, optionsRole).then(response => response.json())
            ])
            .then(() => {
                getdata(renderView);
            });
        }

        function handleCreateFormUser(data) {
            var iteam_Id = $('.UID').value
            var iteam_Name = $('.UName').value
            var iteam_Date = $('.UDate').value
            var iteam_Account = $('.UAccount').value
            var iteam_Pass = $('.UPass').value
            var iteam_Role = $('.Urole').value
            var iteam_Address = $('.UAddress').value
            var iteam_Email = $('.UEmail').value
            var iteam_CreateDate = $('.UCreateDate').value
            var iteam_SDT = $('.USDT').value
            
            var newdata = {
                    user: {
                        UserID: iteam_Id,
                        UserName: iteam_Name,
                        Date: iteam_Date,
                        id: iteam_Id,
                        Address:iteam_Address,
                        Email:iteam_Email,
                        CreateDate:iteam_CreateDate,
                        PhoneNumber:iteam_SDT
                    },
                    login: {
                        Account: iteam_Account,
                        Password: iteam_Pass,
                        id: iteam_Id
                    },
                    role: {
                        RoleName: iteam_Role,
                        id: iteam_Id
                    }
                };
                console.log(data)
                return newdata
        }

        
        
    

        

   
   




