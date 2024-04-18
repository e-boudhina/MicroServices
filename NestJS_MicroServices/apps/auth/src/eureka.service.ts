import { Injectable } from '@nestjs/common';
import { Eureka } from 'eureka-js-client';

@Injectable()
export class EurekaService {
  private readonly eurekaClient: Eureka;

  constructor() {
    this.eurekaClient = new Eureka({
      instance: {
        app: 'Auth_Service',
        hostName: 'localhost', // Your service's hostname
        instanceId: 'auth-service:3000',
        ipAddr: '127.0.0.1', // Your service's IP address
        port: {
          '$': 3000, // Your service's port
          '@enabled': true,
        },
        vipAddress: 'Auth_Service',
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: 'localhost', // Eureka server host
        port: 8761, // Eureka server port
        servicePath: '/eureka/apps/',
        maxRetries: 10,
        requestRetryDelay: 2000,
      },
    });
  }

  async registerWithEureka(): Promise<void> {
    this.eurekaClient.start();
    console.log('Eureka registration successful');
  }

  async deregisterFromEureka(): Promise<void> {
    this.eurekaClient.stop();
    console.log('Eureka deregistration successful');
  }
}