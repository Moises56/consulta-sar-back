export interface VentasBrutasResponse {
  data: {
    ventasBrutas: {
      anio: string;
      importeTotalVentas: number;
    };
  } | null;
  isSuccess: boolean;
  message: string | null;
}

export interface VentasBrutasRequest {
  Rtn: string;
  PeriodoDesde: string;
  PeriodoHasta: string;
}
