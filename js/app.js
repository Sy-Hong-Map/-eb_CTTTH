

const icon = $('.login-ic')
const login = $('.nav-login')
icon.onclick = function() {
    login.classList.add('block');
    login.classList.remove('hidden')
}

icon.ondblclick = function() {
    login.classList.add('hidden');
    login.classList.remove('block')
}