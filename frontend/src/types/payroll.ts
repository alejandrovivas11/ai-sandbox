/**
 * Payroll-related TypeScript type definitions
 */

/**
 * Interface representing a single payroll record
 */
export interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  status: string;
  payPeriod: string;
}

/**
 * Interface representing a payroll period option
 */
export interface PayrollPeriod {
  value: string;
  label: string;
}

/**
 * Interface representing aggregated payroll statistics
 */
export interface PayrollStatistics {
  totalGrossPay: number;
  totalNetPay: number;
  totalEmployees: number;
  averageSalary: number;
}
