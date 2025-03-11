import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionService } from './transaction.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TransactionHistoryComponent', () => {
    let component: TransactionHistoryComponent;
    let fixture: ComponentFixture<TransactionHistoryComponent>;
    let transactionService: TransactionService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransactionHistoryComponent],
            imports: [HttpClientTestingModule], 
            providers: [TransactionService]
        }).compileComponents();

        fixture = TestBed.createComponent(TransactionHistoryComponent);
        component = fixture.componentInstance;
        transactionService = TestBed.inject(TransactionService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
