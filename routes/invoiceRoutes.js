const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const upload = require("../config/multer");
const { getLastInvoiceNumber, deleteInvoice, getCustomerInvoices } = require("../controllers/invoiceController");
const Invoice = require('../models/Invoice'); 


// Route to create invoice with PDF
router.post("/create", upload.single("invoicePdf"), invoiceController.createInvoice);

// Route to fetch all invoices
router.get("/all", invoiceController.getInvoices);


router.get("/data", getCustomerInvoices);



// routes/invoiceRoutes.js
router.get("/last", getLastInvoiceNumber);

router.delete('/delete/:invoiceId', deleteInvoice);

// Endpoint to get all invoices (with customer details)
router.get('/all', async (req, res) => {
    try {
      const invoices = await Invoice.find();  // Fetch all invoices
      res.status(200).json(invoices); // Send invoices to frontend
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

module.exports = router;
