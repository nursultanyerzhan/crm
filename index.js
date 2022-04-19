'use strict';

let goods = [
    {
        "id": 1,
        "name": "Смартфон Xiaomi 11T 8/128GB",
        "price": 27000,
        "description": "Смартфон Xiaomi 11T – это представитель флагманской линейки, выпущенной во второй половине 2021 года. И он полностью соответствует такому позиционированию, предоставляя своим обладателям возможность пользоваться отличными камерами, ни в чем себя не ограничивать при запуске игр и других требовательных приложений.",
        "category": "mobile-phone",
        "discont": false,
        "count": 3,
        "units": "шт",
        "images": {
            "small": "img/smrtxiaomi11t-m.jpg",
            "big": "img/smrtxiaomi11t-b.jpg"
        }
    },
    {
        "id": 2,
        "name": "Радиоуправляемый автомобиль Cheetan",
        "price": 4000,
        "description": "Внедорожник на дистанционном управлении. Скорость 25км/ч. Возраст 7 - 14 лет",
        "category": "toys",
        "discont": 5,
        "count": 1,
        "units": "шт",
        "images": {
            "small": "img/cheetancar-m.jpg",
            "big": "img/cheetancar-b.jpg"
        }
    },
    {
        "id": 3,
        "name": "ТВ приставка MECOOL KI",
        "price": 12400,
        "description": "Всего лишь один шаг сделает ваш телевизор умным, Быстрый и умный MECOOL KI PRO, прекрасно спроектированный, сочетает в себе прочный процессор Cortex-A53 с чипом Amlogic S905D",
        "category": "tv-box",
        "discont": 15,
        "count": 4,
        "units": "шт",
        "images": {
            "small": "img/tvboxmecool-m.jpg",
            "big": "img/tvboxmecool-b.jpg"
        }
    },
    {
        "id": 4,
        "name": "Витая пара PROConnect 01-0043-3-25",
        "price": 22,
        "description": "Витая пара Proconnect 01-0043-3-25 является сетевым кабелем с 4 парами проводов типа UTP, в качестве проводника в которых используется алюминий, плакированный медью CCA. Такая неэкранированная витая пара с одножильными проводами диаметром 0.50 мм широко применяется в процессе сетевых монтажных работ. С ее помощью вы сможете обеспечить развертывание локальной сети в домашних условиях или на предприятии, объединить все необходимое вам оборудование в единую сеть.",
        "category": "cables",
        "discont": false,
        "count": 420,
        "units": "v",
        "images": {
            "small": "img/lan_proconnect43-3-25.jpg",
            "big": "img/lan_proconnect43-3-25-b.jpg"
        }
    }
];

const createRow = goodObject => {
    const element = `
  <tr>
    <td class="table__cell ">${goodObject.id}</td>
    <td class="table__cell table__cell_left table__cell_name" data-id="${goodObject.id}">
        <span class="table__cell-id">id: ${goodObject.id}</span>${goodObject.name}</td>
    <td class="table__cell table__cell_left">${goodObject.category}</td>
    <td class="table__cell">${goodObject.units}</td>
    <td class="table__cell">${goodObject.count}</td>
    <td class="table__cell">${goodObject.price}</td>
    <td class="table__cell">${goodObject.price * goodObject.count}</td>
    <td class="table__cell table__cell_btn-wrapper">
        <button class="table__btn table__btn_pic"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
    </td>
  </tr>
    `;
    return element;
}

const addToBody = element => {
    const body = document.querySelector('tbody');
    body.insertAdjacentHTML('beforeend', element);
}

const renderGoods = arrayGoods => {
    const goods = arrayGoods;
    goods.forEach(goodObject => {
        const element = createRow(goodObject);
        addToBody(element);
    });
}

const addButton = document.querySelector('.panel__add-goods');
addButton.addEventListener('click', () => {
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('active');
    const vendorCodeId = Math.round(Math.random() * (10 ** 14));
    const vendorCodeSpan = document.querySelector('.vendor-code__id');
    vendorCodeSpan.textContent = vendorCodeId;
});

const closeModal = () => {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('active');
};

const closeButton = document.querySelector('.modal__close');
closeButton.addEventListener('click', () => {
    closeModal();
});

const tbody = document.querySelector('tbody');
tbody.addEventListener('click', e => {
    const target = e.target;

    if (target.classList.contains('table__btn_del')) {
        const parentTr = target.closest('tr');
        const id = parentTr.firstElementChild.textContent;
        goods = goods.filter(item => item.id != id);
        parentTr.remove();
        computeTotalPriceOfGoods();
    }
});

const modalForm = document.querySelector('.modal__form');
modalForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData);
    product.id = document.querySelector('.vendor-code__id').textContent;
    const newRow = createRow(product);
    addToBody(newRow);
    product.discont = product.discount_count;
    goods.push(product);
    console.log(product);
    computeTotalPriceOfGoods();
    closeModal();
});

modalForm.discount.addEventListener('click', () => {
    modalForm.discount_count.toggleAttribute("disabled");
    modalForm.discount_count.value = '';
});

const computeCurrentModalTotalPrice = () => {

    if (!Number.isNaN(modalForm.count.value) && !Number.isNaN(modalForm.price.value)) {

        let totalPrice = modalForm.count.value * modalForm.price.value;
        if (!Number.isNaN(modalForm.discount_count.value))
            totalPrice -= modalForm.discount_count.value;

        modalForm.total.textContent = totalPrice;
    }
};

modalForm.count.addEventListener('change', computeCurrentModalTotalPrice);
modalForm.price.addEventListener('change', computeCurrentModalTotalPrice);
modalForm.discount_count.addEventListener('change', computeCurrentModalTotalPrice);


const computeTotalPriceOfGoods = () => {
    let totalPriceOfGoods = goods.reduce((total, item) => {
        if (!Number.isNaN(item.discont))
            return total + (item.price * item.count - item.discont);
        else total + (item.price * item.count);
    }, 0);
    const crmTotalPriceSpan = document.querySelector('.crm__total-price');
    crmTotalPriceSpan.textContent = `$ ${totalPriceOfGoods}`;
};

renderGoods(goods);
computeTotalPriceOfGoods();