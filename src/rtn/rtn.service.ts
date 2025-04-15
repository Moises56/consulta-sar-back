import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RtnResponse } from './interfaces/rtn-response.interface';
import { VentasBrutasResponse, VentasBrutasRequest } from './interfaces/ventas-brutas-response.interface';

@Injectable()
export class RtnService {
  private readonly apiHost: string;
  private readonly username: string;
  private readonly password: string;

  constructor(private configService: ConfigService) {
    const apiHost = this.configService.get<string>('AMDC_API_HOST');
    const username = this.configService.get<string>('AMDC_API_USERNAME');
    const password = this.configService.get<string>('AMDC_API_PASSWORD');

    if (!apiHost || !username || !password) {
      throw new Error('Missing required environment variables for RTN service');
    }

    this.apiHost = apiHost;
    this.username = username;
    this.password = password;
  }

  private validateRtn(rtn: string): void {
    if (!rtn || rtn.length !== 14) {
      throw new HttpException('El RTN debe tener 14 dígitos', HttpStatus.BAD_REQUEST);
    }
  }

  private validatePeriodos(periodoDesde: string, periodoHasta: string): void {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 5;
    const currentMonth = new Date().getMonth() + 1;

    // Validate format YYYYMM
    const regexPeriodo = /^\d{6}$/;
    if (!regexPeriodo.test(periodoDesde) || !regexPeriodo.test(periodoHasta)) {
      throw new HttpException('Los períodos deben tener formato AAAAMM', HttpStatus.BAD_REQUEST);
    }

    const yearDesde = parseInt(periodoDesde.substring(0, 4));
    const yearHasta = parseInt(periodoHasta.substring(0, 4));
    const monthDesde = parseInt(periodoDesde.substring(4, 6));
    const monthHasta = parseInt(periodoHasta.substring(4, 6));

    // Validate years are the same
    if (yearDesde !== yearHasta) {
      throw new HttpException('Los períodos deben pertenecer al mismo año', HttpStatus.BAD_REQUEST);
    }

    // Validate year range
    if (yearDesde < minYear || yearDesde > currentYear) {
      throw new HttpException(
        `El año debe estar entre ${minYear} y ${currentYear}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Special validation for 2024
    if (yearDesde === 2024 && (monthDesde > 6 || monthHasta > 6)) {
      throw new HttpException(
        'Para el año 2024, solo están disponibles los períodos de enero a junio',
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate months
    if (monthDesde < 1 || monthDesde > 12 || monthHasta < 1 || monthHasta > 12) {
      throw new HttpException('Los meses deben estar entre 01 y 12', HttpStatus.BAD_REQUEST);
    }
  }

  async consultarRtn(rtn: string): Promise<RtnResponse> {
    try {
      this.validateRtn(rtn);

      const url = `http://${this.apiHost}/int-middleware-gateway/api/v1/AMDC/ConsultaRTN`;
      
      const response = await axios.post<RtnResponse>(
        url,
        { rtn },
        {
          auth: {
            username: this.username,
            password: this.password
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data?.message || 'Error al consultar el RTN',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  }

  async consultarVentasBrutas(data: VentasBrutasRequest): Promise<VentasBrutasResponse> {
    try {
      this.validateRtn(data.Rtn);
      this.validatePeriodos(data.PeriodoDesde, data.PeriodoHasta);

      const url = `http://${this.apiHost}/int-middleware-gateway/api/v1/AMDC/ConsultaVentasBrutas`;
      
      const response = await axios.post<VentasBrutasResponse>(
        url,
        data,
        {
          auth: {
            username: this.username,
            password: this.password
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          error.response?.data?.message || 'Error al consultar las ventas brutas',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw error;
    }
  }
}
