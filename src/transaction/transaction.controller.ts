import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {TransactionService} from './transaction.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {TransactionDto} from '../model/dto/transaction.dto';
import {PersonService} from '../person/person.service';
import {RequiredPipe} from '../utils/pipes/required.pipe';

@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService, private personService: PersonService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    public async getTransactions(
        @Req() req,
        @Query('personId', RequiredPipe) personId: number,
        @Query('completed', new DefaultValuePipe(false), ParseBoolPipe) completed: boolean,
    ): Promise<TransactionDto[]> {
        await this.personService.checkUser(personId, req.user);
        const transactions = await this.transactionService.getTransactions(personId, completed);
        const dtoPromises = transactions.map(t => t.toDto());
        return Promise.all(dtoPromises);
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    public async saveTransaction(@Req() req, @Body() transaction: TransactionDto): Promise<void> {
        await this.personService.checkUser(transaction.personId, req.user);
        await this.transactionService.save(transaction);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('')
    public async deleteAllTransactions(@Req() req, @Query('personId', RequiredPipe) personId: number): Promise<void> {
        await this.personService.checkUser(personId, req.user);
        return this.transactionService.deleteAll(personId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('set-completed')
    public async setCompleted(@Req() req, @Query('personId', RequiredPipe) personId: number): Promise<void> {
        await this.personService.checkUser(personId, req.user);
        return this.transactionService.setCompleted(personId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-completed')
    public async deleteCompleted(@Req() req, @Query('personId', RequiredPipe) personId: number): Promise<void> {
        await this.personService.checkUser(personId, req.user);
        return this.transactionService.deleteCompleted(personId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteTransaction(@Req() req, @Param('id') id: number): Promise<void> {
        const transaction = await this.transactionService.get(id);
        await this.personService.checkUser((await transaction.person).id, req.user);
        return this.transactionService.delete(id);
    }
}
