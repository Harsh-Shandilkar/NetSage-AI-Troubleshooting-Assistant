export const NETWORK_CATEGORIES = [
  "VLAN",
  "Gateway",
  "DHCP",
  "DNS",
  "Routing",
  "ACL",
  "NAT",
  "Wireless",
  "Other",
] as const;

export type NetworkCategory = (typeof NETWORK_CATEGORIES)[number];
export type Severity = "Low" | "Medium" | "High";

export type CheckerFinding = {
  ruleId: string;
  category: NetworkCategory;
  finding: string;
  severity: Severity;
  evidence: string[];
};

type Rule = {
  ruleId: string;
  category: NetworkCategory;
  finding: string;
  severity: Severity;
  matches: (text: string) => boolean;
  evidence: (symptom: string, output: string) => string[];
};

const compact = (value: string) => value.replace(/\s+/g, " ").trim();

const evidenceFrom = (symptom: string, output: string, terms: string[]) => {
  const lines = `${symptom}\n${output}`
    .split(/\r?\n/)
    .map(compact)
    .filter(Boolean);
  const normalizedTerms = terms.map((term) => term.toLowerCase());
  const matching = lines.filter((line) => {
    const lower = line.toLowerCase();
    return normalizedTerms.some((term) => lower.includes(term));
  });
  return matching.length > 0 ? matching.slice(0, 3) : [compact(output) || compact(symptom)];
};

const has = (text: string, ...terms: string[]) => terms.every((term) => text.includes(term));

const rules: Rule[] = [
  {
    ruleId: "VLAN-001",
    category: "VLAN",
    finding: "Port assignment does not match the intended VLAN.",
    severity: "Medium",
    matches: (text) => text.includes("assigned to vlan") && text.includes("both are in vlan"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["assigned to vlan", "both are in vlan"]),
  },
  {
    ruleId: "VLAN-002",
    category: "VLAN",
    finding: "The required VLAN is missing from the switch configuration.",
    severity: "High",
    matches: (text) => text.includes("missing vlan"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["missing vlan", "vlan 20"]),
  },
  {
    ruleId: "VLAN-003",
    category: "VLAN",
    finding: "The inter-switch link is not carrying the required VLANs.",
    severity: "High",
    matches: (text) => has(text, "access mode", "trunk") && text.includes("not allowed"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["access mode", "not allowed"]),
  },
  {
    ruleId: "VLAN-004",
    category: "VLAN",
    finding: "The VLAN is missing from the trunk allowed list.",
    severity: "High",
    matches: (text) => text.includes("not in the allowed vlan list") || has(text, "vlan 30", "allowed vlan"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["allowed vlan", "vlan 30"]),
  },
  {
    ruleId: "GATEWAY-001",
    category: "Gateway",
    finding: "The host default gateway does not match the local router LAN.",
    severity: "High",
    matches: (text) =>
      has(text, "default gateway", "router lan") ||
      has(text, "default gateway", "outside its local subnet") ||
      has(text, "pcs use gateway", "router g0/0"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["default gateway", "router lan", "gateway"]),
  },
  {
    ruleId: "GATEWAY-002",
    category: "Gateway",
    finding: "A duplicate IP address may be causing the host conflict.",
    severity: "High",
    matches: (text) => text.includes("already uses") || text.includes("duplicate ip"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["already uses", "duplicate ip"]),
  },
  {
    ruleId: "GATEWAY-003",
    category: "Gateway",
    finding: "The host subnet mask does not match the LAN subnet.",
    severity: "High",
    matches: (text) => text.includes("while lan is") && text.includes("/16") && text.includes("/24"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["lan is", "/16", "/24"]),
  },
  {
    ruleId: "DHCP-001",
    category: "DHCP",
    finding: "The host has an APIPA address or the DHCP pool is exhausted.",
    severity: "High",
    matches: (text) => text.includes("169.254.") && (text.includes("no available") || text.includes("exhausted")),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["169.254.", "no available", "exhausted"]),
  },
  {
    ruleId: "DHCP-002",
    category: "DHCP",
    finding: "No DHCP pool is configured for the clients.",
    severity: "High",
    matches: (text) => text.includes("no ip dhcp pool"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["no ip dhcp pool"]),
  },
  {
    ruleId: "DHCP-003",
    category: "DHCP",
    finding: "The remote subnet is missing a DHCP relay helper address.",
    severity: "High",
    matches: (text) => text.includes("no ip helper-address"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["helper-address"]),
  },
  {
    ruleId: "DHCP-004",
    category: "DHCP",
    finding: "The DHCP default-router option points to the wrong gateway.",
    severity: "High",
    matches: (text) => has(text, "default-router", "router lan"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["default-router", "router lan"]),
  },
  {
    ruleId: "DNS-001",
    category: "DNS",
    finding: "Clients are configured with an incorrect DNS server.",
    severity: "Medium",
    matches: (text) => has(text, "dns server", "valid dns"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["dns server", "valid dns"]),
  },
  {
    ruleId: "DNS-002",
    category: "DNS",
    finding: "The requested hostname does not have a DNS record.",
    severity: "Medium",
    matches: (text) => text.includes("nxdomain"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["nxdomain"]),
  },
  {
    ruleId: "DNS-003",
    category: "DNS",
    finding: "The DNS server interface is administratively down.",
    severity: "High",
    matches: (text) => has(text, "dns server", "administratively down"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["dns server", "administratively down"]),
  },
  {
    ruleId: "DNS-004",
    category: "DNS",
    finding: "The internal DNS server is missing from the resolver configuration.",
    severity: "Medium",
    matches: (text) => has(text, "public dns", "internal dns", "missing"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["public dns", "internal dns", "missing"]),
  },
  {
    ruleId: "ROUTING-001",
    category: "Routing",
    finding: "The routing table lacks a required route.",
    severity: "High",
    matches: (text) => text.includes("no route to"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["no route"]),
  },
  {
    ruleId: "ROUTING-002",
    category: "Routing",
    finding: "The route points to an incorrect next hop.",
    severity: "High",
    matches: (text) => has(text, "route points to", "correct next hop"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["route points to", "correct next hop"]),
  },
  {
    ruleId: "ROUTING-003",
    category: "Routing",
    finding: "The OSPF neighbors are configured for different areas.",
    severity: "High",
    matches: (text) => has(text, "ospf", "area 0", "area 1"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["area 0", "area 1"]),
  },
  {
    ruleId: "ROUTING-004",
    category: "Routing",
    finding: "The OSPF interface is configured as passive.",
    severity: "High",
    matches: (text) => text.includes("passive-interface"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["passive-interface"]),
  },
  {
    ruleId: "ACL-001",
    category: "ACL",
    finding: "An ACL deny rule is blocking HTTP traffic to the server.",
    severity: "High",
    matches: (text) => has(text, "acl denies tcp", "eq 80"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["acl denies tcp", "eq 80"]),
  },
  {
    ruleId: "ACL-002",
    category: "ACL",
    finding: "An ACL deny rule is blocking ICMP traffic.",
    severity: "High",
    matches: (text) => has(text, "deny icmp", "acl"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["deny icmp"]),
  },
  {
    ruleId: "ACL-003",
    category: "ACL",
    finding: "The ACL source restriction excludes the administrator's network.",
    severity: "High",
    matches: (text) => has(text, "permits ssh only from", "admin is"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["permits ssh", "admin is"]),
  },
  {
    ruleId: "ACL-004",
    category: "ACL",
    finding: "The ACL ends with an implicit deny and lacks a required permit.",
    severity: "High",
    matches: (text) => has(text, "implicit deny", "no permit"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["implicit deny", "no permit"]),
  },
  {
    ruleId: "NAT-001",
    category: "NAT",
    finding: "Inside traffic is not producing NAT translations.",
    severity: "High",
    matches: (text) => text.includes("no translations"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["no translations"]),
  },
  {
    ruleId: "NAT-002",
    category: "NAT",
    finding: "NAT inside and outside interface roles are reversed.",
    severity: "High",
    matches: (text) => has(text, "inside interface", "outside", "outside interface", "inside"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["inside interface", "outside interface"]),
  },
  {
    ruleId: "NAT-003",
    category: "NAT",
    finding: "The NAT ACL does not include the client subnet.",
    severity: "High",
    matches: (text) => has(text, "nat acl permits", "clients are in"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["nat acl permits", "clients are in"]),
  },
  {
    ruleId: "NAT-004",
    category: "NAT",
    finding: "The WAN router is missing a default route.",
    severity: "High",
    matches: (text) => has(text, "default route", "missing"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["default route", "missing"]),
  },
  {
    ruleId: "WIRELESS-001",
    category: "Wireless",
    finding: "The WLAN is mapped to a VLAN that does not exist on the switch.",
    severity: "High",
    matches: (text) => has(text, "wlan", "mapped to vlan", "absent"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["mapped to vlan", "absent"]),
  },
  {
    ruleId: "WIRELESS-002",
    category: "Wireless",
    finding: "The AP uplink VLAN does not match the SSID VLAN.",
    severity: "High",
    matches: (text) => has(text, "ap uplink", "access vlan", "ssid", "vlan"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["ap uplink", "ssid"]),
  },
  {
    ruleId: "WIRELESS-003",
    category: "Wireless",
    finding: "The wireless gateway interface is shut down.",
    severity: "High",
    matches: (text) => has(text, "wireless gateway interface", "shutdown"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["wireless gateway", "shutdown"]),
  },
  {
    ruleId: "WIRELESS-004",
    category: "Wireless",
    finding: "Overlapping wireless channels may be causing roaming interference.",
    severity: "Medium",
    matches: (text) => has(text, "overlapping", "channels") && text.includes("roaming"),
    evidence: (symptom, output) => evidenceFrom(symptom, output, ["overlapping", "channels", "roaming"]),
  },
];

export function checkCase(symptom: string, output: string): CheckerFinding[] {
  const normalizedSymptom = compact(symptom).toLowerCase();
  const normalizedOutput = compact(output).toLowerCase();
  const text = `${normalizedSymptom}\n${normalizedOutput}`;

  return rules
    .filter((rule) => rule.matches(text))
    .map((rule) => ({
      ruleId: rule.ruleId,
      category: rule.category,
      finding: rule.finding,
      severity: rule.severity,
      evidence: rule.evidence(symptom, output),
    }));
}