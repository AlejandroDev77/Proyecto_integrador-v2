package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DisenoRepository;
import com.changuitostudio.backend.application.usecase.ManageDisenoUseCase;
import com.changuitostudio.backend.domain.exception.DisenoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Diseno;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DisenoService implements ManageDisenoUseCase {

    private final DisenoRepository repository;

    public DisenoService(DisenoRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Diseno> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Diseno> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Diseno crear(Diseno diseno) {
        if (diseno.getCodDis() == null || diseno.getCodDis().trim().isEmpty()) {
            diseno.setCodDis("TEMP-" + System.currentTimeMillis());
            Diseno guardado = repository.guardar(diseno);
            guardado.setCodDis("DIS-" + guardado.getId());
            return repository.guardar(guardado);
        }
        return repository.guardar(diseno);
    }

    @Override
    public Diseno actualizar(Long id, Diseno diseno) {
        return repository.obtenerPorId(id).map(existing -> {
            existing.setNomDis(diseno.getNomDis());
            existing.setDescDis(diseno.getDescDis());
            existing.setCotizacion(diseno.getCotizacion());
            if (diseno.getImgDis() != null) {
                existing.setImgDis(diseno.getImgDis());
            }
            if (diseno.getArchivo3d() != null) {
                existing.setArchivo3d(diseno.getArchivo3d());
            }
            return repository.guardar(existing);
        }).orElseThrow(() -> new DisenoNoEncontradoException("Diseno no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DisenoNoEncontradoException("Diseno no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
