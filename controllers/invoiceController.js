const Invoice =   require("../models/Invoice");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.createInvoice = async (req, res) => {
  const { invoiceDate, invoiceNumber, gstNumber, taxPercent, products, subtotal, tax, total } = req.body;

  try {
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
