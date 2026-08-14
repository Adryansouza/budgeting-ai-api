package com.projeto.budgeting.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projeto.budgeting.model.Transaction;
import com.projeto.budgeting.model.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCategoryIgnoreCase(String category);

    List<Transaction> findByTypeAndOccurredAtGreaterThanEqualAndOccurredAtLessThan(
            TransactionType type,
            LocalDateTime start,
            LocalDateTime end);

    List<Transaction> findByTypeAndCategoryIgnoreCaseAndOccurredAtGreaterThanEqualAndOccurredAtLessThan(
            TransactionType type,
            String category,
            LocalDateTime start,
            LocalDateTime end);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.type = :type
            """)
    BigDecimal sumByType(@Param("type") TransactionType type);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.type = :type
              and t.category = :category
            """)
    BigDecimal sumByTypeAndCategory(
            @Param("type") TransactionType type,
            @Param("category") String category);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.type = :type
              and t.occurredAt >= :start
              and t.occurredAt < :end
            """)
    BigDecimal sumByTypeAndPeriod(
            @Param("type") TransactionType type,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.type = :type
              and t.category = :category
              and t.occurredAt >= :start
              and t.occurredAt < :end
            """)
    BigDecimal sumByTypeAndCategoryAndPeriod(
            @Param("type") TransactionType type,
            @Param("category") String category,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
            select coalesce(sum(t.amount), 0)
            from Transaction t
            where t.type = :type
              and t.category in :categories
              and t.occurredAt >= :start
              and t.occurredAt < :end
            """)
    BigDecimal sumByTypeAndCategoriesAndPeriod(
            @Param("type") TransactionType type,
            @Param("categories") List<String> categories,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
    
}
