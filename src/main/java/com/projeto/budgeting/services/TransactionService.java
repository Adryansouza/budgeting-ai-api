package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.projeto.budgeting.model.Transaction;
import com.projeto.budgeting.model.TransactionType;
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
                normalizeCategory(category));

        return transactionRepository.save(transaction);
    }

    public List<Transaction> listExpenses() {
        return transactionRepository.findAll();
    }

    public BigDecimal calculateTotalExpenses() {
        return transactionRepository.sumByType(TransactionType.DESPESA);
    }

    public BigDecimal calculateTotalByCategory(String category) {
        return transactionRepository.sumByTypeAndCategory(
                TransactionType.DESPESA,
                normalizeCategory(category));
    }

    public List<Transaction> listExpensesByCategory(String category) {
        return transactionRepository.findByCategoryIgnoreCase(normalizeCategory(category));
    }

    public BigDecimal calculateTotalExpensesInCurrentMonth() {
        DateRange currentMonth = currentMonthRange();

        return calculateTotalExpensesByDateTimePeriod(currentMonth.start(), currentMonth.end());
    }

    public BigDecimal calculateTotalByCategoryInCurrentMonth(String category) {
        DateRange currentMonth = currentMonthRange();

        return calculateTotalByCategoryAndDateTimePeriod(category, currentMonth.start(), currentMonth.end());
    }

    public BigDecimal calculateTotalByCategoriesInCurrentMonth(String categories) {
        DateRange currentMonth = currentMonthRange();

        return calculateTotalByCategoriesAndDateTimePeriod(categories, currentMonth.start(), currentMonth.end());
    }

    public BigDecimal calculateTotalExpensesByPeriod(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.sumByTypeAndPeriod(
                TransactionType.DESPESA,
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay());
    }

    public BigDecimal calculateTotalByCategoryAndPeriod(String category, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.sumByTypeAndCategoryAndPeriod(
                TransactionType.DESPESA,
                normalizeCategory(category),
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay());
    }

    public BigDecimal calculateTotalByCategoriesAndPeriod(String categories, LocalDate startDate, LocalDate endDate) {
        return calculateTotalByCategoriesAndDateTimePeriod(
                categories,
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay());
    }

    private BigDecimal calculateTotalExpensesByDateTimePeriod(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.sumByTypeAndPeriod(
                TransactionType.DESPESA,
                start,
                end);
    }

    private BigDecimal calculateTotalByCategoryAndDateTimePeriod(
            String category,
            LocalDateTime start,
            LocalDateTime end) {
        return transactionRepository.sumByTypeAndCategoryAndPeriod(
                TransactionType.DESPESA,
                normalizeCategory(category),
                start,
                end);
    }

    private BigDecimal calculateTotalByCategoriesAndDateTimePeriod(
            String categories,
            LocalDateTime start,
            LocalDateTime end) {
        List<String> normalizedCategories = normalizeCategories(categories);

        if (normalizedCategories.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return transactionRepository.sumByTypeAndCategoriesAndPeriod(
                TransactionType.DESPESA,
                normalizedCategories,
                start,
                end);
    }

    public List<Transaction> listExpensesInCurrentMonth() {
        DateRange currentMonth = currentMonthRange();

        return transactionRepository.findByTypeAndOccurredAtGreaterThanEqualAndOccurredAtLessThan(
                TransactionType.DESPESA,
                currentMonth.start(),
                currentMonth.end());
    }

    public List<Transaction> listExpensesByCategoryInCurrentMonth(String category) {
        DateRange currentMonth = currentMonthRange();

        return transactionRepository.findByTypeAndCategoryIgnoreCaseAndOccurredAtGreaterThanEqualAndOccurredAtLessThan(
                TransactionType.DESPESA,
                normalizeCategory(category),
                currentMonth.start(),
                currentMonth.end());
    }

    private DateRange currentMonthRange() {
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime start = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime end = currentMonth.plusMonths(1).atDay(1).atStartOfDay();

        return new DateRange(start, end);
    }

    private String normalizeCategory(String category) {
        return category.trim().toLowerCase(Locale.ROOT);
    }

    private List<String> normalizeCategories(String categories) {
        if (categories == null || categories.isBlank()) {
            return List.of();
        }

        return Arrays.stream(categories.split(","))
                .map(String::trim)
                .filter(category -> !category.isBlank())
                .map(category -> category.toLowerCase(Locale.ROOT))
                .toList();
    }

    private record DateRange(LocalDateTime start, LocalDateTime end) {
    }

}
