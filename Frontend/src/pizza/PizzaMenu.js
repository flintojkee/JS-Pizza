/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var quantity = 0;
    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        if($.inArray(filter, pizza.filter) !== -1){

            pizza_shown.push(pizza);
            quantity++;
        }
    });
    $(".pizza-count").html(quantity);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
    $("#filter-button-all-pizza").click(function(){
        $(".count-tile").html("Усі піци");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('pizza');
    });
    $("#filter-button-meat").click(function(){
        $(".count-tile").html("М’ясні");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('meat');
    });
    $("#filter-button-pineapples").click(function(){
        $(".count-tile").html("З ананасами");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('pineapples');
    });
    $("#filter-button-mushrooms").click(function(){
        $(".count-tile").html("З грибами");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('mushrooms');
    });
    $("#filter-button-ocean").click(function(){
        $(".count-tile").html("З морепродуктами");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('ocean');
    });
    $("#filter-button-vega").click(function(){
        $(".count-tile").html("Вега");
        $(".active").removeClass("active");
        $(this).addClass("active");
        filterPizza('vega');
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;