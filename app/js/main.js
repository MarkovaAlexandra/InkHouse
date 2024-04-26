'use strict'


//Бургер
const iconMenu = document.querySelector('.nav-icon');
const burgerIcons = iconMenu.querySelectorAll('span');
// const logo = document.querySelector('.logo-header');
console.log(burgerIcons);
if (iconMenu) {
    const menuList = document.querySelector('.menu__list');
    iconMenu.addEventListener('click', function (e) {
        document.body.classList.toggle('_lock');//запретить скролл при открытом меню
        burgerIcons.forEach(icon => {
            icon.classList.toggle('_hidden');
        });//меняю крестик и бургер
        menuList.classList.toggle('_active');

    })
}

//----функция для отображения репродукций по странам
const france = document.querySelector('._france');
console.log(france);
console.log(france.classList);
const germany = document.querySelector('._germany');
console.log(germany);
console.log(germany.classList);
const england = document.querySelector('._england');
const buttonsBox = document.querySelector('.items__menu');
buttonsBox.addEventListener('click', showPictures);

function showPictures(e) {
    e.preventDefault();

    console.log(e.target);
    console.log(e.target.innerText);
    if (e.target.innerText == 'Англия') {

        england.classList.add('_isShown');
        france.classList.remove('_isShown');
        germany.classList.remove('_isShown');
    }
    else if (e.target.innerText == 'Франция') {
        console.log('да здравствует франция')
        france.classList.add('_isShown');
        england.classList.remove('_isShown');
        germany.classList.remove('_isShown');
    }
    else if (e.target.innerText == 'Германия') {
        germany.classList.add('_isShown');
        england.classList.remove('_isShown');
        france.classList.remove('_isShown');
    }
}