import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RtnResponse } from './interfaces/rtn-response.interface';

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

  async consultarRtn(rtn: string): Promise<RtnResponse> {
    try {
      if (!rtn || rtn.length !== 14) {
        throw new HttpException('El RTN debe tener 14 dígitos', HttpStatus.BAD_REQUEST);
      }

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
}
