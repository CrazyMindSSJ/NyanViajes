import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

import { HomePage } from './home.page';

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let usuarioPrueba = {
    id: 1,
    nombre: 'Usuario de prueba',
    email: 'test@test.com',
    contra: '123456',
    cant_asiento: 0,
    categoria: 'usuario',
    color: 'azul',
    contraVali: '123456',
    fecha_nacimiento: '2021-01-01',
    genero: 'masculino',
    marca: 'Toyota',
    modelo: 'Corolla',
    patente: 'AAA123',
    rut: '12345678-9',
    tiene_auto: 'si',
  };

  beforeEach(async () => {
    const localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
        if (key === 'persona') {
          return JSON.stringify(usuarioPrueba);
        }
        return null;
      }),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('5. Verificar si la página se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('6. Validar que los datos del usuario se cargan desde localStorage', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('persona');
    expect(component.persona).toEqual(usuarioPrueba);
  });


  it('7. Verificar que los elementos HTML se rendericen correctamente', () => {
    const compiled = fixture.debugElement.nativeElement;
    const title = compiled.querySelector('ion-title');
    expect(title.textContent).toContain('Menú inicio');
  });

  it('8. Verificar que no haya errores en la consola', () => {
    const consoleSpy = spyOn(console, 'error');
    fixture.detectChanges();
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});