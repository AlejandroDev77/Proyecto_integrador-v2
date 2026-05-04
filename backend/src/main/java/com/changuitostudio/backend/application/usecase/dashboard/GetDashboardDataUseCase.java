package com.changuitostudio.backend.application.usecase.dashboard;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;

public interface GetDashboardDataUseCase {
    DashboardResponse execute(DashboardRequest request);
}
