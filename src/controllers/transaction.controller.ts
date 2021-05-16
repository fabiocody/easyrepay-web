import {TransactionService} from '../services/transaction.service';
import {TransactionDto} from '../model/dto/transaction.dto';
import {Authorized, Body, Delete, Get, JsonController, Param, Post, QueryParam} from 'routing-controllers';

@JsonController()
export class TransactionController {
    @Authorized()
    @Get('/person/:id/transactions')
    public async getTransactions(@Param('id') personId: number,
                                 @QueryParam('completed') completed: boolean = false): Promise<TransactionDto[]> {
        return (await TransactionService.getTransactions(personId, completed))
            .map(t => new TransactionDto(t));
    }

    @Authorized()
    @Post('/transactions')
    public async saveTransaction(@Body() transaction: TransactionDto): Promise<void> {
        await TransactionService.save(transaction);
    }

    @Authorized()
    @Delete('/person/:id/transactions')
    public async deleteAllTransactions(@Param('id') personId: number): Promise<void> {
        await TransactionService.deleteAll(personId);
    }

    @Authorized()
    @Post('/person/:id/transactions/complete')
    public async setCompleted(@Param('id') personId: number): Promise<void> {
        await TransactionService.setCompleted(personId);
    }

    @Authorized()
    @Delete('/person/:id/transactions/complete')
    public async deleteCompleted(@Param('id') personId: number): Promise<void> {
        await TransactionService.deleteCompleted(personId);
    }

    @Authorized()
    @Get('/transaction/:id')
    public async getTransaction(@Param('id') transactionId: number): Promise<TransactionDto> {
        return new TransactionDto(await TransactionService.get(transactionId));
    }

    @Authorized()
    @Delete('/transaction/:id')
    public async deleteTransaction(@Param('id') transactionId: number): Promise<void> {
        await TransactionService.delete(transactionId);
    }
}
