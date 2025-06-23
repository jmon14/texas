// NestJS
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// AWS
import { SSM } from 'aws-sdk';

// Constants
import { NODE_ENV } from '../utils/constants';

@Injectable()
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

  // TODO: Revisit this logic
  async get(key: string): Promise<string> {
    // First check env variables
    const configValue = this.configService.get(key);
    if (configValue) {
      return configValue;
    }

    if (process.env.NODE_ENV === NODE_ENV.DEVELOPMENT) {
      return undefined;
    }

    // Then check cached parameters
    if (this.cachedParameters.has(key)) {
      return this.cachedParameters.get(key);
    }

    try {
      // Then try to get from SSM in production
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
