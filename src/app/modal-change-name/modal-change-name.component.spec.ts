import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeNameComponent } from './modal-change-name.component';

describe('ModalChangeNameComponent', () => {
  let component: ModalChangeNameComponent;
  let fixture: ComponentFixture<ModalChangeNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalChangeNameComponent]
    });
    fixture = TestBed.createComponent(ModalChangeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
