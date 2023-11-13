import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddUserLinkComponent } from './modal-add-user-link.component';

describe('ModalAddUserLinkComponent', () => {
  let component: ModalAddUserLinkComponent;
  let fixture: ComponentFixture<ModalAddUserLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddUserLinkComponent]
    });
    fixture = TestBed.createComponent(ModalAddUserLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
