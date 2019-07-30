
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
     }
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
  };

  return {
    getInput: function(){
        return {
          type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
        };
    },

    addListItem: function(obj, type){
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if(type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><divclass="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder txt with some actual data
      newHtml = html.replace('%id', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
  }




  var ctrlAddItem = function(){
    /*Внеся все под одну функцию мы избавились от дублирования кода*/
    var input, newItem;
    // 1. Get the filed input data
    input = UIController.getInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    UIController.addListItem(newItem, input.type);
    // 4. Calculate the budget

    // 5. Display the budget on the UI
  };

  return {
    init: function() {
      console.log('App has started.');
      setupEventListeners();
    }
  };


})(budgetController, UIController);


controller.init();
