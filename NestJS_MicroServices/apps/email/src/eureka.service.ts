import { Injectable } from '@nestjs/common';
import { Eureka } from 'eureka-js-client';

@Injectable()
export class EurekaService {
  private readonly eurekaClient: Eureka;

  constructor() {
    this.eurekaClient = new Eureka({
      instance: {
        app: 'email-Service',
        hostName: 'localhost', // Your service's hostname
        instanceId: 'Email-service',
        ipAddr: '127.0.0.1', // Your service's IP address
        //for a microservice that does not have a port I think eureka might not be suitable
        port: {
          '$': 0, // Your service's port
          '@enabled': true,
        },
        vipAddress: 'TEST_Service',
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