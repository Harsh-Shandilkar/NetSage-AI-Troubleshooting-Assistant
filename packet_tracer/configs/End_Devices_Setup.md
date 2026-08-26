# End Devices Configuration Specification

In Cisco Packet Tracer, click each end device, navigate to the **Desktop** tab -> **IP Configuration**, and set the static parameters or toggle DHCP as follows:

---

### 1. Workstations (Desktop PCs)

| Device Name | Switch Port | IP Address | Subnet Mask | Default Gateway | DNS Server | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PC-A** | SW1 Fa0/1 | 192.168.10.10 | 255.255.255.0 | 192.168.10.1 | 192.168.1.1 | VLAN 10 Client |
| **PC-B** | SW1 Fa0/2 | 192.168.10.20 | 255.255.255.0 | 192.168.10.1 | 192.168.1.1 | VLAN 10 (Used in C001, C005) |
| **PC-C** | SW1 Fa0/3 | 192.168.20.10 | 255.255.255.0 | 192.168.20.1 | 192.168.1.1 | VLAN 20 Client |
| **PC-D** | SW1 Fa0/4 | 192.168.20.20 | 255.255.255.0 | 192.168.20.1 | 192.168.1.1 | VLAN 20 Client |
| **Admin-PC** | SW2 Fa0/10 | 10.1.2.10 | 255.255.255.0 | 10.1.2.1 | 192.168.1.1 | Used in C023 (SSH Admin) |
| **PC-Branch** | R2 G0/0 | 10.20.0.10 | 255.255.255.0 | 10.20.0.1 | 192.168.1.1 | Remote LAN host |

---

### 2. Dedicated Servers

| Server Name | Connected To | IP Address | Subnet Mask | Default Gateway | DNS Server | Active Services |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Web-Server** | R1 G0/2 | 10.10.10.10 | 255.255.255.0 | 10.10.10.1 | 192.168.1.1 | HTTP & HTTPS (Port 80/443 ON) |
| **DNS-Server** | R1 G0/2 | 192.168.1.1 | 255.255.255.0 | 192.168.1.254 | 127.0.0.1 | DNS ON (example.com -> 10.10.10.10) |

---

### 3. Wireless Access Point & Wireless Client

#### AP-1 (AccessPoint-PT):
- **Port 0 (Uplink)**: Auto / Connected to SW2 Fa0/5.
- **Port 1 (Wireless)**:
  - SSID: Corporate-WiFi
  - Authentication: WPA2-PSK
  - Passphrase: CiscoPassword123
  - Channel: Channel 6 - 2.437GHz

#### Laptop-Wireless:
- Replace standard NIC with WPC300N wireless module in Packet Tracer.
- Connect to Corporate-WiFi SSID with PSK CiscoPassword123.
- IP Config: DHCP or Static 192.168.20.50/24, Gateway: 192.168.20.1.
