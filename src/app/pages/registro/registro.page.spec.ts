import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';
import { ReactiveFormsModule } from '@angular/forms';


describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        ReactiveFormsModule
      ],
      providers: [
        FirebaseViajes,
        FirebaseUsuarioService
      ]
    })

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('9. Se crea la pagina', () => {
    expect(component).toBeTruthy();
  });

  it('10. Que el nombre este vacio', () => {
    expect(component.persona.controls.nombre.value).toEqual('');
  });

  it('11. Que el email este vacio', () => {
    expect(component.persona.controls.email.value).toEqual('');
  });

  it('12. Que el rut este vacio', () => {
    expect(component.persona.controls.rut.value).toEqual('');
  });

  it('13. Que el genero este vacio', () => {
    expect(component.persona.controls.genero.value).toEqual('');
  });

  it('14. Que la fecha de nacimiento este vacia', () => {
    expect(component.persona.controls.fecha_nacimiento.value).toEqual('');
  });

  it('15. Que la contraseña este vacia', () => {
    expect(component.persona.controls.contra.value).toEqual('');
  });

  it('16. Que la confirmacion de contraseña este vacia', () => {
    expect(component.persona.controls.contraVali.value).toEqual('');
  });

  it('17. Que el campo tiene_auto tenga el valor "No"', () => {
    expect(component.persona.controls.tiene_auto.value).toEqual('No');
  });

  it('18. Que el campo categoria tenga el valor "Estudiante"', () => {
    expect(component.persona.controls.categoria.value).toEqual('Estudiante');
  });
  it('19. Que el campo modelo este vacio', () => {
    expect(component.persona.controls.modelo.value).toEqual('');
  });

  it('20. Que el campo marca este vacio', () => {
    expect(component.persona.controls.marca.value).toEqual('');
  });
});