const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 1000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "data");
const policyFile = path.join(dataDir, "policy-list.json");
const dropdownFile = path.join(dataDir, "policy-dropdown-options.json");

let policies = [];
let dropdownOptions = {};

const loadPolicies = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const data = await fs.readFile(policyFile, "utf-8");
    const parsed = JSON.parse(data);
    policies = parsed?.data?.content || [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      policies = [];
    } else {
      process.exit(1);
    }
  }
};

const loadDropdownOptions = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const data = await fs.readFile(dropdownFile, "utf-8");
    dropdownOptions = JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      dropdownOptions = {};
    } else {
      process.exit(1);
    }
  }
};

const savePolicies = async () => {
  try {
    const dataToWrite = {
      message: "Policy list updated successfully",
      status: "success",
      data: {
        content: policies
      }
    };
    await fs.writeFile(policyFile, JSON.stringify(dataToWrite, null, 2), "utf-8");
  } catch (err) {
  }
};

const saveDropdownOptions = async () => {
  try {
    await fs.writeFile(dropdownFile, JSON.stringify(dropdownOptions, null, 2), "utf-8");
  } catch (err) {
  }
};

const paginate = (arr, page, size) => arr.slice(page * size, (page + 1) * size);

const matchesFilter = (policy, filters) => {
  return Object.entries(filters).every(([key, value]) => {
    if (!value) return true;
    return policy[key] && policy[key] === value;
  });
};

const updateDropdownOptions = (newPolicy) => {
  let updated = false;
  const dropdownKeys = {
    jurisdiction: 'jurisdictions',
    businessArea: 'businessAreas',
    inventoryType: 'inventoryTypes',
    entityType: 'entityTypes',
    status: 'approvalStatuses',
    policyParameter: 'policyTypes'
  };

  for (const [policyKey, dropdownKey] of Object.entries(dropdownKeys)) {
    const value = newPolicy[policyKey];
    if (value) {
      if (!dropdownOptions[dropdownKey]) {
        dropdownOptions[dropdownKey] = [];
      }
      if (!dropdownOptions[dropdownKey].includes(value)) {
        dropdownOptions[dropdownKey].push(value);
        dropdownOptions[dropdownKey].sort();
        updated = true;
      }
    }
  }
  return updated;
};

app.get("/api/policy-dashboard", (req, res) => {
  const {
    jurisdiction,
    businessArea,
    inventoryType,
    entityType,
    status,
    policyParameter,
    page = 0,
    size = 10,
    sortBy,
    direction = "asc",
  } = req.query;

  const filters = {
    jurisdiction,
    businessArea,
    inventoryType,
    entityType,
    status,
    policyParameter,
  };

  let filtered = policies.filter((p) => matchesFilter(p, filters));

  if (sortBy) {
    filtered.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return direction === "asc" ? valA - valB : valB - valA;
    });
  }

  const paged = paginate(filtered, parseInt(page), parseInt(size));

  res.json({
    message: "Policy search successful",
    status: "success",
    data: {
      content: paged,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size: parseInt(size),
      number: parseInt(page),
      numberOfElements: paged.length,
      first: parseInt(page) === 0,
      last: (parseInt(page) + 1) * parseInt(size) >= filtered.length,
    },
  });
});

app.get("/api/policy-dashboard/options", (req, res) => {
  res.json({
    message: "Dropdown values loaded",
    status: "success",
    data: dropdownOptions
  });
});

app.post("/api/policy-dashboard", async (req, res) => {
  const newPolicyData = req.body;

  if (!newPolicyData || typeof newPolicyData !== 'object') {
    return res.status(400).json({ status: 'error', message: 'Invalid policy data provided.' });
  }

  const maxId = policies.reduce((max, p) => (p.id > max ? p.id : max), 0);

  const newPolicy = {
    id: maxId + 1,
    jurisdiction: newPolicyData.jurisdiction || '',
    businessArea: newPolicyData.businessArea || '',
    inventoryType: newPolicyData.inventoryType || '',
    entityType: newPolicyData.entityType || '',
    description: newPolicyData.description || '',
    retentionPeriod: newPolicyData.retentionPeriod || '',
    effectiveDate: newPolicyData.effectiveDate || '',
    policyParameter: newPolicyData.policyParameter || '',
    status: 'Pending'
  };

  policies.push(newPolicy);

  const dropdownsChanged = updateDropdownOptions(newPolicy);

  try {
    await savePolicies();
    if (dropdownsChanged) {
      await saveDropdownOptions();
    }
    res.status(201).json({
      message: "Policy added successfully",
      status: "success",
      data: newPolicy
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to save policy data.' });
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Not found: ${req.originalUrl}`
  });
});

const startServer = async () => {
  await loadPolicies();
  await loadDropdownOptions();
  app.listen(PORT, () => {
  });
};

startServer();