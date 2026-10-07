package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.projeto.budgeting.model.Lancamento;
import com.projeto.budgeting.model.TipoLancamento;
import com.projeto.budgeting.repository.RepositorioLancamento;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicoLancamento {

    private final RepositorioLancamento repositorioLancamento;

    public Lancamento registrarDespesa(String descricao, BigDecimal valor, String categoria) {
        return registrarDespesa(descricao, valor, categoria, null);
    }

    public Lancamento registrarDespesa(String descricao, BigDecimal valor, String categoria, LocalDate dataOcorrencia) {
        Lancamento lancamento = new Lancamento(descricao.trim(), valor, normalizarCategoria(categoria));
        if (dataOcorrencia != null) {
            lancamento.setDataOcorrencia(dataOcorrencia.atTime(LocalDateTime.now().toLocalTime()));
        }

        return repositorioLancamento.save(lancamento);
    }

    public Lancamento registrarReceita(String descricao, BigDecimal valor, String categoria) {
        return registrarReceita(descricao, valor, categoria, null);
    }

    public Lancamento registrarReceita(String descricao, BigDecimal valor, String categoria, LocalDate dataOcorrencia) {
        Lancamento lancamento = new Lancamento(
                descricao.trim(),
                valor,
                normalizarCategoria(categoria),
                TipoLancamento.RECEITA);
        if (dataOcorrencia != null) {
            lancamento.setDataOcorrencia(dataOcorrencia.atTime(LocalDateTime.now().toLocalTime()));
        }

        return repositorioLancamento.save(lancamento);
    }

    public BigDecimal calcularTotalReceitas() {
        return repositorioLancamento.somarPorTipo(TipoLancamento.RECEITA);
    }

    public BigDecimal calcularSaldoGeral() {
        return calcularTotalReceitas().subtract(calcularTotalDespesas());
    }

    public List<Lancamento> listarDespesas() {
        return repositorioLancamento.findAll();
    }

    public BigDecimal calcularTotalDespesas() {
        return repositorioLancamento.somarPorTipo(TipoLancamento.DESPESA);
    }

    public BigDecimal calcularTotalPorCategoria(String categoria) {
        return repositorioLancamento.somarPorTipoECategoria(TipoLancamento.DESPESA, normalizarCategoria(categoria));
    }

    public List<Lancamento> listarDespesasPorCategoria(String categoria) {
        return repositorioLancamento.findByCategoriaIgnoreCase(normalizarCategoria(categoria));
    }

    public BigDecimal calcularTotalDespesasNoMesAtual() {
        IntervaloDatas mesAtual = intervaloMesAtual();

        return calcularTotalDespesasPorPeriodoDataHora(mesAtual.inicio(), mesAtual.fim());
    }

    public BigDecimal calcularTotalPorCategoriaNoMesAtual(String categoria) {
        IntervaloDatas mesAtual = intervaloMesAtual();

        return calcularTotalPorCategoriaEPeriodoDataHora(categoria, mesAtual.inicio(), mesAtual.fim());
    }

    public BigDecimal calcularTotalPorCategoriasNoMesAtual(String categorias) {
        IntervaloDatas mesAtual = intervaloMesAtual();

        return calcularTotalPorCategoriasEPeriodoDataHora(categorias, mesAtual.inicio(), mesAtual.fim());
    }

    public BigDecimal calcularTotalDespesasPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return repositorioLancamento.somarPorTipoEPeriodo(TipoLancamento.DESPESA,
                dataInicio.atStartOfDay(), dataFim.plusDays(1).atStartOfDay());
    }

    public BigDecimal calcularTotalPorCategoriaEPeriodo(String categoria, LocalDate dataInicio, LocalDate dataFim) {
        return repositorioLancamento.somarPorTipoCategoriaEPeriodo(TipoLancamento.DESPESA,
                normalizarCategoria(categoria), dataInicio.atStartOfDay(), dataFim.plusDays(1).atStartOfDay());
    }

    public BigDecimal calcularTotalPorCategoriasEPeriodo(String categorias, LocalDate dataInicio, LocalDate dataFim) {
        return calcularTotalPorCategoriasEPeriodoDataHora(categorias,
                dataInicio.atStartOfDay(), dataFim.plusDays(1).atStartOfDay());
    }

    private BigDecimal calcularTotalDespesasPorPeriodoDataHora(LocalDateTime inicio, LocalDateTime fim) {
        return repositorioLancamento.somarPorTipoEPeriodo(TipoLancamento.DESPESA, inicio, fim);
    }

    private BigDecimal calcularTotalPorCategoriaEPeriodoDataHora(String categoria, LocalDateTime inicio,
            LocalDateTime fim) {
        return repositorioLancamento.somarPorTipoCategoriaEPeriodo(TipoLancamento.DESPESA,
                normalizarCategoria(categoria), inicio, fim);
    }

    private BigDecimal calcularTotalPorCategoriasEPeriodoDataHora(String categorias, LocalDateTime inicio,
            LocalDateTime fim) {
        List<String> categoriasNormalizadas = normalizarCategorias(categorias);

        if (categoriasNormalizadas.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return repositorioLancamento.somarPorTipoCategoriasEPeriodo(TipoLancamento.DESPESA,
                categoriasNormalizadas, inicio, fim);
    }

    public List<Lancamento> listarDespesasNoMesAtual() {
        IntervaloDatas mesAtual = intervaloMesAtual();

        return repositorioLancamento.findByTipoAndDataOcorrenciaGreaterThanEqualAndDataOcorrenciaLessThan(
                TipoLancamento.DESPESA, mesAtual.inicio(), mesAtual.fim());
    }

    public List<Lancamento> listarDespesasPorCategoriaNoMesAtual(String categoria) {
        IntervaloDatas mesAtual = intervaloMesAtual();

        return repositorioLancamento
                .findByTipoAndCategoriaIgnoreCaseAndDataOcorrenciaGreaterThanEqualAndDataOcorrenciaLessThan(
                        TipoLancamento.DESPESA, normalizarCategoria(categoria), mesAtual.inicio(), mesAtual.fim());
    }

    private IntervaloDatas intervaloMesAtual() {
        YearMonth mesAtual = YearMonth.now();
        LocalDateTime inicio = mesAtual.atDay(1).atStartOfDay();
        LocalDateTime fim = mesAtual.plusMonths(1).atDay(1).atStartOfDay();

        return new IntervaloDatas(inicio, fim);
    }

    private String normalizarCategoria(String categoria) {
        return categoria.trim().toLowerCase(Locale.ROOT);
    }

    private List<String> normalizarCategorias(String categorias) {
        if (categorias == null || categorias.isBlank()) {
            return List.of();
        }

        return Arrays.stream(categorias.split(","))
                .map(String::trim)
                .filter(categoria -> !categoria.isBlank())
                .map(categoria -> categoria.toLowerCase(Locale.ROOT))
                .toList();
    }

    private record IntervaloDatas(LocalDateTime inicio, LocalDateTime fim) {
    }

}
