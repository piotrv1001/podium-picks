import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserDTO } from "src/app/model/dto/user.dto";
import { AuthService } from "src/app/shared/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() registerBtnClick: EventEmitter<void> = new EventEmitter<void>();
  loginForm?: FormGroup;
  areCredentialsCorrect = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) {}

  get username(): string {
    return this.loginForm?.get('username')?.value;
  }

  get password(): string {
    return this.loginForm?.get('password')?.value;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginTestAccount(): void {
    const username = 'test';
    const password = 'test';
    const userDto = new UserDTO(
      username, password
    );
    this.login(userDto);
  }

  login(userDto?: UserDTO): void {
    let newUserDto;
    if(!userDto) {
      newUserDto = new UserDTO(
        this.username, this.password
      );
    } else {
      newUserDto = userDto;
    }
    this.authService.login(newUserDto).subscribe({
      next: () => {
        this.authService.authenticate();
      },
      error: (error) => {
        this.areCredentialsCorrect = false;
        console.log(error);
      }
    });
  }

  registerBtnClicked(): void {
    this.registerBtnClick.emit();
  }

}
