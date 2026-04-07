export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface DashboardMetrics {
  patientCount: number;
  appointmentCount: number;
  pendingAppointments: number;
  completedAppointments: number;
  recentActivity: ActivityItem[];
}
