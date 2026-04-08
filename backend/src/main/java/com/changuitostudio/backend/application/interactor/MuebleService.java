package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MuebleRepository;
import com.changuitostudio.backend.application.usecase.ManageMuebleUseCase;
import com.changuitostudio.backend.domain.exception.MuebleNoEncontradoException;
import com.changuitostudio.backend.domain.model.Mueble;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class MuebleService implements ManageMuebleUseCase {

    private final MuebleRepository muebleRepository;

    
    public MuebleService(MuebleRepository muebleRepository) {
        this.muebleRepository = muebleRepository;
    }

    @Override
    public PageResult<Mueble> listarMuebles(int page, int perPage, Map<String, String> filters, String sort) {
        return muebleRepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<Mueble> obtenerPorId(Long id) {
        return muebleRepository.buscarPorId(id);
    }

    @Override
    public Mueble crear(Mueble mueble) {
        return muebleRepository.guardar(mueble);
    }

    @Override
    public Mueble actualizar(Long id, Mueble mueble) {
        Mueble existente = muebleRepository.buscarPorId(id)
                .orElseThrow(() -> new MuebleNoEncontradoException("Mueble no encontrado con ID: " + id));

        if (mueble.getCodigo() != null) {
            existente.setCodigo(mueble.getCodigo());
        }

        if (mueble.getNombre() != null) {
            existente.setNombre(mueble.getNombre());
        }

        if (mueble.getImagen() != null) {
            existente.setImagen(mueble.getImagen());
        }

        if (mueble.getPrecioVenta() != null) {
            existente.setPrecioVenta(mueble.getPrecioVenta());
        }

        if (mueble.getDescripcion() != null) {
            existente.setDescripcion(mueble.getDescripcion());
        }

        if (mueble.getStock() != null) {
            existente.setStock(mueble.getStock());
        }

        if (mueble.getModelo3d() != null) {
            existente.setModelo3d(mueble.getModelo3d());
        }

        if (mueble.getDimensiones() != null) {
            existente.setDimensiones(mueble.getDimensiones());
        }

        if (mueble.getCategoria() != null) {
            existente.setCategoria(mueble.getCategoria());
        }

        return muebleRepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        muebleRepository.buscarPorId(id)
                .orElseThrow(() -> new MuebleNoEncontradoException("Mueble no encontrado con ID: " + id));
        muebleRepository.eliminarPorId(id);
    }
}
