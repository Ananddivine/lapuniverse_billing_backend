const Invoice =   require("../models/Invoice");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.createInvoice = async (req, res) => {
  const { invoiceDate, invoiceNumber, gstNumber, taxPercent, products, subtotal, tax, total } = req.body;

  try {
    // Check if the invoice number already exists in the database
    const existingInvoice = await Invoice.findOne({ invoiceNumber });

    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, "..", "uploads", "invoices", `${invoiceNumber}.pdf`);
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text(`Invoice No: ${invoiceNumber}`, { align: "center" });
    doc.text(`Customer: ${req.body.customerName}`, { align: "center" });
    doc.text(`GST Number: ${gstNumber}`);
    doc.text(`Tax Percentage: ${taxPercent}%`);
    doc.text(`Invoice Date: ${invoiceDate}`);
    doc.text("\nProducts:");

    products.forEach((product) => {
      doc.text(`${product.name} - ₹${product.price} x ${product.quantity}`);
    });

    doc.text(`\nSubtotal: ₹${subtotal}`);
    doc.text(`Tax: ₹${tax}`);
    doc.text(`Total: ₹${total}`);

    doc.end();

    // Save invoice data to MongoDB
    const newInvoice = new Invoice({
      invoiceNumber,
      customerName: req.body.customerName,
      customerEmail: req.body.customerName,
      customerNumber: req.body.customerNumber,
      gstNumber,
      taxPercent,
      products,
      subtotal,
      tax,
      total,
      invoicePdf: `invoices/${invoiceNumber}.pdf`,
    });

    await newInvoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

exports.getLastInvoiceNumber = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 }); // Assuming `Invoice` is your model
    res.json({ lastInvoiceNumber: lastInvoice ? lastInvoice.invoiceNumber : "0000" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch last invoice number" });
  }
};

exports.deleteInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    // Find and delete the invoice by ID
    const invoice = await Invoice.findByIdAndDelete(invoiceId);

    // If no invoice is found, return an error
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Optionally, delete the associated PDF file from the server
    const pdfPath = path.join(__dirname, "..", "uploads", "invoices", `${invoice.invoiceNumber}.pdf`);
    fs.unlink(pdfPath, (err) => {
      if (err) {
        console.error("Failed to delete the invoice PDF file", err);
      }
    });

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getCustomerInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find(); // Fetch all invoices
    const customers = invoices.map(invoice => ({
      name: invoice.customerName,
      email: invoice.customerEmail,
      contact: invoice.customerNumber,
      invoiceNumber: invoice.invoiceNumber
    }));
    res.status(200).json(customers);  // Send customers' data from invoices
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};
