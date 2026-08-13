package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.projeto.budgeting.model.Transaction;
import com.projeto.budgeting.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction registerExpense(String description, BigDecimal amount, String category) {
        Transaction transaction = new Transaction(
                description.trim(),
                amount,
                category.trim().toLowerCase());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> listExpenses() {
        return transactionRepository.findAll();
    }

    public BigDecimal calculateTotalExpenses() {
        return transactionRepository.findAll()
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateTotalByCategory(String category) {
        return transactionRepository.findByCategoryIgnoreCase(category.trim())
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<Transaction> listExpensesByCategory(String category) {
        return transactionRepository.findByCategoryIgnoreCase(category.trim());
    }

}
