// NestJS
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// AWS
import { SSM } from 'aws-sdk';

// Constants
import { NODE_ENV } from '../utils/constants';

@Injectable()
export class ConfigurationService {
  private ssm: SSM;
  private cachedParameters: Map<string, string> = new Map();
  private readonly logger = new Logger(ConfigurationService.name);

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
    try {
      // First check env variables
      const configValue = this.configService.get(key);
      if (configValue) {
        return configValue;
      }

      // For development and test environments, return undefined if not in env
      if (process.env.NODE_ENV === NODE_ENV.DEVELOPMENT || process.env.NODE_ENV === NODE_ENV.TEST) {
        return undefined;
      }

      // Then check cached parameters
      if (this.cachedParameters.has(key)) {
        return this.cachedParameters.get(key);
      }

      // Get SSM parameter path from environment or use default
      const ssmPath = '/texas/backend';
      const parameterName = `${ssmPath}/${key}`;

      // Then try to get from SSM in production
      const parameter = await this.ssm
        .getParameter({
          Name: parameterName,
          WithDecryption: true,
        })
        .promise();

      const value = parameter.Parameter.Value;
      this.cachedParameters.set(key, value);
      return value;
    } catch (error) {
      this.logger.error(`Error fetching parameter ${key}:`, error);
      throw error;
    }
  }
}
