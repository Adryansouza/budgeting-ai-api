package com.projeto.budgeting.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projeto.budgeting.entity.ContaEntity;

public interface RepositorioConta extends JpaRepository<ContaEntity, Long> {

    

}