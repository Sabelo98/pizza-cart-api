document.addEventListener("alpine:init", () => {
    Alpine.data('pizzaCart', () => {
        return {
            title: 'Pizza Cart API',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartData: [],
            cartTotal: 0.00,
            paymentAmount: 0,
            message:'',
            pizza: '',

            login() {
                if (this.username.length > 2) {
                    localStorage['username'] = this.username;
                    this.createCart();
                } else {
                    alert('username is too short');
                }
            },
            logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    localStorage['username'] = '';
                }
            },

            createCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`

                
                return axios.get(getCartURL)
                .then(result => {
                    this.cartId = result.data.cart_code;
                    localStorage.setItem('cartId', this.cartId)
                    localStorage['cartId'] = this.cartId;
                }); 
            },           


            getCart() {
                const getCarturl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCarturl);

            },
            addPizza(PizzaId) {

                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": PizzaId,

                });
            },
            removePizza(PizzaId) {

                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    "cart_code": this.cartId,
                    "pizza_id": PizzaId,

                });
            },
            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',

                    {
                        "cart_code": this.cartId,
                        "amount": amount
                    });
            },
            showCartData() {
                this.getCart().then(result => {
                    this.cartData = result.data.pizzas;
                    console.log(result)


                    const cartData = result.data
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    // alert(this.cartTotal);

                });

            },


            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {

                        this.pizzas = result.data.pizzas;
                        //console.log(">>" + this.pizzas);
                    });

                    const id = localStorage.getItem('cartID')
                    if (!this.cartId) {
                        this
                            .createCart()
                            .then(() => { 
                                 this.showCartData();
                            })
                    } else {
                        this.showCartData()
                    }

            },
            addPizzaToCart(PizzaId) {
                // alert(PizzaId)
                this.addPizza(PizzaId)
                    .then(() => {
                        this.showCartData();
                    });
            },
            removePizzaFromCart(PizzaId) {
                // alert(PizzaId)
                this.removePizza(PizzaId)
                    .then(() => {
                        this.showCartData();
                    });

            },
            payForCart() {
                // alert("Pay now : "+ this.paymentAmount)
                this
                .pay(this.paymentAmount)
                .then(result => {
                    if ( result.data.status == 'failure') {
                        this.message = result.data.message;
                        setTimeout(() => this.message= '', 3000);
                    } else {
                        const change =  this.paymentAmount - this.cartTotal;

                    this.message = `Your change is: ${change.toFixed(2)}, Payment Received, Enjoy!`;

                    setTimeout(() => {
                    this.message = '';
                    this.cartPizzas = [];
                    this.cartTotal = 0.00
                    this.cartId = ''
                    // this.createCart();
                    this.paymentAmount = 0.00
                    }, 3000);

                    }
            });
            },

        }
    });

});