import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, // Import ReactiveFormsModule for form testing
        LoginComponent // Import the standalone component directly
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize loginForm', () => {
      expect(component.loginForm).toBeDefined();
    });

    it('should have an email control in loginForm', () => {
      expect(component.loginForm.get('email')).toBeTruthy();
    });

    it('should have a password control in loginForm', () => {
      expect(component.loginForm.get('password')).toBeTruthy();
    });
  });

  describe('Email Field Validity', () => {
    it('should be invalid when empty (required)', () => {
      const emailControl = component.loginForm.get('email');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should be invalid for a non-email string', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('notanemail');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should be valid with a correct email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTruthy();
    });
  });

  describe('Password Field Validity', () => {
    it('should be invalid when empty (required)', () => {
      const passwordControl = component.loginForm.get('password');
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should be valid when a value is provided', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });
  });

  describe('Form Validity', () => {
    it('should be invalid when fields are empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when email is invalid', () => {
      component.loginForm.get('email')?.setValue('notanemail');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when password is empty', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be valid when both email and password are correctly provided', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('onSubmit Method', () => {
    let consoleLogSpy: jasmine.Spy;

    beforeEach(() => {
      consoleLogSpy = spyOn(console, 'log');
    });

    it('should log form value when form is valid', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      component.onSubmit();
      expect(consoleLogSpy).toHaveBeenCalledWith('Login form data:', component.loginForm.value);
    });

    it('should log error and mark fields as touched when form is invalid', () => {
      component.loginForm.get('email')?.setValue(''); // Invalid state
      const markAllAsTouchedSpy = spyOn(component.loginForm, 'markAllAsTouched');
      component.onSubmit();
      expect(consoleLogSpy).toHaveBeenCalledWith('Login form is invalid');
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not call console.log with form data if form is invalid', () => {
        component.loginForm.get('email')?.setValue('invalidemail');
        component.onSubmit();
        expect(consoleLogSpy).not.toHaveBeenCalledWith('Login form data:', component.loginForm.value);
        expect(consoleLogSpy).toHaveBeenCalledWith('Login form is invalid');
    });
  });
});
