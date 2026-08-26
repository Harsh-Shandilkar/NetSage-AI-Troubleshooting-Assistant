import ipaddress, re

def check_case(symptom, output):
    text = f"{symptom}\n{output}".lower()
    findings=[]
    if "169.254." in text or "no ip dhcp pool" in text:
        findings.append(("DHCP", "DHCP address/pool problem detected", "High"))
    if "gateway" in text and "wrong" in text:
        findings.append(("Gateway", "Gateway mismatch indicated", "High"))
    if "already uses" in text or "duplicate ip" in text:
        findings.append(("Gateway", "Possible duplicate IP address", "High"))
    if "missing" in text and "vlan" in text:
        findings.append(("VLAN", "Missing VLAN indicated", "High"))
    if "not allowed" in text and "trunk" in text:
        findings.append(("VLAN", "VLAN is not allowed on trunk", "High"))
    if "area mismatch" in text or "passive-interface" in text:
        findings.append(("Routing", "OSPF configuration issue indicated", "High"))
    if "no route" in text or "missing default route" in text:
        findings.append(("Routing", "Routing table lacks a required route", "High"))
    if "deny" in text and "access-list" in text:
        findings.append(("ACL", "ACL deny rule may be blocking traffic", "High"))
    if "no translations" in text or "nat acl" in text:
        findings.append(("NAT", "NAT configuration/selection issue indicated", "High"))
    if "dns" in text and ("wrong" in text or "missing" in text):
        findings.append(("DNS", "DNS configuration/record issue indicated", "Medium"))
    if "shutdown" in text and ("interface" in text or "gateway" in text):
        findings.append(("Interface", "Required interface is down", "High"))
    return [{"category":c,"finding":f,"severity":s} for c,f,s in findings]
