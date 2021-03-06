/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('./Storage');
var API = require('../API');
var isOrdered = false;
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var bool = isPizzaPresent(pizza,size);
    if (bool === -1) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    } else {
        Cart[bool].quantity++;
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}
function isPizzaPresent(pizza, size) {
    for (var i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza.id === pizza.id && size === Cart[i].size) return i;
    }
    return -1;
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item),1);
    //Після видалення оновити відображення
    updateCart();
}
function clearOrder() {
    $(".clear-order").click(function () {
       Cart = [];
       $(".order-count").html("0");
       updateCart();
    })
}
function orderedItems() {
    $(".minus").hide();
    $(".plus").hide();
    $(".clear-order").hide();
    $(".count-clear").hide();
}
function editedItems() {
    $(".minus").show();
    $(".plus").show();
    $(".clear-order").show();
    $(".count-clear").show();
}
function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
   var saved_cart = Storage.read("cart");
   if(saved_cart){
       Cart = saved_cart;
   }
    if(isOrdered){
        orderedItems();
    }else {
        editedItems();
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    Storage.write("cart",Cart);

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            if(cart_item.quantity<=0){
                removeFromCart(cart_item);
            }
            updateCart();
        });
        $node.find(".count-clear").click(function(){
            removeFromCart(cart_item);
        });

        $node.find(".order-pizza-count").html(cart_item.quantity);
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    updatePrice();
}
    function updatePrice(){
    var price = 0;
    var quantity = 0;
    var uah = " грн";
    Cart.forEach(function(pizza){
        price+=(pizza["pizza"] [pizza["size"]] ["price"])*pizza.quantity;
        quantity+=pizza.quantity;
        });
    $(".orders-count-span").text(quantity);
    $(".sum-number").text(price+uah);
    }
    function createOrder(callback) {
        API.createOrder({
            name:"Client name",
            phone:"0671123524",
            order: Cart
            },function (err,result) {
            if(err){
                return callback(err);
            }
            callback(null,result);
            }
        )
    }

    $(".button-order").click(function () {
    //window.location=("/order.html");
    isOrdered = true;

    });
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;
exports.clearOrder = clearOrder();
exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.createOrder = createOrder;
exports.PizzaSize = PizzaSize;