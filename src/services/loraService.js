export const createCompactLoRaPacket = (event) => ({ deviceId: event.deviceId, eventId: event.eventId, type: 'SOS', lat: event.latitude, lon: event.longitude, battery: event.battery, severity: event.severity });

export const mockLoRaService = {
  async sendSOS(event, scenario) {
    const packet = createCompactLoRaPacket(event);
    if (!['lora-success', 'gateway-received', 'mesh-proxy'].includes(scenario)) return { success: false, error: 'NO_LORA_GATEWAY', simulated: true, packet };
    const proxy = scenario === 'mesh-proxy';
    return {
      success: true,
      gatewayId: proxy ? 'YX-DEMO-PROXY-001' : 'YX-GW-001',
      channel: proxy ? 'MESH_PROXY_DEMO' : 'LORA',
      meshStatus: 'GATEWAY_RECEIVED',
      receivedAt: new Date().toISOString(),
      signalStrength: proxy ? -58 : -72,
      simulated: true,
      proxy,
      packet,
    };
  },
};

export const hardwareLoRaService = {
  sendSOS: (event) => meshRadioService.sendSOS(event),
};
import { meshRadioService } from './meshRadioService';
