# Cisco Packet Tracer — 32 Fault Injection & Verification Scenarios

This reference provides the exact commands to inject each of the 32 project faults in Cisco Packet Tracer, execute the corresponding show command to capture the output, and apply the remediation.

---

### Category 1: VLAN Issues (C001 - C004)

#### [C001] Wrong VLAN Port Assignment
- **Device**: SW1-Dist
- **Fault Injection Command**:
  `ios
  enable
  configure terminal
  interface FastEthernet0/2
   switchport access vlan 20
  `
- **Packet Tracer Show Command**: show vlan brief
- **Expected Output**: VLAN 10 exists; Fa0/1 VLAN 10; Fa0/2 VLAN 20
- **Remediation**:
  `ios
  interface FastEthernet0/2
   switchport access vlan 10
  `

#### [C002] Missing VLAN in Database
- **Device**: SW1-Dist
- **Fault Injection Command**:
  `ios
  enable
  configure terminal
  no vlan 20
  `
- **Packet Tracer Show Command**: show vlan brief
- **Expected Output**: VLAN 20 is missing; Fa0/3 and Fa0/4 are in VLAN 1
- **Remediation**:
  `ios
  vlan 20
   name Engineering-LAN
  `

#### [C003] Trunk Mode Misconfiguration
- **Device**: SW1-Dist
- **Fault Injection Command**:
  `ios
  enable
  configure terminal
  interface FastEthernet0/24
   switchport mode access
  `
- **Packet Tracer Show Command**: show interfaces trunk
- **Expected Output**: Fa0/24 is access mode; VLANs 10,20 are not allowed on a trunk
- **Remediation**:
  `ios
  interface FastEthernet0/24
   switchport mode trunk
  `

#### [C004] VLAN Not in Trunk Allowed List
- **Device**: SW1-Dist
- **Fault Injection Command**:
  `ios
  enable
  configure terminal
  interface FastEthernet0/24
   switchport trunk allowed vlan remove 30
  `
- **Packet Tracer Show Command**: show interfaces trunk
- **Expected Output**: VLAN 30 is not in the allowed VLAN list
- **Remediation**:
  `ios
  interface FastEthernet0/24
   switchport trunk allowed vlan add 30
  `

---

### Category 2: Gateway & Subnetting Issues (C005 - C008)

#### [C005] Wrong Default Gateway on Host
- **Device**: PC-B
- **Fault Injection**: Set PC-B Gateway to 192.168.20.1 (while IP is 192.168.10.20/24).
- **Command**: ipconfig
- **Expected Output**: IP 192.168.10.20/24; default gateway 192.168.20.1
- **Remediation**: Set Default Gateway back to 192.168.10.1.

#### [C006] Gateway Mismatch on Router Sub-interface
- **Device**: R1-HQ
- **Fault Injection Command**:
  `ios
  interface GigabitEthernet0/0.10
   ip address 192.168.10.254 255.255.255.0
  `
- **Packet Tracer Show Command**: show ip interface brief
- **Expected Output**: Router G0/0 = 192.168.10.1/24; PCs use gateway 192.168.10.254
- **Remediation**: ip address 192.168.10.1 255.255.255.0

#### [C007] Duplicate IP Address Conflict
- **Device**: PC-B and second workstation
- **Fault Injection**: Configure both machines with 192.168.10.55/24.
- **Command**: ipconfig
- **Expected Output**: Host 192.168.10.55/24; gateway 192.168.10.1; another device already uses 192.168.10.55

#### [C008] Incorrect Subnet Mask
- **Device**: PC-A
- **Fault Injection**: Set subnet mask to 255.255.0.0 (/16) while LAN is /24.
- **Command**: ipconfig
- **Expected Output**: IP 10.0.5.10/16 while LAN is 10.0.5.0/24

---

### Category 3: DHCP Issues (C009 - C012)

#### [C009] DHCP Pool Exhausted
- **Device**: R1-HQ
- **Command**: show ip dhcp pool
- **Expected Output**: Pool LAN10 has no available addresses

#### [C010] Missing DHCP Pool
- **Device**: R1-HQ
- **Fault Injection**: 
o ip dhcp pool LAN10
- **Command**: show run | section dhcp
- **Expected Output**: No ip dhcp pool configured

#### [C011] Missing DHCP Helper-Address (Relay)
- **Device**: R2-Branch
- **Fault Injection**: interface G0/0 -> 
o ip helper-address
- **Command**: show run | include helper-address
- **Expected Output**: Remote interface has no ip helper-address

#### [C012] Wrong DHCP Default-Router Option
- **Device**: R1-HQ
- **Fault Injection**: ip dhcp pool LAN50 -> default-router 192.168.50.254
- **Command**: show ip dhcp pool
- **Expected Output**: Pool default-router is 192.168.50.254; router LAN is 192.168.50.1

---

### Category 4: DNS Issues (C013 - C016)

#### [C013] Wrong DNS Server Configured
- **Device**: PC-A
- **Command**: ipconfig /all
- **Expected Output**: DNS server = 192.168.1.99; valid DNS is 192.168.1.1

#### [C014] Missing DNS Record
- **Device**: DNS-Server
- **Command**: 
slookup intranet.local
- **Expected Output**: Server: 192.168.1.1; NXDOMAIN for intranet.local

#### [C015] DNS Server Interface Administratively Down
- **Device**: R1-HQ / Switch port connecting DNS server
- **Command**: show ip interface brief
- **Expected Output**: DNS server interface is administratively down

#### [C016] Missing Internal DNS Name-Server
- **Device**: R1-HQ
- **Command**: show run | section ip name-server
- **Expected Output**: Only public DNS configured; internal DNS 10.10.10.10 missing

---

### Category 5: Routing & OSPF Issues (C017 - C020)

#### [C017] Missing Static Route
- **Device**: R1-HQ
- **Command**: show ip route
- **Expected Output**: No route to 10.20.0.0/24; next hop should be 10.0.0.2

#### [C018] Incorrect Next-Hop Route
- **Device**: R1-HQ
- **Command**: show ip route 10.30.0.0
- **Expected Output**: Route points to 10.0.0.9; correct next hop is 10.0.0.2

#### [C019] OSPF Area Mismatch
- **Device**: R2-Branch
- **Fault Injection**: outer ospf 1 -> 
etwork 10.0.0.0 0.0.0.3 area 1
- **Command**: show ip ospf neighbor
- **Expected Output**: R1 area 0; R2 area 1 on same link

#### [C020] OSPF Passive Interface Misconfiguration
- **Device**: R1-HQ
- **Fault Injection**: outer ospf 1 -> passive-interface GigabitEthernet0/1
- **Command**: show ip ospf interface brief
- **Expected Output**: G0/1 on R1 is passive-interface

---

### Category 6: Access Control List (ACL) Issues (C021 - C024)

#### [C021] ACL Blocking HTTP Traffic (Port 80)
- **Device**: R1-HQ
- **Command**: show access-lists
- **Expected Output**: ACL denies tcp any host 10.10.10.10 eq 80

#### [C022] ACL Denies ICMP Traffic
- **Device**: R1-HQ
- **Command**: show access-lists
- **Expected Output**: ACL has deny icmp any any before permit statements

#### [C023] ACL Source Restriction on SSH
- **Device**: R1-HQ
- **Command**: show access-lists
- **Expected Output**: ACL permits SSH only from 10.1.1.0/24; admin is 10.1.2.10

#### [C024] Implicit Deny Without Permit Any
- **Device**: R1-HQ
- **Command**: show access-lists
- **Expected Output**: ACL ends with implicit deny and no permit rule for required traffic

---

### Category 7: NAT Issues (C025 - C028)

#### [C025] NAT Translation Table Empty
- **Device**: R1-HQ
- **Command**: show ip nat translations
- **Expected Output**: No translations appear for inside local addresses

#### [C026] NAT Inside/Outside Roles Reversed
- **Device**: R1-HQ
- **Command**: show run | include ip nat
- **Expected Output**: Inside interface is marked outside; outside interface is marked inside

#### [C027] NAT ACL Subnet Mismatch
- **Device**: R1-HQ
- **Command**: show run | section access-list
- **Expected Output**: NAT ACL permits 192.168.10.0/25 but clients are in 192.168.10.128/25

#### [C028] Missing Default Route on WAN
- **Device**: R1-HQ
- **Command**: show ip route
- **Expected Output**: Default route 0.0.0.0/0 is missing

---

### Category 8: Wireless Issues (C029 - C032)

#### [C029] WLAN Mapped to Missing VLAN
- **Device**: AP-1 / Switch
- **Command**: show run | section wlan
- **Expected Output**: WLAN is mapped to VLAN 30, but VLAN 30 is absent on switch

#### [C030] AP Uplink VLAN Mismatch
- **Device**: SW2-Access
- **Command**: show interfaces trunk
- **Expected Output**: AP uplink is access VLAN 10, but SSID is configured for VLAN 20

#### [C031] Wireless Gateway Interface Shutdown
- **Device**: R1-HQ (G0/0.30 interface)
- **Command**: show ip interface brief
- **Expected Output**: Wireless gateway interface is shutdown

#### [C032] RF Channel Overlap
- **Device**: AP-1 & AP-2
- **Command**: show controllers dot11Radio 0/1
- **Expected Output**: Two APs use overlapping non-standard channels in the same band
