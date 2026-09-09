package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EmpleadoRepository;
import com.changuitostudio.backend.application.usecase.ManageEmpleadoUseCase;
import com.changuitostudio.backend.domain.exception.EmpleadoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Empleado;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class EmpleadoService implements ManageEmpleadoUseCase {

    private final EmpleadoRepository repository;

    public EmpleadoService(EmpleadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Empleado> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Empleado> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Empleado crear(Empleado empleado) {
        Empleado guardado = repository.guardar(empleado);
        if (guardado.getCodEmp() == null || guardado.getCodEmp().trim().isEmpty()) {
            guardado.setCodEmp("EMP-" + guardado.getId());
            guardado = repository.guardar(guardado);
        }
        return guardado;
    }

    @Override
    public Empleado actualizar(Long id, Empleado empleado) {
        return repository.obtenerPorId(id).map(existing -> {
            if (empleado.getNomEmp() != null) existing.setNomEmp(empleado.getNomEmp());
            if (empleado.getApPatEmp() != null) existing.setApPatEmp(empleado.getApPatEmp());
            if (empleado.getApMatEmp() != null) existing.setApMatEmp(empleado.getApMatEmp());
            if (empleado.getCelEmp() != null) existing.setCelEmp(empleado.getCelEmp());
            if (empleado.getDirEmp() != null) existing.setDirEmp(empleado.getDirEmp());
            if (empleado.getFecNacEmp() != null) existing.setFecNacEmp(empleado.getFecNacEmp());
            if (empleado.getImgEmp() != null && !empleado.getImgEmp().isEmpty()) existing.setImgEmp(empleado.getImgEmp());
            if (empleado.getCarEmp() != null) existing.setCarEmp(empleado.getCarEmp());
            if (empleado.getCiEmp() != null) existing.setCiEmp(empleado.getCiEmp());
            if (empleado.getId_usu() != null) existing.setId_usu(empleado.getId_usu());
            if (empleado.getEstEmp() != null) existing.setEstEmp(empleado.getEstEmp());
            if (empleado.getCodEmp() != null) existing.setCodEmp(empleado.getCodEmp());

            return repository.guardar(existing);
        }).orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new EmpleadoNoEncontradoException("Empleado no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
