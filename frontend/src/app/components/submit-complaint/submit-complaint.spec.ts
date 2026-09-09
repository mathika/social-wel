import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitComplaint } from './submit-complaint';

describe('SubmitComplaint', () => {
  let component: SubmitComplaint;
  let fixture: ComponentFixture<SubmitComplaint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitComplaint],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitComplaint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
