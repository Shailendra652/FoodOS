import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL,USER_REGISTER_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { User } from '../shared/models/user';
import { IUserRegister } from '../shared/interfaces/IUserregister';

const USER_KEY ='User'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;
  constructor(private http:HttpClient,private toastrService:ToastrService) { 
    this.userObservable = this.userSubject.asObservable() // read only of user propertise that's why used subject with observable 
  }

  public get currentUser(): User { 
    return this.userSubject.value;
  }
  login(userLogin: IUserLogin) :Observable<User> { 
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => { 
          this.setUserToLocalUser(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Food OS ${user.name}!`,
            `Login Successfull`
          )
        },
        error: (err) => {
          this.toastrService.error(err.error,'Login Failed')
        }
      })
   )
  }

  register(userRegister:IUserRegister):Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL,userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalUser(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the Foodmine ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
  }
  logout() { 
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }
  private setUserToLocalUser(user:User) { 
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  private getUserFromLocalStorage(): User { 
    const UserJson = localStorage.getItem(USER_KEY);
    if (UserJson) return JSON.parse(UserJson) as User;
    return new User();
  }
}
