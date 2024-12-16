const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    customerName: String,
    customerEmail: String,
    customerNumber: String,
    gstNumber: String,
    taxPercent: Number,
    products: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    invoicePdf: { type: String }, // Path to the PDF
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
