# How to Save & Export NetSage_AI_Troubleshooting_Lab.pkt

### Understanding the .pkt File Format
Cisco Packet Tracer simulation files (.pkt) are **proprietary, encrypted binary files** compiled internally by Cisco Packet Tracer. They contain the GUI coordinates, simulation engine states, packet queues, and device NVRAM states.

To create the official .pkt file for your internship submission or project demonstration:

---

### Step-by-Step Instructions

1. **Launch Cisco Packet Tracer**:
   - Start Cisco Packet Tracer on your computer.

2. **Assemble the Topology**:
   - Add **Router R1-HQ** (Cisco 2911 or 4321) and **Router R2-Branch** (Cisco 2911).
   - Add **Switch SW1-Dist** and **Switch SW2-Access** (Cisco Catalyst 2960).
   - Add **Server-PT Web-Server** and **Server-PT DNS-Server**.
   - Add **PC-A**, **PC-B**, **PC-C**, **PC-D**, **Admin-PC**, and **AP-1 + Wireless Laptop**.
   - Connect the cables as specified in [TOPOLOGY.md](TOPOLOGY.md).

3. **Paste Device Configurations**:
   - For **R1-HQ**: Open CLI tab, paste the contents of packet_tracer/configs/R1_HQ_Router.ios.
   - For **R2-Branch**: Open CLI tab, paste the contents of packet_tracer/configs/R2_Branch_Router.ios.
   - For **SW1-Dist**: Open CLI tab, paste the contents of packet_tracer/configs/SW1_Dist_Switch.ios.
   - For **SW2-Access**: Open CLI tab, paste the contents of packet_tracer/configs/SW2_Access_Switch.ios.
   - For End Devices: Follow packet_tracer/configs/End_Devices_Setup.md.

4. **Verify Connectivity**:
   - From PC-A, run: ping 192.168.10.1 (Gateway ping -> SUCCESS)
   - From PC-A, run: ping 192.168.20.10 (Inter-VLAN ping -> SUCCESS)
   - From PC-A, run: ping 10.10.10.10 (Web server ping -> SUCCESS)

5. **Save the File**:
   - In Cisco Packet Tracer menu, click:
     **File** -> **Save As...** (or press Ctrl + S)
   - File Name: NetSage_AI_Troubleshooting_Lab.pkt
   - Save Location: Choose this project directory or your submission folder.

---

### Submission Verification Checklist
- [x] All 8 network categories (VLAN, Gateway, DHCP, DNS, Routing, ACL, NAT, Wireless) represented.
- [x] All 32 cases in data/cases.csv can be tested and verified.
- [x] Show commands match the exact format parsed by NetSage AI rule checker.
