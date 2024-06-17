// const $ = document.querySelector.bind(document)
// const $$ = document.querySelectorAll.bind(document)

// const sliders = $$ ('.slider-item')
// const panes = $$ ('.slider-panes')


// sliders.forEach((slider, index) => {
//     const pane = panes[index]
//     slider.onclick = function () {
//         // $('.slider-item.active').classList.remove('active')
//         $('.slider-panes.active').classList.remove('active') 
//         // this.classList.add('active')
//         pane.classList.add('active')
//     }
// })

const pens = document.querySelectorAll('.slider-item')
pens.forEach(pen => {
    pen.addEventListener('click', function () {
        const chitiets = document.querySelectorAll('.slider-panes')
        chitiets.forEach(chitiet => {
            chitiet.classList.add('active')
        })
        const parent = pen.closest('.slider')
        const chi = parent.querySelector('.slider-panes')
        chi.classList.remove('active')
    })
})

document.addEventListener('click', function (e) {
    const box = document.querySelector('.wapper')
    //kiem tra
    if (!box.contains(e.target)) {
        const chitiets = document.querySelectorAll('.slider-panes')
        chitiets.forEach(chitiet => {
            chitiet.classList.add('active')
        })
    }
})