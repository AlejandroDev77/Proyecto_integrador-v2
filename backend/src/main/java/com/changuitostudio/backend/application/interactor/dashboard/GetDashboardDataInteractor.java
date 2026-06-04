package com.changuitostudio.backend.application.interactor.dashboard;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;
import com.changuitostudio.backend.application.gateway.dashboard.DashboardGateway;
import com.changuitostudio.backend.application.usecase.dashboard.GetDashboardDataUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetDashboardDataInteractor implements GetDashboardDataUseCase {

    private final DashboardGateway dashboardGateway;

    @Override
    public DashboardResponse execute(DashboardRequest request) {
        return dashboardGateway.getDashboardData(request);
    }
}
