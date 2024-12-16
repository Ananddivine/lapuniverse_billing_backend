const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const upload = require("../config/multer");

// Route to create invoice with PDF
router.post("/create", upload.single("invoicePdf"), invoiceController.createInvoice);

// Route to fetch all invoices
router.get("/all", invoiceController.getInvoices);

module.exports = router;
