const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 1002;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data", "my-app-policies.data.json");
let policies = [];

const policyDetailsFile = path.join(__dirname, "data", "policy-details.data.json");
let policyDetails = {};

const loadPolicies = async () => {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    policies = JSON.parse(data);
  } catch (err) {
    process.exit(1);
  }
};

const loadPolicyDetails = async () => {
  try {
    const data = await fs.readFile(policyDetailsFile, "utf-8");
    policyDetails = JSON.parse(data);
  } catch (err) {
    process.exit(1);
  }
};

const paginate = (array, page, size) => {
  return array.slice(page * size, (page + 1) * size);
};

// --- Define routes after setup ---
app.put("/api/my-app-policies/:id/expiration", async (req, res) => {
  const { id } = req.params;
  const { expirationDate } = req.body;

  console.log('PUT /api/my-app-policies/:id/expiration called');
  console.log('Request body:', req.body);
  console.log('PolicyDetailsFile:', policyDetailsFile);
  console.log('PolicyDetails keys:', Object.keys(policyDetails));

  if (!expirationDate) {
    console.error('Missing expirationDate in payload');
    return res.status(400).json({
      message: "Expiration date is required",
      status: "error",
      data: null,
    });
  }

  if (!policyDetails[id]) {
    console.error(`Policy with ID ${id} not found`);
    return res.status(404).json({
      message: `Policy with ID ${id} not found`,
      status: "error",
      data: null,
    });
  }

  policyDetails[id].expirationDate = expirationDate;
  policyDetails[id].updatedDate = new Date().toISOString().slice(0, 10);

  // Persist the change to the file
  try {
    await fs.writeFile(policyDetailsFile, JSON.stringify(policyDetails, null, 2), "utf-8");
    console.log(`Expiration date for policy ${id} updated successfully`);
    res.json({
      message: `Expiration date for policy ${id} updated successfully`,
      status: "success",
      data: policyDetails[id],
    });
  } catch (err) {
    console.error('Failed to update expiration date:', err);
    res.status(500).json({
      message: "Failed to update expiration date",
      status: "error",
      data: null,
    });
  }
});

app.get("/api/my-app-policies", (req, res) => {
  const {
    page = 0,
    size = 10,
    sortBy,
    direction = "asc",
  } = req.query;

  let processedPolicies = [...policies];

  if (sortBy) {
    processedPolicies.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';

      if (typeof valA === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return direction === 'asc' ? valA - valB : valB - valA;
    });
  }

  const pageNumber = parseInt(page);
  const pageSize = parseInt(size);
  const pagedData = paginate(processedPolicies, pageNumber, pageSize);

  res.json({
    message: "Policy list loaded successfully",
    status: "success",
    data: {
      content: pagedData,
      totalElements: processedPolicies.length,
      totalPages: Math.ceil(processedPolicies.length / pageSize),
      size: pageSize,
      number: pageNumber,
      numberOfElements: pagedData.length,
      first: pageNumber === 0,
      last: (pageNumber + 1) * pageSize >= processedPolicies.length,
    },
  });
});

app.get("/api/my-app-policies/:id", (req, res) => {
  const { id } = req.params;
  const policy = policyDetails[id];

  if (policy) {
    res.json({
      message: `Policy ${id} loaded successfully`,
      status: "success",
      data: policy,
    });
  } else {
    res.status(404).json({
      message: `Policy with ID ${id} not found`,
      status: "error",
      data: null,
    });
  }
});

const startServer = async () => {
  await loadPolicies();
  await loadPolicyDetails();
  app.listen(PORT, () => {
  });
};

startServer();
