import { Component, OnInit } from '@angular/core';
import { TransactionService } from './transaction.service'; 

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {

    transactions: any[] = []; 
    loading: boolean = false; 

    constructor(private transactionService: TransactionService) { }

    ngOnInit(): void {
        this.getTransactions(); 
    }

    
    getTransactions(): void {
        this.loading = true;
        this.transactionService.getAllTransactions().subscribe(
            (data) => {
                this.transactions = data; 
                this.loading = false; 
            },
            (error) => {
                console.error('Erreur lors de la récupération des transactions', error);
                this.loading = false; 
            }
        );
    }

    
    deleteTransaction(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
            this.transactionService.deleteTransaction(id).subscribe(
                () => {
                    this.transactions = this.transactions.filter(transaction => transaction.id !== id); 
                },
                (error) => {
                    console.error('Erreur lors de la suppression de la transaction', error);
                }
            );
        }
    }
}
