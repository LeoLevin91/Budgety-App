
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


 })();


//UI CONTROLLER
var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function(){
        return {
          type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
        };
    },

    getDOMStrings: function(){
      /*Что бы не дублировать код, просто передадим в controller наш объект*/
      return DOMstrings;
    }
  }


})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

  var DOM = UICtrl.getDOMStrings();


  var ctrlAddItem = function(){
    /*Внеся все под одну функцию мы избавились от дублирования кода*/


    // 1. Get the filed input data
    var input = UIController.getInput();
    console.log(input);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
  }



  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    // We need keyCode
    if(event.keyCode === 13 || event.which === 13){
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
