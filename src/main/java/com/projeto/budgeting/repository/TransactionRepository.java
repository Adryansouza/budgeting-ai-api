package com.projeto.budgeting.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.budgeting.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCategoryIgnoreCase(String category);

}
