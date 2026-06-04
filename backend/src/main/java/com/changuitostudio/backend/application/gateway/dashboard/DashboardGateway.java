package com.changuitostudio.backend.application.gateway.dashboard;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;

public interface DashboardGateway {
    DashboardResponse getDashboardData(DashboardRequest request);
}
