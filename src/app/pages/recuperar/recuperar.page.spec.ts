/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPage } from './recuperar.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirebaseViajes } from 'src/app/services/fire-viajes.service';
import { FirebaseUsuarioService } from 'src/app/services/firebase-usuario.service';


describe('RecuperarPage', () => {
  let component: RecuperarPage;
  let fixture: ComponentFixture<RecuperarPage>;

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

    fixture = TestBed.createComponent(RecuperarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("19. Que se inicie la página", () => {
    expect(component).toBeTruthy();
  });

  it("20. Que el correo este vacio", () => {
    expect(component.email).toEqual('');
  });
});
 */