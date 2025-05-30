import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For Material animations
import { By } from '@angular/platform-browser'; // For querying elements

import { LoginComponent } from './login.component';
// LoginComponent already imports MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf

describe('LoginComponent with Material', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule, // Add NoopAnimationsModule
        LoginComponent // LoginComponent is standalone and imports its own Material modules + NgIf
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

  describe('Email Field Validity and Error Messages', () => {
    it('should be invalid and show required error when empty', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched(); // Mark as touched to trigger error visibility
      fixture.detectChanges();

      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.hasError('required')).toBeTruthy();

      const emailErrorElement = fixture.debugElement.query(By.css('mat-form-field[ng-reflect-form="[object Object]"] mat-error'));
      // The above selector might be too generic if there are multiple form fields.
      // Let's try to be more specific by targeting the email field's errors.
      // A better way is to get the form field and then the error, or use a more specific ID if available.
      // For now, we assume the first mat-error in the first mat-form-field is for email.
      // This needs careful handling if the form structure changes.

      // A more robust way:
      const emailFormField = fixture.debugElement.queryAll(By.css('mat-form-field'))[0];
      const matError = emailFormField.query(By.css('mat-error'));
      expect(matError).toBeTruthy();
      expect(matError.nativeElement.textContent).toContain('Email is required.');
    });

    it('should be invalid and show email format error for a non-email string', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('notanemail');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.hasError('email')).toBeTruthy();

      const emailFormField = fixture.debugElement.queryAll(By.css('mat-form-field'))[0];
      const matError = emailFormField.query(By.css('mat-error'));
      expect(matError).toBeTruthy();
      expect(matError.nativeElement.textContent).toContain('Invalid email format.');
    });

    it('should be valid and show no error with a correct email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.valid).toBeTruthy();
      const emailFormField = fixture.debugElement.queryAll(By.css('mat-form-field'))[0];
      const matError = emailFormField.query(By.css('mat-error'));
      expect(matError).toBeNull();
    });
  });

  describe('Password Field Validity and Error Messages', () => {
    it('should be invalid and show required error when empty', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.hasError('required')).toBeTruthy();

      const passwordFormField = fixture.debugElement.queryAll(By.css('mat-form-field'))[1];
      const matError = passwordFormField.query(By.css('mat-error'));
      expect(matError).toBeTruthy();
      expect(matError.nativeElement.textContent).toContain('Password is required.');
    });

    it('should be valid and show no error when a value is provided', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password123');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      expect(passwordControl?.valid).toBeTruthy();
      const passwordFormField = fixture.debugElement.queryAll(By.css('mat-form-field'))[1];
      const matError = passwordFormField.query(By.css('mat-error'));
      expect(matError).toBeNull();
    });
  });

  describe('Form Validity and Submit Button State', () => {
    it('should be invalid and submit button disabled when fields are empty', () => {
      fixture.detectChanges(); // Ensure form state is reflected in button
      expect(component.loginForm.valid).toBeFalsy();
      const submitButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should be invalid and submit button disabled when email is invalid', () => {
      component.loginForm.get('email')?.setValue('notanemail');
      component.loginForm.get('password')?.setValue('password123');
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeFalsy();
      const submitButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should be invalid and submit button disabled when password is empty', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('');
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeFalsy();
      const submitButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should be valid and submit button enabled when both fields are correctly provided', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeTruthy();
      const submitButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(submitButton.nativeElement.disabled).toBeFalse();
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
      fixture.detectChanges(); // Update form validity
      component.onSubmit();
      expect(consoleLogSpy).toHaveBeenCalledWith('Login form data:', component.loginForm.value);
    });

    it('should log error and mark fields as touched when form is invalid', () => {
      component.loginForm.get('email')?.setValue(''); // Invalid state
      fixture.detectChanges();
      const markAllAsTouchedSpy = spyOn(component.loginForm, 'markAllAsTouched').and.callThrough();
      component.onSubmit();
      expect(consoleLogSpy).toHaveBeenCalledWith('Login form is invalid');
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not call console.log with form data if form is invalid', () => {
        component.loginForm.get('email')?.setValue('invalidemail');
        fixture.detectChanges();
        component.onSubmit();
        expect(consoleLogSpy).not.toHaveBeenCalledWith('Login form data:', component.loginForm.value);
        expect(consoleLogSpy).toHaveBeenCalledWith('Login form is invalid');
    });
  });
});
