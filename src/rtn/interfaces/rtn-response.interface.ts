export interface RtnResponse {
  data: {
    obligadoTributario: {
      rtn: string;
      nombre: string;
      segundoNombre: string;
      primerApellido: string;
      segundoApellido: string;
      nombreComercial: string;
      barrio: string;
      calleAvenida: string;
      bloque: string;
      sector: string;
      numeroCasa: string;
      departamento: {
        departamentoId: number;
        descripcion: string;
      };
      actividadPrimaria: {
        actividadId: string;
        descripcion: string;
      };
      actividadSecundaria: {
        actividadId: string;
        descripcion: string;
      };
      fechaInicioActividad: string;
    };
  };
  isSuccess: boolean;
  message: string | null;
}
