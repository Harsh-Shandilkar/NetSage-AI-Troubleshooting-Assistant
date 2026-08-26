# NetSage AI — Cisco Packet Tracer Lab Topology Guide

## 1. Network Topology Diagram

`
                        +----------------------------------------+
                        |              DMZ / Server              |
                        |  Web Server: 10.10.10.10 (HTTP)        |
                        |  DNS Server: 192.168.1.1 (DNS/Public)  |
                        +----------------------------------------+
                                            |
                                            | G0/2 (10.10.10.1/24)
                                            v
+------------------------+             +------------------------+
|       R2-Branch        |   OSPF /30  |         R1-HQ          |
| G0/0: 10.20.0.1/24     |<----------->| G0/1: 10.0.0.1/30      |
| G0/1: 10.0.0.2/30      |  10.0.0.0   | G0/0: Trunk (RoAS)     |
+------------------------+             +------------------------+
          |                                        |
          | Remote LAN                             | G0/0 (802.1Q Sub-interfaces)
          v                                        v
+------------------------+             +------------------------+
|  Remote PCs (C011/C017)|             |     SW1-Dist Switch    |
|  10.20.0.10 / 10.30.0.0|             |  Gi0/1: Trunk to R1    |
+------------------------+             |  Fa0/24: Trunk to SW2  |
                                       +------------------------+
                                        /      |       |       \
                            Fa0/1 (V10)/ Fa0/2 | Fa0/3 | Fa0/4  \
                                      /  (V10) | (V20) | (V20)   \
                                     v         v       v       v  v Fa0/24 (Trunk)
                                  [PC-A]    [PC-B]  [PC-C]  [PC-D]   +--------------------+
                                192.168.   192.168. 192.168. 192.168.|   SW2-Access Switch|
                                  10.10      10.20    20.10   20.20  +--------------------+
                                                                        /               \
                                                           Fa0/5 (V10) /                 \ Fa0/10 (Admin)
                                                                      v                   v
                                                                 +---------+         +---------+
                                                                 |  AP-1   |         | Admin PC|
                                                                 |Wireless |         |10.1.2.10|
                                                                 +---------+         +---------+
                                                                      | (SSID: VLAN 20/30)
                                                                      v
                                                                 [Wireless-PC]
`

---

## 2. Device Inventory & Port Map

| Device Name | Packet Tracer Model | Interface | Connected To | Subnet / VLAN | IP Address / Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R1-HQ** | Cisco 2911 / 4321 Router | G0/0.10 | SW1 Gi0/1 | VLAN 10 | 192.168.10.1/24 |
| | | G0/0.20 | SW1 Gi0/1 | VLAN 20 | 192.168.20.1/24 |
| | | G0/0.30 | SW1 Gi0/1 | VLAN 30 | 192.168.30.1/24 |
| | | G0/0.50 | SW1 Gi0/1 | VLAN 50 | 192.168.50.1/24 |
| | | G0/1 | R2 G0/1 | Point-to-Point | 10.0.0.1/30 |
| | | G0/2 | Web/DNS Server | Server DMZ | 10.10.10.1/24 |
| **R2-Branch** | Cisco 2911 / 4321 Router | G0/1 | R1 G0/1 | Point-to-Point | 10.0.0.2/30 |
| | | G0/0 | Remote LAN | Branch Subnet | 10.20.0.1/24 |
| **SW1-Dist** | Cisco Catalyst 2960-24TT | Gi0/1 | R1 G0/0 | Uplink Trunk | 802.1Q Trunk |
| | | Fa0/24 | SW2 Fa0/24 | Inter-switch Trunk | 802.1Q Trunk (VLANs 10,20,30) |
| | | Fa0/1 | PC-A | Access VLAN 10 | Access Port |
| | | Fa0/2 | PC-B | Access VLAN 10 | Access Port |
| | | Fa0/3 | PC-C | Access VLAN 20 | Access Port |
| | | Fa0/4 | PC-D | Access VLAN 20 | Access Port |
| **SW2-Access** | Cisco Catalyst 2960-24TT | Fa0/24 | SW1 Fa0/24 | Trunk | 802.1Q Trunk |
| | | Fa0/5 | AP-1 | AP Uplink | Access VLAN 10 / Trunk |
| | | Fa0/10 | Admin-PC | Admin Subnet | 10.1.2.10/24 |
| **AP-1** | AccessPoint-PT | Port 0 | SW2 Fa0/5 | Uplink | Cable |
| | | Port 1 (SSID) | Laptop-Wireless | SSID Corporate | WPA2-PSK |
| **Web-Server** | Server-PT | FastEthernet0 | R1 G0/2 | Server Subnet | 10.10.10.10/24 (GW: 10.10.10.1) |
| **DNS-Server** | Server-PT | FastEthernet0 | R1 G0/2 (or Switch)| DNS Subnet | 192.168.1.1/24 (GW: 192.168.1.254)|

---

## 3. Subnet & IP Plan

| Subnet Purpose | Network CIDR | Default Gateway | Usable Host Range |
| :--- | :--- | :--- | :--- |
| **VLAN 10 (Sales/PCs)** | 192.168.10.0/24 | 192.168.10.1 | 192.168.10.2 - 192.168.10.254 |
| **VLAN 20 (Engineering)** | 192.168.20.0/24 | 192.168.20.1 | 192.168.20.2 - 192.168.20.254 |
| **VLAN 30 (Guest/Voice)** | 192.168.30.0/24 | 192.168.30.1 | 192.168.30.2 - 192.168.30.254 |
| **VLAN 50 (DHCP Test)** | 192.168.50.0/24 | 192.168.50.1 | 192.168.50.2 - 192.168.50.254 |
| **Core Router Link** | 10.0.0.0/30 | N/A | 10.0.0.1 (R1) / 10.0.0.2 (R2) |
| **DMZ / Web Server** | 10.10.10.0/24 | 10.10.10.1 | 10.10.10.2 - 10.10.10.254 |
| **Branch Remote LAN** | 10.20.0.0/24 | 10.20.0.1 | 10.20.0.2 - 10.20.0.254 |
| **Alternate Remote LAN**| 10.30.0.0/24 | 10.30.0.1 | 10.30.0.2 - 10.30.0.254 |
| **Admin Subnet** | 10.1.1.0/24 / 10.1.2.0/24 | 10.1.2.1 | 10.1.2.10 (Admin PC) |
