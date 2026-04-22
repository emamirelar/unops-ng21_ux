#!/usr/bin/env bash
#
# Compares this UX repo's dependencies against the team's ClientApp
# in UNOPS-ITG/opportunityplus to flag version mismatches and missing packages.
#
# Usage: npm run check-compat
#
set -euo pipefail

TEAM_REPO="UNOPS-ITG/opportunityplus"
TEAM_PATH="UNOPS.PAO.ClientApp/package.json"
LOCAL_PKG="package.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

if ! command -v gh &> /dev/null; then
  echo -e "${RED}Error: GitHub CLI (gh) is required. Install it: https://cli.github.com${NC}"
  exit 1
fi

if ! gh auth status &> /dev/null 2>&1; then
  echo -e "${RED}Error: Not authenticated. Run: gh auth login${NC}"
  exit 1
fi

echo -e "${BOLD}Fetching team's ClientApp package.json from ${TEAM_REPO}...${NC}"
TEAM_PKG=$(gh api "repos/${TEAM_REPO}/contents/${TEAM_PATH}" --jq '.content' | base64 -d)

if [ -z "$TEAM_PKG" ]; then
  echo -e "${RED}Error: Could not fetch team's package.json${NC}"
  exit 1
fi

python3 << 'PYEOF'
import json, sys, re

def parse_major(version_str):
    """Extract major version number from a semver range."""
    cleaned = re.sub(r'^[\^~>=<]*', '', version_str.strip())
    parts = cleaned.split('.')
    try:
        return int(parts[0])
    except (ValueError, IndexError):
        return None

def compare_versions(local_ver, team_ver):
    """Compare two semver ranges and return status."""
    local_major = parse_major(local_ver)
    team_major = parse_major(team_ver)
    if local_major is not None and team_major is not None and local_major != team_major:
        return "major_mismatch"
    if local_ver == team_ver:
        return "exact_match"
    return "compatible"

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
BOLD = '\033[1m'
NC = '\033[0m'

with open('package.json') as f:
    local = json.load(f)

import subprocess
result = subprocess.run(
    ['gh', 'api', 'repos/UNOPS-ITG/opportunityplus/contents/UNOPS.PAO.ClientApp/package.json', '--jq', '.content'],
    capture_output=True, text=True
)
import base64
team = json.loads(base64.b64decode(result.stdout).decode())

local_deps = {**local.get('dependencies', {}), **local.get('devDependencies', {})}
team_deps = {**team.get('dependencies', {}), **team.get('devDependencies', {})}

shared = sorted(set(local_deps.keys()) & set(team_deps.keys()))
only_local = sorted(set(local_deps.keys()) - set(team_deps.keys()))
only_team = sorted(set(team_deps.keys()) - set(local_deps.keys()))

core_packages = [
    '@angular/core', '@angular/common', '@angular/forms', '@angular/router',
    '@angular/compiler', '@angular/platform-browser', '@angular/platform-browser-dynamic',
    'primeng', 'primeicons', '@primeuix/themes', 'tailwindcss-primeui',
    'rxjs', 'tslib', 'typescript', 'chart.js', 'quill'
]

print(f"\n{BOLD}{'='*70}{NC}")
print(f"{BOLD}  DEPENDENCY COMPATIBILITY REPORT{NC}")
print(f"{BOLD}  UX Repo vs Team's ClientApp{NC}")
print(f"{BOLD}{'='*70}{NC}\n")

# Core packages comparison
print(f"{BOLD}CORE SHARED PACKAGES:{NC}\n")
print(f"  {'Package':<42} {'UX Repo':<18} {'Team App':<18} {'Status'}")
print(f"  {'-'*42} {'-'*18} {'-'*18} {'-'*12}")

issues = 0
for pkg in core_packages:
    if pkg in local_deps and pkg in team_deps:
        status = compare_versions(local_deps[pkg], team_deps[pkg])
        if status == "major_mismatch":
            icon = f"{RED}MISMATCH{NC}"
            issues += 1
        elif status == "exact_match":
            icon = f"{GREEN}OK{NC}"
        else:
            icon = f"{GREEN}OK{NC}"
        print(f"  {pkg:<42} {local_deps[pkg]:<18} {team_deps[pkg]:<18} {icon}")
    elif pkg in local_deps:
        print(f"  {pkg:<42} {local_deps[pkg]:<18} {'---':<18} {YELLOW}UX only{NC}")
    elif pkg in team_deps:
        print(f"  {pkg:<42} {'---':<18} {team_deps[pkg]:<18} {CYAN}Team only{NC}")

# Other shared packages
other_shared = [p for p in shared if p not in core_packages]
if other_shared:
    print(f"\n{BOLD}OTHER SHARED PACKAGES:{NC}\n")
    print(f"  {'Package':<42} {'UX Repo':<18} {'Team App':<18} {'Status'}")
    print(f"  {'-'*42} {'-'*18} {'-'*18} {'-'*12}")
    for pkg in other_shared:
        status = compare_versions(local_deps[pkg], team_deps[pkg])
        if status == "major_mismatch":
            icon = f"{RED}MISMATCH{NC}"
            issues += 1
        else:
            icon = f"{GREEN}OK{NC}"
        print(f"  {pkg:<42} {local_deps[pkg]:<18} {team_deps[pkg]:<18} {icon}")

# UX-only packages (design tooling -- expected)
if only_local:
    print(f"\n{BOLD}UX-ONLY PACKAGES (design tooling, not in team's app):{NC}")
    for pkg in only_local:
        print(f"  {CYAN}-{NC} {pkg} @ {local_deps[pkg]}")

# Team-only packages worth noting
notable_team = [p for p in only_team if any(k in p for k in ['angular', 'primeng', 'prime', 'tailwind', 'chart'])]
if notable_team:
    print(f"\n{YELLOW}{BOLD}TEAM PACKAGES YOU MIGHT WANT TO ADD:{NC}")
    for pkg in notable_team:
        print(f"  {YELLOW}+{NC} {pkg} @ {team_deps[pkg]}")

# Summary
print(f"\n{BOLD}{'='*70}{NC}")
print(f"  Shared packages: {len(shared)}")
print(f"  UX-only packages: {len(only_local)}")
print(f"  Team-only packages: {len(only_team)}")
if issues == 0:
    print(f"\n  {GREEN}{BOLD}All shared dependencies are compatible.{NC}")
else:
    print(f"\n  {RED}{BOLD}{issues} major version mismatch(es) found -- fix before merging.{NC}")
print(f"{BOLD}{'='*70}{NC}\n")

sys.exit(1 if issues > 0 else 0)
PYEOF
