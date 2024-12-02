import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [
        FirebaseViajes,
        FirebaseUsuarioService
      ]
    })

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Que se cree la pagina', () => {
    expect(component).toBeTruthy();
  });

  it("2. Que el correo este vacio", () => {
    expect(component.email).toEqual('');
  });

  it("3. Que la contraseña este vacio", () => {
    expect(component.contrasena).toEqual('');
  });

  it("4. Que el boton diga ingresar", () => {
    const compiled = fixture.debugElement.nativeElement;
    const titulo = compiled.querySelector("ion-title");
    expect(titulo.textContent).toContain('Ingresar');
  })
});
