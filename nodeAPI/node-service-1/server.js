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

// --- DATA LOADING FUNCTIONS ---

const loadPolicies = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true }); // Ensure data directory exists
    const data = await fs.readFile(policyFile, "utf-8");
    const parsed = JSON.parse(data);
    policies = parsed?.data?.content || [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log("policy-list.json not found, starting with an empty list.");
      policies = [];
    } else {
      console.error("Failed to load policy file:", err.message);
      process.exit(1);
    }
  }
};

const loadDropdownOptions = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true }); // Ensure data directory exists
    const data = await fs.readFile(dropdownFile, "utf-8");
    dropdownOptions = JSON.parse(data);
  } catch (err) {
     if (err.code === 'ENOENT') {
      console.log("policy-dropdown-options.json not found, starting with empty options.");
      dropdownOptions = {};
    } else {
      console.error("Failed to load dropdown options:", err.message);
      process.exit(1);
    }
  }
};

// --- DATA SAVING FUNCTIONS ---

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
    console.error("Failed to save policies:", err.message);
  }
};

const saveDropdownOptions = async () => {
    try {
        await fs.writeFile(dropdownFile, JSON.stringify(dropdownOptions, null, 2), "utf-8");
    } catch (err) {
        console.error("Failed to save dropdown options:", err.message);
    }
};

// --- HELPER FUNCTIONS ---

const paginate = (arr, page, size) => arr.slice(page * size, (page + 1) * size);

const matchesFilter = (policy, filters) => {
  return Object.entries(filters).every(([key, value]) => {
    // If filter value is empty/null, it's a match
    if (!value) return true;
    // If policy has the key and its value matches the filter value
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
            // Ensure the dropdown array exists
            if (!dropdownOptions[dropdownKey]) {
                dropdownOptions[dropdownKey] = [];
            }
            // Add the new value if it's not already in the list
            if (!dropdownOptions[dropdownKey].includes(value)) {
                dropdownOptions[dropdownKey].push(value);
                dropdownOptions[dropdownKey].sort(); // Keep it sorted
                updated = true;
            }
        }
    }
    return updated;
};


// --- API ENDPOINTS ---

app.get("/api/policy-dashboard", (req, res) => {
  const {
    jurisdiction, // Note: query keys are singular as per component
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

// [NEW] Add Policy Endpoint
app.post("/api/policy-dashboard", async (req, res) => {
    const newPolicyData = req.body;

    if (!newPolicyData || typeof newPolicyData !== 'object') {
        return res.status(400).json({ status: 'error', message: 'Invalid policy data provided.' });
    }

    // Determine the next available ID
    const maxId = policies.reduce((max, p) => (p.id > max ? p.id : max), 0);

    // Construct the policy with only the fields relevant for searching/display
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
        status: 'Pending' // Default status for new policies
    };

    policies.push(newPolicy);

    // Update dropdown options if necessary
    const dropdownsChanged = updateDropdownOptions(newPolicy);

    // Asynchronously save both files
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


// Default 404 handler
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
    console.log(`🔥 Policy API running at http://localhost:${PORT}`);
  });
};

startServer();
