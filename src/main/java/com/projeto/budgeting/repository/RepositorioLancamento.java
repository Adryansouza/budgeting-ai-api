package com.projeto.budgeting.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projeto.budgeting.model.Lancamento;
import com.projeto.budgeting.model.TipoLancamento;

public interface RepositorioLancamento extends JpaRepository<Lancamento, Long> {

    List<Lancamento> findByCategoriaIgnoreCase(String categoria);

    List<Lancamento> findByTipoAndDataOcorrenciaGreaterThanEqualAndDataOcorrenciaLessThan(
            TipoLancamento tipo,
            LocalDateTime start,
            LocalDateTime end);

    List<Lancamento> findByTipoAndCategoriaIgnoreCaseAndDataOcorrenciaGreaterThanEqualAndDataOcorrenciaLessThan(
            TipoLancamento tipo,
            String categoria,
            LocalDateTime start,
            LocalDateTime end);

    @Query("""
            select coalesce(sum(l.valor), 0)
            from Lancamento l
            where l.tipo = :tipo
            """)
    BigDecimal somarPorTipo(@Param("tipo") TipoLancamento tipo);

    @Query("""
            select coalesce(sum(l.valor), 0)
            from Lancamento l
            where l.tipo = :tipo
              and l.categoria = :categoria
            """)
    BigDecimal somarPorTipoECategoria(
            @Param("tipo") TipoLancamento tipo,
            @Param("categoria") String categoria);

    @Query("""
            select coalesce(sum(l.valor), 0)
            from Lancamento l
            where l.tipo = :tipo
              and l.dataOcorrencia >= :inicio
              and l.dataOcorrencia < :fim
            """)
    BigDecimal somarPorTipoEPeriodo(
            @Param("tipo") TipoLancamento tipo,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    @Query("""
            select coalesce(sum(l.valor), 0)
            from Lancamento l
            where l.tipo = :tipo
              and l.categoria = :categoria
              and l.dataOcorrencia >= :inicio
              and l.dataOcorrencia < :fim
            """)
    BigDecimal somarPorTipoCategoriaEPeriodo(
            @Param("tipo") TipoLancamento tipo,
            @Param("categoria") String categoria,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    @Query("""
            select coalesce(sum(l.valor), 0)
            from Lancamento l
            where l.tipo = :tipo
              and l.categoria in :categorias
              and l.dataOcorrencia >= :inicio
              and l.dataOcorrencia < :fim
            """)
    BigDecimal somarPorTipoCategoriasEPeriodo(
            @Param("tipo") TipoLancamento tipo,
            @Param("categorias") List<String> categorias,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);
    
}
