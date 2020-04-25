var totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.querySelector('#form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

/* создает случайный особенный id */    
var generateId = function () {
  return 'id' + Math.round(Math.random() * 1e8).toString(16);
};

/* создаем массив с объектами */
var dbOperation = [];

/*localStorage проверяем есть ли там данные и распарсим их*/
if (localStorage.getItem('calc')) {
  dbOperation = JSON.parse(localStorage.getItem('calc'));
};

/* создаем элемент li и добавляет его на страницу(при вызове), как был в верстке */
var renderOperation = function (operation) {

  /* создаем переменную для добавления класса с цветом к рамке с тратами*/
  var className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';

  var listItem = document.createElement('li');

  listItem.classList.add('history__item');
  listItem.classList.add(className);
  
  listItem.innerHTML = `${operation.description}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history__delete" data-id="${operation.id}">x</button>
  `;

  historyList.append(listItem);
};


/* функция обновления баланса */
var updateBalance = function () {
  
  /* перебераем массив с помощью filter(возвращате true или false) */
  var resultIncome = dbOperation.filter((part) => {
    return part.amount > 0;
  }); 

  var resultExpenses = dbOperation.filter((part) => {
    return part.amount < 0;
  }); 

  /* суммируем значаения расходов и доходов из массивов выше*/
  var summResultIncome = resultIncome.reduce((summ, part) => summ + part.amount, 0);
  var summResultExpenses = resultExpenses.reduce((summ, part) => summ + part.amount, 0);

  /* выведем значения на страницу */
  totalMoneyIncome.textContent = summResultIncome + ' ₽';
  totalMoneyExpenses.textContent = summResultExpenses + ' ₽';

  /* получаем баланс */
  totalBalance.textContent = (summResultIncome + summResultExpenses) + ' ₽';
};


/* добавляет траты или доходы при заполнение формы */
var addOperation = function (event) {
  event.preventDefault();

  var operationNameValue = operationName.value;
  var operationAmountValue = operationAmount.value;
  operationName.style.borderColor = '';
  operationAmount.style.borderColor = '';
  operationName.value = '';
  operationAmount.value = '';

  /* проверка на true/false пустой строки */
  if (operationNameValue !== '' && operationAmountValue !== '') {

  /* создаем новый объект, который будет добавляться при отправке формы */
    var obj = {
      id: generateId(),
      description: operationNameValue,
      amount: +operationAmountValue,
    }
    /* добавляем новый элемент в массив dbOperation */
    dbOperation.push(obj);
    init();

  } else {
    if (operationNameValue == '') {
      operationName.style.borderColor = 'red';
    }
    if (operationAmountValue == '') {
      operationAmount.style.borderColor = 'red'
    }
  }

};

/* удаляет строку с операцией */
var deletOperation = function (event) {
  var target = event.target;
    if (target.classList.contains('history__delete')) {
      dbOperation = dbOperation.filter((operations) => {
        return operations.id !== target.dataset.id
      });
      init();
    }
};

/* берет массив, перебирает его и с каждым элементом запускать функцию render */
var init = function () {
  /* опусташает historyList */
  historyList.textContent = '';

  dbOperation.forEach((item) => {
    renderOperation(item);
  }) 

  updateBalance();
  localStorage.setItem('calc', JSON.stringify(dbOperation));
    

  /* 
  for(var i = 0; i < dbOperation.length; i++) {
    renderOperation(dbOperation[i]);
  } */

};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deletOperation);

init();
