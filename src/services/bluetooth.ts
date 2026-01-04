/**
 * Bluetooth Utility for Heart Rate Monitors
 * Uses Web Bluetooth API to connect to standard BLE HRM devices
 */

export class BluetoothService {
    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    async requestDevice() {
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });
            return this.device;
        } catch (error) {
            console.error('Bluetooth device request failed:', error);
            throw error;
        }
    }

    async connect(onValueChange: (bpm: number) => void) {
        if (!this.device) throw new Error('No device selected');

        try {
            this.server = await this.device.gatt!.connect();
            const service = await this.server.getPrimaryService('heart_rate');
            this.characteristic = await service.getCharacteristic('heart_rate_measurement');

            await this.characteristic.startNotifications();
            this.characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
                const value = event.target.value;
                const bpm = this.parseHeartRate(value);
                onValueChange(bpm);
            });

            return true;
        } catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
    }

    private parseHeartRate(value: DataView) {
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        if (rate16Bits) {
            return value.getUint16(1, true);
        } else {
            return value.getUint8(1);
        }
    }

    disconnect() {
        if (this.device && this.device.gatt!.connected) {
            this.device.gatt!.disconnect();
        }
    }
}

export const bluetoothManager = new BluetoothService();
