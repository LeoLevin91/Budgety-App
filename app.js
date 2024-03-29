
//BUDGET CONTROLLER
 var budgetController = (function(){
   /*
      Так мы защищаем наши данные. Приватная функция
    -> budgetController.x - ОШИБКА
    -> budgetController.add(x) - ОШИБКА
    -> budgetController.publicTest(4) - РАБОТАЕТ,потому что мы возвращаем через главный return budgetController
   */
   // var x = 23;
   //
   // var add = function(a){
   //   return x+a;
   // }
   //
   // return {
   //   publicTest: function(b){
   //     return add(b);
   //   }
   // }

   var Expense = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value = value;
     this.percentage = -1;
   };

   Expense.prototype.calcPercentage = function(totalIncome){
     if(totalIncome > 0){
       this.percentage = Math.round((this.value / totalIncome) * 100);
     } else {
       total.percentage = -1;
     }
   };

   Expense.prototype.getPercentage = function() {
     return this.percentage;
   };


   var Income = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value = value;
   };


   var data = {
     allItems: {
       exp: [],
       inc: []
     },
     totals: {
       exp: 0,
       inc: 0
     },
     budget: 0,
     percentage: -1
   };

   var caclulateTotal = function(type){
     var sum = 0;
     data.allItems[type].forEach(function(current, index, array){
       sum += current.value;
     });
     data.totals[type] = sum;
   };

   return {
     addItem: function(type, des, val){
       var newItem, ID;

       //Create new ID
       if(data.allItems[type].length > 0){
         ID = data.allItems[type][data.allItems[type].length-1].id+1;
       } else {
         ID = 0;
       }

       //Create new Item based on 'inc' or 'exp' type
       if(type === 'exp'){
         newItem = new Expense(ID, des, val);
       } else if(type === 'inc'){
         newItem = new Income(ID, des, val);
       }

       //Push it into out data structure
       data.allItems[type].push(newItem);

       //Return the new element
       return newItem;
     },

     deleteItem: function(type, id) {

       var ids, index;

       ids = data.allItems[type].map(function(current){
         return current.id;
       });

       index = ids.indexOf(id);

       if (index !== -1){
         data.allItems[type].splice(index, 1);
       }

     },

     calculateBudget: function() {

       // Calculate total income and expenses
       caclulateTotal('exp');
       caclulateTotal('inc');

       // Calculate the budget: income - expenses
       data.budget = data.totals.inc - data.totals.exp;
       // Calculate the percentage of income that we spent
       if(data.totals.inc > 0){
         data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
       } else {
         data.percentage = -1;
       }
     },

     calculatePercentages: function(){
        data.allItems.exp.forEach(function(cur){
          cur.calcPercentage(data.totals.inc);
        });
     },

     getPercentage: function(){
       var allPerc = data.allItems.exp.map(function(cur){
         return cur.getPercentage();
       });
       return allPerc;
     },

     getBudget: function() {
       return {
         budget: data.budget,
         totalInc: data.totals.inc,
         totalExp: data.totals.exp,
         percentage: data.percentage
       }
     },

     testing: function() {
       console.log(data);
     }
   }



 })();



//UI CONTROLLER
var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLable: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenceLabel: '.budget__expenses--value',
    percentageLable: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLable: '.budget__title--month'
  };

  var formatNumber = function(num, type){
    /*
      + or - before number
      exactly 2 decimal points
      comma separating the thousnads

      2310.4567 -> 2,310.46
      2000 -> + 2,000,00
    */
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, int.length); //input 2310, out 2,310
    }



    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function(list, callback){
    for(var i = 0; i < list.length; i++){
      callback(list[i], i)
    }
  };

  return {
    getInput: function(){
        return {
          type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },

    addListItem: function(obj, type) {
        var html, newHtml, element;
        // Create HTML string with placeholder text

        if (type === 'inc') {
            element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;

            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);




    },

    clearFields: function() {
      /*Clear field: inputValue and inputType*/
      var fields, fieldsArr;
      /*Get iteration construction, but it`s not array*/
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      /*Create array with slice*/
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });

      fieldsArr[0].focus();
      //console.log(fieldsArr);
    },

    displayBudhet: function(obj){
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenceLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + "%";
      } else if (obj.percentage < 0){
        document.querySelector(DOMstrings.percentageLable).textContent = "---";
      }
    },

    displayPercentages: function(percentages){
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



      nodeListForEach(fields, function(current, index){
        // Do stuff
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      var now, year, month, monthArr;

      now = new Date();

      monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      month = monthArr[now.getMonth()];

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLable).textContent = month + ' ' + year;

    },

    changeType: function(){
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },

    getDOMStrings: function(){
      /*Что бы не дублировать код, просто передадим в controller наш объект*/
      return DOMstrings;
    }
  }


})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      // We need keyCode
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

  };



  var updatePercentages = function(){

    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentage from the budget controller
    var percentages = budgetCtrl.getPercentage();
    // 3. Update the UI with new percentages
    UICtrl.displayPercentages(percentages);
  }


  var updateBudget = function(){
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UIController.displayBudhet(budget);

  };

  var ctrlDeleteItem = function(event){

    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID) {

      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete item from data structure
      budgetController.deleteItem(type, ID);
      // 2. Delete the item the UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updateBudget();
    }

  };


  var ctrlAddItem = function(){
    /*Внеся все под одну функцию мы избавились от дублирования кода*/
    var input, newItem;
    // 1. Get the filed input data
    input = UIController.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear Fields
      UICtrl.clearFields();
      // 5. Calculate and Update Budget
      updateBudget();
      // 6. updatePercentages
      updatePercentages();

    }


  };

  return {
    init: function() {
      console.log('App has started.');
      UICtrl.displayMonth();
      UICtrl.displayBudhet({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };


})(budgetController, UIController);


controller.init();
