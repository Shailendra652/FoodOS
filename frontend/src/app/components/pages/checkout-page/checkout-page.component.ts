import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router:Router
  ) {
    const cart = this.cartService.getCart();

    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }

  ngOnInit(): void {
    let { name, address } = this.userService.currentUser;

    this.checkoutForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      address: new FormControl(address, [Validators.required]),
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }
  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning('Please fill the inputs', 'Invalid Inputs');
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    // console.log(this.order);

    return this.orderService.create(this.order).subscribe({
      next: () => { 
        this.router.navigateByUrl('/payment');
      },
      error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,'Cart')
      }
    })
  }
}
