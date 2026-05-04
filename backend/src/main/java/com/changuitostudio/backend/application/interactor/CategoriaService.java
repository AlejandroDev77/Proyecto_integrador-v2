package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CategoriaRepository;
import com.changuitostudio.backend.application.usecase.ManageCategoriaUseCase;
import com.changuitostudio.backend.domain.exception.CategoriaNoEncontradoException;
import com.changuitostudio.backend.domain.model.Categoria;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CategoriaService implements ManageCategoriaUseCase {

    private final CategoriaRepository categoriaRepository;

    
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public PageResult<Categoria> listarCategorias(int page, int perPage, Map<String, String> filters, String sort) {
        return categoriaRepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.buscarPorId(id);
    }

    @Override
    public Categoria crear(Categoria categoria) {
        return categoriaRepository.guardar(categoria);
    }

    @Override
    public Categoria actualizar(Long id, Categoria categoria) {
        Categoria existente = categoriaRepository.buscarPorId(id)
                .orElseThrow(() -> new CategoriaNoEncontradoException("Categoría no encontrada con ID: " + id));

        if (categoria.getNombre() != null) {
            existente.setNombre(categoria.getNombre());
        }

        if (categoria.getEstado() != null) {
            existente.setEstado(categoria.getEstado());
        }

        return categoriaRepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        categoriaRepository.buscarPorId(id)
                .orElseThrow(() -> new CategoriaNoEncontradoException("Categoría no encontrada con ID: " + id));
        categoriaRepository.eliminarPorId(id);
    }
}
