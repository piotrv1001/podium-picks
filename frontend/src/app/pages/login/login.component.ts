import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
      username: '',
      password: ''
    });
  }

  login(userDto?: UserDTO): void {
    if(!userDto) {
      userDto = new UserDTO(
        this.username, this.password
      );
    }
    this.authService.login(userDto).subscribe({
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
