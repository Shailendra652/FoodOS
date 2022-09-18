import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/cart';
import { CartItem } from '../shared/models/cartItem';
import { Food } from '../shared/models/food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = new Cart();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() { }

  addToCart(food: Food):void {
    let cartItem = this.cart.items.find(item => { item.food.id == food.id })
    if (cartItem)//if cart food is alreadyu present in cart 
      return;
    
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  removeFromCart(foodid: string): void { //removeing food id from cart
    this.cart.items = this.cart.items.filter(item => { item.food.id != foodid });
    this.setCartToLocalStorage();

  }
  changeQuantity(foodId: string, quantity: number) { 
    let cartItem = this.cart.items.find(item => { item.food.id === foodId })
    
    if (!cartItem)
      return;
    
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;

    this.setCartToLocalStorage();
  }

  clearCart() { 
    this.cart = new Cart(); 
    this.setCartToLocalStorage();

  }

  getCartObservable():Observable<Cart> { 
    return this.cartSubject.asObservable();
  }
  private setCartToLocalStorage(): void{ 
    this.cart.totalPrice = this.cart.items.
      reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);//calculates totalPrice
    
      this.cart.totalCount = this.cart.items.//calculates totalQunatity
      reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);
    
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
  }
  
  private getCartToLocalStorage(): Cart { 
    let cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
