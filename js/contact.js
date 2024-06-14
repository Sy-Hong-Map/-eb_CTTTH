const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const bodyContact = $('.body-contact')

const contactApi = 'http://localhost:3000/Contact'

function start() {
    getData(renderContact)
}
start()

function getData(callback) {
    fetch(contactApi)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function renderContact(contact) {
    var htmls = contact.map(data => {
        return `
            <tr class = "delete-iteam-${data.id}" >
                <td>${data.First_Name}</td>
                <td>${data.Last_Name}</td>
                <td>${data.Email}</td>
                <td>${data.SDT}</td>
                <td>${data.Content}</td>
                    <!-- option active -->
                    <td>
                        <!-- option active -->
                        <div class=" flex justify-center items-center">
                        <i onclick = "handleDeleContact(${data.id})" class="ml-5 mt-5 mb- 5 cursor-pointer hover:text-[#fe5e0e] fa-solid fa-trash"></i>
                        </div>
                        </td>
                </tr>
        `
    })
    bodyContact.innerHTML = htmls.join('')
}

function handleDeleContact(id) {
    var option = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    }

    fetch(contactApi + '/' + id, option)
    .then(function(response) {
        response.json()
    })
    .then(function() {
        var contactIteam =$('.delete-iteam-'+id)
        if (contactIteam) {
            contactIteam.remove();
        }
    })
}