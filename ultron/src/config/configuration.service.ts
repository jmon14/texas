import { ConfigService } from '@nestjs/config';
import { SSM } from 'aws-sdk';
import { NODE_ENV } from '../utils/constants';

export class ConfigurationService {
  private ssm: SSM;
  private cachedParameters: Map<string, string> = new Map();

  constructor(private configService: ConfigService) {
    if (process.env.NODE_ENV === NODE_ENV.PRODUCTION) {
      // AWS_REGION should always come from environment variables
      const region = process.env.AWS_REGION;
      if (!region) {
        throw new Error('AWS_REGION environment variable is required in production');
      }
      this.ssm = new SSM({ region });
    }
  }

  async get(key: string): Promise<string> {
    // In development, use environment variables
    if (process.env.NODE_ENV !== NODE_ENV.PRODUCTION) {
      return this.configService.get(key);
    }

    // In production, use SSM
    if (this.cachedParameters.has(key)) {
      return this.cachedParameters.get(key);
    }

    try {
      const parameter = await this.ssm
        .getParameter({
          Name: `/texas/ultron/${key}`,
          WithDecryption: true,
        })
        .promise();

      const value = parameter.Parameter.Value;
      this.cachedParameters.set(key, value);
      return value;
    } catch (error) {
      console.error(`Error fetching parameter ${key} from SSM:`, error);
      throw error;
    }
  }
} 